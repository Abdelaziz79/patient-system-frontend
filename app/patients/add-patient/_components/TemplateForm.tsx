import { useLanguage } from "@/app/_contexts/LanguageContext";
import { PatientTemplate } from "@/app/_types/Template";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import { FormFields } from "./FormFields";
import { PatientStatus } from "./PatientStatus";

interface TemplateFormProps {
  selectedTemplate: PatientTemplate;
  form: UseFormReturn<any>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onValidationChange?: (isValid: boolean, isLastSection: boolean) => void;
}

export const TemplateForm = ({
  selectedTemplate,
  form,
  activeTab,
  setActiveTab,
  onValidationChange,
}: TemplateFormProps) => {
  const { t, dir } = useLanguage();
  const [sectionValidation, setSectionValidation] = useState<
    Record<string, boolean>
  >({});
  const [allSectionsValid, setAllSectionsValid] = useState(false);
  const isLastSection =
    activeTab ===
    selectedTemplate.sections[selectedTemplate.sections.length - 1].name;

  // Set up validation rules when template changes
  useEffect(() => {
    if (selectedTemplate) {
      // Initialize section validation state
      const initialValidation: Record<string, boolean> = {};
      selectedTemplate.sections.forEach((section) => {
        // Default to false if section has required fields
        const hasRequiredFields = section.fields.some(
          (field) => field.required
        );
        initialValidation[section.name] = !hasRequiredFields;
      });
      setSectionValidation(initialValidation);

      // Collect all fields from all sections
      const allFields = selectedTemplate.sections.flatMap(
        (section) => section.fields
      );

      // Create validation schema for react-hook-form
      const validationRules: Record<string, any> = {};

      allFields.forEach((field) => {
        if (field.required) {
          // For boolean fields, we only check if the value is defined, not its truthiness
          if (field.type === "boolean") {
            validationRules[field.name] = {
              validate: (value: any) =>
                value !== undefined ||
                `${t(field.label as any) || field.label} ${
                  t("isRequired") || "is required"
                }`,
            };
          } else {
            validationRules[field.name] = {
              required: `${t(field.label as any) || field.label} ${
                t("isRequired") || "is required"
              }`,
            };
          }

          // Add specific validation based on field type
          if (field.type === "email") {
            validationRules[field.name].pattern = {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t("invalidEmail") || "Invalid email address",
            };
          }

          if (field.type === "phone") {
            validationRules[field.name].pattern = {
              value: /^[0-9+\-\s()]*$/,
              message: t("invalidPhone") || "Invalid phone number",
            };
          }
        }
      });

      // Register all fields with their validation rules
      Object.entries(validationRules).forEach(([fieldName, rules]) => {
        form.register(fieldName, rules);
      });
    }
  }, [selectedTemplate, form, t]);

  // Update section validation status when form state changes
  useEffect(() => {
    const subscription = form.watch(() => {
      if (selectedTemplate) {
        // Check all sections for validity
        const newSectionValidation: Record<string, boolean> = {};
        let allValid = true;

        selectedTemplate.sections.forEach((section) => {
          // Get required fields for this section
          const requiredFields = section.fields.filter((f) => f.required);

          if (requiredFields.length === 0) {
            // If no required fields, section is valid
            newSectionValidation[section.name] = true;
          } else {
            // Check if all required fields are filled and valid
            const formValues = form.getValues();
            const formErrors = form.formState.errors;

            const sectionValid = requiredFields.every((field) => {
              const fieldName = field.name;

              // For boolean fields, consider both true and false as valid values
              if (field.type === "boolean") {
                return (
                  formValues[fieldName] !== undefined && !formErrors[fieldName]
                );
              }

              // For other field types, check if they have a value
              return formValues[fieldName] && !formErrors[fieldName];
            });

            newSectionValidation[section.name] = sectionValid;

            // If any section is invalid, the whole form is invalid
            if (!sectionValid) {
              allValid = false;
            }
          }
        });

        setSectionValidation(newSectionValidation);
        setAllSectionsValid(allValid);

        // Notify parent component of validation status
        if (onValidationChange) {
          onValidationChange(allValid, isLastSection);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, selectedTemplate, isLastSection, onValidationChange]);

  // Also update validation status when active tab changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(allSectionsValid, isLastSection);
    }
  }, [activeTab, allSectionsValid, isLastSection, onValidationChange]);

  // Check if the user can move to the next section
  const canMoveToSection = (targetSection: string) => {
    // Find current section index
    const currentIndex = selectedTemplate.sections.findIndex(
      (s) => s.name === activeTab
    );
    // Find target section index
    const targetIndex = selectedTemplate.sections.findIndex(
      (s) => s.name === targetSection
    );

    // If moving forward, check if previous sections are valid
    if (targetIndex > currentIndex) {
      for (let i = 0; i <= currentIndex; i++) {
        const sectionName = selectedTemplate.sections[i].name;
        if (!sectionValidation[sectionName]) {
          return false;
        }
      }
    }

    return true;
  };

  // Handle tab change with validation
  const handleTabChange = (value: string) => {
    // Find current section index
    const currentIndex = selectedTemplate.sections.findIndex(
      (s) => s.name === activeTab
    );
    // Find target section index
    const targetIndex = selectedTemplate.sections.findIndex(
      (s) => s.name === value
    );

    // Allow freely moving to previous sections without validation
    if (targetIndex < currentIndex) {
      setActiveTab(value);
      return;
    }

    // For moving forward, validate
    if (canMoveToSection(value)) {
      setActiveTab(value);
    } else {
      // Validate current section to show errors
      form.trigger();
      // Show toast notification that required fields must be filled
      const currentSectionLabel = selectedTemplate.sections.find(
        (s) => s.name === activeTab
      )?.label;
      toast.error(
        t("completeRequiredFields") ||
          `Please complete all required fields in "${currentSectionLabel}" before proceeding.`
      );
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
          dir={dir as "ltr" | "rtl"}
        >
          <div className="border dark:border-slate-700 rounded-lg mb-6 overflow-hidden">
            <TabsList
              className={
                "flex w-full bg-slate-50 dark:bg-slate-800/50 h-auto p-1 overflow-x-auto hide-scrollbar"
              }
            >
              {selectedTemplate.sections.map((section, index) => {
                const isActive = activeTab === section.name;
                const isValid = sectionValidation[section.name];
                const showValidation =
                  form.formState.submitCount > 0 || form.formState.isDirty;

                return (
                  <TabsTrigger
                    key={section.name}
                    value={section.name}
                    className={cn(
                      "relative text-sm transition-all duration-200 flex items-center",
                      "px-3 py-2.5 my-0.5 mx-0.5 first:mx-0.5 rounded-md",
                      "flex-shrink-0 min-w-max sm:flex-1",
                      isActive
                        ? "text-white bg-blue-600 shadow-md"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                    )}
                  >
                    <div className={"flex items-center gap-x-2 w-full"}>
                      <span
                        className={cn(
                          "flex items-center justify-center w-5 h-5 rounded-full text-xs flex-shrink-0 font-medium",
                          isActive
                            ? "bg-white text-blue-700"
                            : "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300"
                        )}
                      >
                        {index + 1}
                      </span>
                      <span className="truncate max-w-[60px] sm:max-w-[100px] md:max-w-full">
                        {t(section.label as any) || section.label}
                      </span>

                      {showValidation && (
                        <span className="mxauto flex-shrink-0">
                          {isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {selectedTemplate.sections.map((section) => (
            <TabsContent
              key={section.name}
              value={section.name}
              className={cn(
                "space-y-4",
                // Make sure content is not hidden by default
                "block"
              )}
            >
              {section.description && (
                <div className="text-sm text-muted-foreground p-4 mb-6 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 rounded-lg">
                  <div className={"flex items-start"}>
                    <AlertCircle className="h-5 w-5 text-blue-700 dark:text-blue-400 mx-2 mt-0.5" />
                    <p className="dark:text-slate-300">
                      {t(section.description as any) || section.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                {section.fields.map((field) => (
                  <FormFields
                    key={field.name}
                    field={field}
                    control={form.control}
                  />
                ))}
              </div>

              {!isLastSection && (
                <div className={"flex justify-end pt-4 gap-x-3"}>
                  {/* Add Previous button - only show if not on first section */}
                  {activeTab !== selectedTemplate.sections[0].name && (
                    <button
                      type="button"
                      className="px-4 py-2 rounded-md font-medium transition-colors bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600"
                      onClick={() => {
                        const currentIndex =
                          selectedTemplate.sections.findIndex(
                            (s) => s.name === activeTab
                          );
                        if (currentIndex > 0) {
                          handleTabChange(
                            selectedTemplate.sections[currentIndex - 1].name
                          );
                        }
                      }}
                    >
                      {t("previousSection") || "Previous Section"}
                    </button>
                  )}
                  <button
                    type="button"
                    className={cn(
                      "px-4 py-2 rounded-md font-medium transition-colors",
                      sectionValidation[section.name]
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    )}
                    onClick={() => {
                      const nextIndex =
                        selectedTemplate.sections.findIndex(
                          (s) => s.name === section.name
                        ) + 1;
                      if (nextIndex < selectedTemplate.sections.length) {
                        handleTabChange(
                          selectedTemplate.sections[nextIndex].name
                        );
                      }
                    }}
                    disabled={!sectionValidation[section.name]}
                  >
                    {t("nextSection") || "Next Section"}
                  </button>
                </div>
              )}

              {isLastSection &&
                activeTab !== selectedTemplate.sections[0].name && (
                  <div className={"flex justify-end pt-4"}>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-md font-medium transition-colors bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600"
                      onClick={() => {
                        const currentIndex =
                          selectedTemplate.sections.findIndex(
                            (s) => s.name === activeTab
                          );
                        if (currentIndex > 0) {
                          handleTabChange(
                            selectedTemplate.sections[currentIndex - 1].name
                          );
                        }
                      }}
                    >
                      {t("previousSection") || "Previous Section"}
                    </button>
                  </div>
                )}
            </TabsContent>
          ))}
        </Tabs>

        <PatientStatus form={form} />
      </form>
    </Form>
  );
};

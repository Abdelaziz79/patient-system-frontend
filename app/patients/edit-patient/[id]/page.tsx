"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import { useTemplates } from "@/app/_hooks/template/useTemplates";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../_providers/AuthProvider";
import { IPatient } from "../../../_types/Patient";
import {
  createTemplateFromPatientData,
  ExtendedPatientTemplate,
  FormFooter,
  PatientForm,
  PatientFormData,
  PatientHeader,
  PatientLoader,
  PersonalInfoForm,
  SuccessMessage,
} from "./_components";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  const patientInitialized = useRef(false);
  const templateInitialized = useRef(false);
  const { t, dir } = useLanguage();

  // Form state
  const form = useForm<PatientFormData>({
    defaultValues: {},
    mode: "onChange",
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>("");
  const [formProgress, setFormProgress] = useState(20);
  const [activeMainTab, setActiveMainTab] = useState<"details" | "personal">(
    "personal"
  );
  const [formState, setFormState] = useState({
    isValid: true,
    isSaving: false,
    showSuccess: false,
    isLastSection: false,
  });

  // Data state
  const [patientTemplate, setPatientTemplate] =
    useState<ExtendedPatientTemplate | null>(null);
  const [patientStatusOptions, setPatientStatusOptions] = useState<any[]>([]);

  // Hooks
  const { user } = useAuthContext();
  const { getTemplate } = useTemplates(false);
  const {
    patientById,
    isLoadingPatientById,
    patientByIdError,
    updatePatient,
    changePatientStatus,
    getStatusOptions,
    updatePersonalInfo,
  } = usePatient({ patientId });

  // Tab navigation handlers
  const handleNextTab = useCallback(() => {
    if (activeMainTab === "personal") {
      setActiveMainTab("details");
    } else if (patientTemplate && activeTab) {
      const currentIndex = patientTemplate.sections.findIndex(
        (section) => section.name === activeTab
      );
      if (currentIndex < patientTemplate.sections.length - 1) {
        setActiveTab(patientTemplate.sections[currentIndex + 1].name);
      }
    }
  }, [activeMainTab, patientTemplate, activeTab]);

  const handlePrevTab = useCallback(() => {
    if (
      activeMainTab === "details" &&
      activeTab === patientTemplate?.sections[0]?.name
    ) {
      setActiveMainTab("personal");
    } else if (patientTemplate && activeTab) {
      const currentIndex = patientTemplate.sections.findIndex(
        (section) => section.name === activeTab
      );
      if (currentIndex > 0) {
        setActiveTab(patientTemplate.sections[currentIndex - 1].name);
      }
    }
  }, [activeMainTab, patientTemplate, activeTab]);

  const handleGoBack = useCallback(() => {
    router.push("/patients");
  }, [router]);

  // Update last section state when tab changes
  useEffect(() => {
    if (patientTemplate && activeMainTab === "details") {
      const lastSectionName =
        patientTemplate.sections[patientTemplate.sections.length - 1]?.name;
      setFormState((prev) => ({
        ...prev,
        isLastSection: activeTab === lastSectionName,
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        isLastSection: activeMainTab === "details",
      }));
    }
  }, [activeTab, activeMainTab, patientTemplate]);

  // Update progress when active tab changes
  useEffect(() => {
    if (activeMainTab === "personal") {
      setFormProgress(20);
    } else if (
      patientTemplate &&
      patientTemplate.sections.length > 0 &&
      activeTab
    ) {
      const currentIndex = patientTemplate.sections.findIndex(
        (section) => section.name === activeTab
      );
      const baseProgress = 20;
      const templateProgress =
        ((currentIndex + 1) / patientTemplate.sections.length) * 80;
      setFormProgress(Math.round(baseProgress + templateProgress));
    }
  }, [activeTab, patientTemplate, activeMainTab]);

  // Single initialization effect for patient data
  useEffect(() => {
    // Skip if already initialized or no patient data
    if (patientInitialized.current || !patientById) return;

    const initializePatientData = async () => {
      try {
        // 1. Fetch status options
        let statusOptions;
        try {
          statusOptions = await getStatusOptions(patientId);
        } catch (error) {
          console.error("Error fetching status options:", error);
          // Default status option if API call fails
          if (patientById.status) {
            statusOptions = [
              {
                name: patientById.status.name,
                label: patientById.status.label || patientById.status.name,
                color: patientById.status.color || "#4CAF50",
                isDefault: true,
              },
            ];
          } else {
            statusOptions = [];
          }
        }

        // Set status options
        if (statusOptions && statusOptions.length > 0) {
          setPatientStatusOptions(statusOptions);
        } else if (patientById.status) {
          setPatientStatusOptions([
            {
              name: patientById.status.name,
              label: patientById.status.label || patientById.status.name,
              color: patientById.status.color || "#4CAF50",
              isDefault: true,
            },
          ]);
        }

        // 2. Build form initial values
        const formValues: Record<string, any> = {};

        // Process section data
        if (patientById.sectionData) {
          Object.entries(patientById.sectionData).forEach(
            ([sectionName, sectionData]) => {
              Object.entries(sectionData as Record<string, any>).forEach(
                ([fieldName, fieldValue]) => {
                  formValues[fieldName] = fieldValue;
                }
              );
            }
          );
        }

        // Add status data
        if (patientById.status) {
          formValues.patientStatus = patientById.status.name;
          formValues.patientStatusData = patientById.status;
        }

        // Add personal info
        if (patientById.personalInfo) {
          formValues.personalInfo = patientById.personalInfo;
        }

        // Batch update form values
        form.reset(formValues);

        // Mark patient data as initialized
        patientInitialized.current = true;
      } catch (error) {
        console.error("Error initializing patient data:", error);
      }
    };

    initializePatientData();
  }, [patientById, patientId, getStatusOptions, form]);

  // Template initialization (runs after patient data and status options are ready)
  useEffect(() => {
    if (
      templateInitialized.current ||
      !patientById ||
      !patientStatusOptions.length ||
      !patientInitialized.current
    ) {
      return;
    }

    const initializeTemplate = async () => {
      try {
        // Try to load template from API
        let template: ExtendedPatientTemplate | null = null;

        if (patientById.templateId?.id) {
          try {
            const fullTemplate = await getTemplate(patientById.templateId.id);
            if (fullTemplate) {
              template = {
                ...fullTemplate,
                statusOptions: patientStatusOptions,
              };
            }
          } catch (error) {
            console.error("Error fetching template:", error);
          }
        }

        // If template API failed, create from patient data
        if (!template) {
          template = createTemplateFromPatientData(patientById);
          template.statusOptions = patientStatusOptions;
        }

        // Update template state
        setPatientTemplate(template);

        // Set first section as active tab
        if (template.sections.length > 0) {
          setActiveTab(template.sections[0].name);
        }

        // Mark template as initialized
        templateInitialized.current = true;
      } catch (error) {
        console.error("Error initializing template:", error);
      }
    };

    initializeTemplate();
  }, [
    patientById,
    patientStatusOptions,
    getTemplate,
    patientInitialized.current,
  ]);

  // Form submission handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!patientById) {
        toast.error(t("patientDataNotLoaded"));
        return;
      }

      // Validate form
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error(t("pleaseCheckForm"));
        return;
      }

      setFormState((prev) => ({ ...prev, isSaving: true }));

      try {
        const formData = form.getValues();

        // Handle personal info tab
        if (activeMainTab === "personal") {
          if (formData.personalInfo) {
            const result = await updatePersonalInfo(
              patientId,
              formData.personalInfo
            );
            if (result.success) {
              setFormState((prev) => ({ ...prev, showSuccess: true }));
              toast.success(t("personalInfoUpdated"));
              setTimeout(() => {
                setFormState((prev) => ({ ...prev, showSuccess: false }));
                router.push("/patients");
              }, 2000);
            } else {
              toast.error(result.error || t("failedToUpdatePersonalInfo"));
            }
          }
          return;
        }

        // Handle details tab
        // Organize form data into sections
        const organizedSectionData: Record<string, any> = {};

        // Start with existing section data structure
        if (patientById.sectionData) {
          Object.keys(patientById.sectionData).forEach((sectionName) => {
            organizedSectionData[sectionName] = {};
          });
        }

        // Process each field and add to appropriate section
        if (patientTemplate) {
          patientTemplate.sections.forEach((section) => {
            if (!organizedSectionData[section.name]) {
              organizedSectionData[section.name] = {};
            }

            section.fields.forEach((field) => {
              if (formData[field.name] !== undefined) {
                organizedSectionData[section.name][field.name] =
                  formData[field.name];
              }
            });
          });
        }

        // Update status if changed
        let statusUpdateSuccess = true;
        if (
          formData.patientStatusData &&
          (patientById.status?.name !== formData.patientStatusData.name ||
            patientById.status?.label !== formData.patientStatusData.label)
        ) {
          const statusResult = await changePatientStatus(
            patientId,
            formData.patientStatusData
          );
          statusUpdateSuccess = statusResult.success;
          if (!statusUpdateSuccess) {
            toast.error(statusResult.error || t("failedToUpdatePatientStatus"));
          }
        }

        // Prepare patient update data
        const patientUpdateData: Partial<IPatient> = {
          sectionData: organizedSectionData,
          lastUpdatedBy: user?.id,
        };

        // Update patient data
        const result = await updatePatient(patientId, patientUpdateData);

        if (result.success && statusUpdateSuccess) {
          setFormState((prev) => ({ ...prev, showSuccess: true }));
          toast.success(t("patientDataUpdated"));
          setTimeout(() => {
            setFormState((prev) => ({ ...prev, showSuccess: false }));
            router.push("/patients");
          }, 2000);
        } else if (result.success) {
          toast.success(t("patientDataUpdatedStatusFailed"));
        } else {
          toast.error(result.error || t("failedToUpdatePatient"));
        }
      } catch (err) {
        console.error("Error updating patient:", err);
        toast.error(t("errorUpdatingPatient"));
      } finally {
        setFormState((prev) => ({ ...prev, isSaving: false }));
      }
    },
    [
      patientById,
      form,
      activeMainTab,
      patientId,
      updatePersonalInfo,
      router,
      patientTemplate,
      changePatientStatus,
      user,
      updatePatient,
      t,
    ]
  );

  // Loading/error state
  if (isLoadingPatientById || patientByIdError || !patientById) {
    return (
      <PatientLoader
        loading={isLoadingPatientById}
        error={patientByIdError ? patientByIdError.message : null}
        patient={patientById}
        handleGoBack={handleGoBack}
      />
    );
  }

  return (
    <div className="flex justify-center p-2 py-8 min-h-screen" dir={dir}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-5xl"
      >
        <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-green-100 dark:border-green-950 shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="p-0">
            <PatientHeader
              patient={patientById}
              formProgress={formProgress}
              handleGoBack={handleGoBack}
            />
          </CardHeader>

          <AnimatePresence mode="wait" initial={false}>
            {formState.showSuccess ? (
              <SuccessMessage handleGoBack={handleGoBack} />
            ) : (
              <form onSubmit={handleSubmit}>
                <CardContent className="px-6 pt-6">
                  <Tabs
                    value={activeMainTab}
                    onValueChange={(value: string) =>
                      setActiveMainTab(value as "details" | "personal")
                    }
                    className="w-full"
                  >
                    <TabsList className="mb-6 grid grid-cols-2 bg-green-50 dark:bg-green-900/30 p-1 rounded-lg w-full">
                      <TabsTrigger
                        value="personal"
                        className={` data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all duration-200`}
                      >
                        {t("personalInfo")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="details"
                        className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all duration-200"
                      >
                        {t("templateDetails")}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="mt-0">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-slate-800/90 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 w-full"
                        dir={dir}
                      >
                        <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-4 flex items-center">
                          <span className="mx-2 bg-green-100 dark:bg-green-900/50 p-1 rounded">
                            👤
                          </span>
                          {t("personalInformation")}
                        </h3>
                        <PersonalInfoForm
                          form={form}
                          initialData={patientById.personalInfo}
                        />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="details" className="mt-0">
                      {patientTemplate && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <PatientForm
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            patientTemplate={patientTemplate}
                            form={form}
                            patientStatusOptions={patientStatusOptions}
                          />
                        </motion.div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>

                <CardFooter>
                  <FormFooter
                    isSaving={formState.isSaving}
                    handleGoBack={handleGoBack}
                    handlePrevTab={handlePrevTab}
                    handleNextTab={handleNextTab}
                    isFirstTab={activeMainTab === "personal"}
                    isLastSection={formState.isLastSection}
                  />
                </CardFooter>
              </form>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}

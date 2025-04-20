"use client";

import { usePatient } from "@/app/_hooks/usePatient";
import { PatientTemplate } from "@/app/_types/Template";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, SaveIcon, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthContext } from "../../_providers/AuthProvider";
import { IStatus } from "../../_types/Patient";
import { TemplateForm } from "./_components/TemplateForm";
import { TemplateSelection } from "./_components/TemplateSelection";

// Define the form data interface
interface PatientFormData {
  patientStatus?: string;
  patientStatusData?: IStatus;
  [key: string]: any; // For dynamic fields
}

export default function AddPatientPage() {
  const [activeTab, setActiveTab] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<PatientTemplate | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedPatientId, setSubmittedPatientId] = useState<string | null>(
    null
  );
  const [formIsValid, setFormIsValid] = useState(false);
  const [isLastSection, setIsLastSection] = useState(false);

  const form = useForm<PatientFormData>({
    defaultValues: {}, // Initialize with empty values to ensure controlled inputs
    mode: "onChange", // Validate fields on change
  });

  // Initialize the usePatient hook
  const { createPatient, isCreating, error } = usePatient({
    initialFetch: false, // We don't need to fetch patients list initially
  });
  const { user } = useAuthContext();

  // Handle validation status changes from TemplateForm
  const handleValidationChange = (isValid: boolean, onLastSection: boolean) => {
    setFormIsValid(isValid);
    setIsLastSection(onLastSection);
  };

  // Select first section as active tab when template changes
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.sections.length > 0) {
      setActiveTab(selectedTemplate.sections[0].name);
      // Reset progress
      setFormProgress(0);

      // Reset the form with default values for boolean fields
      const defaultValues: Record<string, any> = {};

      // Set default false for all boolean fields that are required
      const allFields = selectedTemplate.sections.flatMap(
        (section) => section.fields
      );
      allFields.forEach((field) => {
        if (field.type === "boolean" && field.required) {
          defaultValues[field.name] = false;
        }
      });

      form.reset(defaultValues);
      setFormIsValid(false);
      setIsLastSection(false);
    }
  }, [selectedTemplate, form]);

  // Update progress when active tab changes
  useEffect(() => {
    if (selectedTemplate) {
      const currentIndex = selectedTemplate.sections.findIndex(
        (section) => section.name === activeTab
      );
      const progressValue = Math.round(
        ((currentIndex + 1) / selectedTemplate.sections.length) * 100
      );
      setTimeout(() => setFormProgress(progressValue), 100);
    }
  }, [activeTab, selectedTemplate]);

  // Show error toast when hook reports an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }

    // Validate all form fields before submission
    const isValid = await form.trigger();
    if (!isValid) {
      // If validation fails, show error toast
      toast.error("Please fill in all required fields");

      // Find the first section with validation errors
      const formValues = form.getValues();
      const formErrors = form.formState.errors;
      const errorFields = Object.keys(formErrors);

      if (errorFields.length > 0) {
        // Find which section contains the first error field
        const errorField = errorFields[0];
        const errorSection = selectedTemplate.sections.find((section) =>
          section.fields.some((field) => field.name === errorField)
        );

        // If found, switch to that section tab
        if (errorSection) {
          setActiveTab(errorSection.name);
        }
        console.log("error", errorField, errorSection);
      }

      return;
    }

    const formData = form.getValues();
    // Organize form data into sections
    const organizedSectionData: Record<string, any> = {};

    // Process each section and its fields
    selectedTemplate.sections.forEach((section) => {
      const sectionFields = section.fields.map((field) => field.name);

      // Create section object
      organizedSectionData[section.name] = {};

      // Add field values to section
      sectionFields.forEach((fieldName) => {
        if (formData[fieldName] !== undefined) {
          organizedSectionData[section.name][fieldName] = formData[fieldName];
        }
      });
    });

    // Create the patient data object based on IPatient type
    const patientData: any = {
      templateId: selectedTemplate.id,
      sectionData: organizedSectionData, // Using nested object format instead of Map
      status: formData.patientStatusData || {
        name: "NEW",
        label: "New Patient",
        date: new Date(),
        color: "#3B82F6", // Blue color for new patients
      },
      statusHistory: [], // Will be populated on the server
      isActive: true,
      visits: [], // New patient has no visits
      createdBy: user?.id, // Replace with actual user ID from auth context
      tags: [], // Initialize with empty tags array
    };

    const result = await createPatient(patientData);

    if (result.success) {
      setSubmittedPatientId(result.data?.id || null);
      setShowSuccess(true);
      toast.success("Patient data saved successfully");
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form after success message disappears
        form.reset();
        setSelectedTemplate(null);
      }, 3000);
    } else {
      toast.error(result.error || "Failed to save patient data");
    }
  };

  return (
    <div className="flex items-center justify-center p-2 py-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-5xl"
      >
        <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-blue-100 dark:border-blue-950 shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 text-white px-6 py-5">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  New Patient Registration
                </CardTitle>
                <CardDescription className="text-blue-100 mt-1 opacity-90">
                  {selectedTemplate
                    ? `Using template: ${selectedTemplate.name}`
                    : "Select a template to begin patient registration"}
                </CardDescription>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/20 p-3 rounded-full backdrop-blur-sm"
              >
                <User className="h-8 w-8 text-white" />
              </motion.div>
            </div>

            {selectedTemplate && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-blue-100 mb-1">
                  <span>Progress</span>
                  <span>{formProgress}%</span>
                </div>
                <Progress
                  value={formProgress}
                  className="h-1.5 bg-blue-800/40 [&>div]:bg-white"
                />
              </div>
            )}
          </CardHeader>

          <CardContent className="px-6 pt-6">
            <AnimatePresence mode="wait">
              {!selectedTemplate ? (
                <motion.div
                  key="template-selection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TemplateSelection
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="template-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TemplateForm
                    selectedTemplate={selectedTemplate}
                    form={form}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onValidationChange={handleValidationChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="px-6 py-5 bg-gray-50 dark:bg-slate-900/50 dark:border-t dark:border-slate-800">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {selectedTemplate && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-1/3 border-gray-300 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-200"
                  onClick={() => setSelectedTemplate(null)}
                  disabled={isCreating}
                >
                  Change Template
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-1/3 border-gray-300 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-200 font-medium"
                disabled={isCreating}
              >
                Cancel
              </Button>

              <AnimatePresence>
                {showSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full sm:w-1/3 h-11 bg-green-600 dark:bg-green-700 text-white rounded-md flex items-center justify-center font-semibold"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Patient Saved!
                  </motion.div>
                ) : (
                  <Button
                    type="submit"
                    className={cn(
                      "w-full sm:w-1/3 text-white transition-all duration-200 font-semibold",
                      !isLastSection || !formIsValid
                        ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    )}
                    onClick={handleSubmit}
                    disabled={
                      isCreating ||
                      !selectedTemplate ||
                      !isLastSection ||
                      !formIsValid
                    }
                  >
                    {isCreating ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <SaveIcon className="mr-2 h-4 w-4" />
                        <span>
                          {!isLastSection
                            ? "Complete All Sections"
                            : !formIsValid
                            ? "Fill Required Fields"
                            : "Save Patient Data"}
                        </span>
                      </div>
                    )}
                  </Button>
                )}
              </AnimatePresence>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

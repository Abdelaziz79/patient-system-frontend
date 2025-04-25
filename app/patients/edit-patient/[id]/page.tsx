"use client";

import { usePatient } from "@/app/_hooks/usePatient";
import { useTemplates } from "@/app/_hooks/useTemplates";
import { PatientTemplate } from "@/app/_types/Template";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../_providers/AuthProvider";
import { IPatient } from "../../../_types/Patient";
import {
  createTemplateFromPatientData,
  FormFooter,
  PatientForm,
  PatientFormData,
  PatientHeader,
  PatientLoader,
  SuccessMessage,
} from "./_components";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<IPatient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [patientTemplate, setPatientTemplate] =
    useState<PatientTemplate | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formIsValid, setFormIsValid] = useState(true);
  const [isLastSection, setIsLastSection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>("");

  const { user } = useAuthContext();
  const { getTemplate } = useTemplates(false);

  const form = useForm<PatientFormData>({
    defaultValues: {},
    mode: "onChange",
  });

  const { getPatient, updatePatient, updatePatientStatus } = usePatient({
    initialFetch: false,
  });

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      if (isFetched || !patientId) return;

      try {
        setLoading(true);
        const patientData = await getPatient(patientId);

        if (!patientData) {
          setError("No patient data found");
        } else {
          setPatient(patientData);

          // Try to fetch the complete template data if available
          if (patientData.templateId?.id) {
            try {
              console.log(
                "Fetching template with ID:",
                patientData.templateId.id
              );
              const fullTemplate = await getTemplate(patientData.templateId.id);
              console.log("Full template:", fullTemplate);
              if (fullTemplate) {
                console.log(
                  "Template fetched successfully:",
                  fullTemplate.name
                );
                // Create status options from patient status
                if (patientData.status) {
                  // Add the current status if it doesn't exist in the template
                  const statusExists = fullTemplate.statusOptions.some(
                    (status) => status.name === patientData.status.name
                  );

                  if (!statusExists) {
                    fullTemplate.statusOptions.push({
                      name: patientData.status.name,
                      label:
                        patientData.status.label || patientData.status.name,
                      color: patientData.status.color || "#4CAF50",
                      isDefault: true,
                    });
                  } else {
                    // Mark the current status as selected/default
                    fullTemplate.statusOptions = fullTemplate.statusOptions.map(
                      (status) => ({
                        ...status,
                        isDefault: status.name === patientData.status.name,
                      })
                    );
                  }

                  setCurrentStatus(patientData.status.name);
                }

                setPatientTemplate(fullTemplate);

                // Set first section as active tab
                if (fullTemplate.sections.length > 0) {
                  setActiveTab(fullTemplate.sections[0].name);
                }
              }
            } catch (templateError) {
              console.error("Error fetching template:", templateError);

              // Fallback: create template from patient data
              const template = createTemplateFromPatientData(patientData);
              setPatientTemplate(template);

              // Set current status
              if (patientData.status) {
                setCurrentStatus(patientData.status.name);
              }

              // Set first section as active
              if (template.sections.length > 0) {
                setActiveTab(template.sections[0].name);
              }
            }
          } else {
            console.log(
              "No template ID found in patient data, creating from patient data"
            );
            // Fallback: create template from patient data
            const template = createTemplateFromPatientData(patientData);
            setPatientTemplate(template);

            // Set current status
            if (patientData.status) {
              setCurrentStatus(patientData.status.name);
            }

            // Set first section as active
            if (template.sections.length > 0) {
              setActiveTab(template.sections[0].name);
            }
          }

          // Initialize form with patient data
          const formValues: Record<string, any> = {};

          // Process section data
          if (patientData.sectionData) {
            Object.entries(patientData.sectionData).forEach(
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
          if (patientData.status) {
            formValues.patientStatus = patientData.status.name;
            formValues.patientStatusData = patientData.status;
          }

          // Set form default values
          form.reset(formValues);
        }
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Failed to load patient data");
      } finally {
        setLoading(false);
        setIsFetched(true);
      }
    };

    fetchPatientData();
  }, [getPatient, getTemplate, patientId, isFetched, form]);

  // Update progress when active tab changes
  useEffect(() => {
    if (patientTemplate && patientTemplate.sections.length > 0 && activeTab) {
      const currentIndex = patientTemplate.sections.findIndex(
        (section) => section.name === activeTab
      );
      const progressValue = Math.round(
        ((currentIndex + 1) / patientTemplate.sections.length) * 100
      );
      setTimeout(() => setFormProgress(progressValue), 100);
    }
  }, [activeTab, patientTemplate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patient) {
      toast.error("Patient data not loaded");
      return;
    }

    // Validate form
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please check the form for errors");
      return;
    }

    setIsSaving(true);

    try {
      const formData = form.getValues();

      // Organize form data into sections
      const organizedSectionData: Record<string, any> = {};

      // Start with existing section data structure
      if (patient.sectionData) {
        Object.keys(patient.sectionData).forEach((sectionName) => {
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
      if (
        formData.patientStatusData &&
        (patient.status?.name !== formData.patientStatusData.name ||
          patient.status?.label !== formData.patientStatusData.label)
      ) {
        // Update status separately to ensure history is recorded
        const statusResult = await updatePatientStatus(
          patientId,
          formData.patientStatusData
        );
        if (!statusResult.success) {
          toast.error(statusResult.error || "Failed to update patient status");
        }
      }

      // Prepare patient update data
      const patientUpdateData: Partial<IPatient> = {
        sectionData: organizedSectionData,
        lastUpdatedBy: user?.id,
      };

      // Update patient data
      const result = await updatePatient(patientId, patientUpdateData);

      if (result.success) {
        setShowSuccess(true);
        toast.success("Patient data updated successfully");
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        toast.error(result.error || "Failed to update patient data");
      }
    } catch (err) {
      console.error("Error updating patient:", err);
      toast.error("An error occurred while updating patient data");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // First render the loader for loading, error, or no patient states
  if (loading || error || !patient) {
    return (
      <PatientLoader
        loading={loading}
        error={error}
        patient={patient}
        handleGoBack={handleGoBack}
      />
    );
  }

  // Then render the main content when patient data is available
  return (
    <div className="flex justify-center p-2 py-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-5xl"
      >
        <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-green-100 dark:border-green-950 shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="p-0">
            <PatientHeader
              patient={patient}
              formProgress={formProgress}
              handleGoBack={handleGoBack}
            />
          </CardHeader>

          <AnimatePresence mode="wait">
            {showSuccess ? (
              <SuccessMessage handleGoBack={handleGoBack} />
            ) : (
              <form onSubmit={handleSubmit}>
                <CardContent className="px-6 pt-6">
                  {patientTemplate && (
                    <PatientForm
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      patientTemplate={patientTemplate}
                      form={form}
                    />
                  )}
                </CardContent>

                <CardFooter>
                  <FormFooter isSaving={isSaving} handleGoBack={handleGoBack} />
                </CardFooter>
              </form>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}

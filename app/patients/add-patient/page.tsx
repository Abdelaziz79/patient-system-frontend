"use client";

import { usePatient } from "@/app/_hooks/patient/usePatient";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  SaveIcon,
  User,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthContext } from "../../_providers/AuthProvider";
import { IPersonalInfo, IStatus } from "../../_types/Patient";
import { TemplateForm } from "./_components/TemplateForm";
import { TemplateSelection } from "./_components/TemplateSelection";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { CustomCalendar } from "@/app/_components/CustomCalendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

// Define the form data interface
interface PatientFormData {
  patientStatus?: string;
  patientStatusData?: IStatus;
  personalInfo: IPersonalInfo;
  [key: string]: any; // For dynamic fields
}

export default function AddPatientPage() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("");
  const [currentStep, setCurrentStep] = useState<
    "template" | "personal" | "details"
  >("template");
  const [selectedTemplate, setSelectedTemplate] =
    useState<PatientTemplate | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedPatientId, setSubmittedPatientId] = useState<string | null>(
    null
  );
  const [formIsValid, setFormIsValid] = useState(false);
  const [isLastSection, setIsLastSection] = useState(false);
  const [personalInfoValid, setPersonalInfoValid] = useState(false);

  const router = useRouter();

  const form = useForm<PatientFormData>({
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        dateOfBirth: undefined,
        gender: undefined,
        contactNumber: "",
        email: "",
        address: "",
        medicalRecordNumber: "",
        emergencyContact: {
          name: "",
          relationship: "",
          phone: "",
        },
        insuranceInfo: {
          provider: "",
          policyNumber: "",
          groupNumber: "",
        },
      },
    },
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
      const defaultValues: Record<string, any> = {
        personalInfo: form.getValues().personalInfo, // Keep personal info
      };

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

  // Calculate overall progress
  useEffect(() => {
    let progress = 0;

    if (currentStep === "template" && selectedTemplate) {
      progress = 20;
    } else if (currentStep === "personal" && personalInfoValid) {
      progress = 60;
    } else if (currentStep === "details") {
      progress = formProgress * 0.4 + 60; // Scale the remaining 40%
    }

    setFormProgress(progress);
  }, [currentStep, selectedTemplate, personalInfoValid, formProgress]);

  // Show error toast when hook reports an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Validate Personal Info
  const validatePersonalInfo = () => {
    const { personalInfo } = form.getValues();

    // Basic validation
    if (!personalInfo.firstName || !personalInfo.lastName) {
      toast.error("First name and last name are required");
      return false;
    }

    setPersonalInfoValid(true);
    setCurrentStep("details");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }

    // Validate all form fields before submission
    const isValid = await form.trigger();
    if (!isValid || !personalInfoValid) {
      // If validation fails, show error toast
      toast.error("Please fill in all required fields");

      // Find the first section with validation errors
      const formValues = form.getValues();
      const formErrors = form.formState.errors;
      const errorFields = Object.keys(formErrors);

      if (errorFields.length > 0) {
        // Find which section contains the first error field
        const errorField = errorFields[0];

        if (errorField.startsWith("personalInfo")) {
          setCurrentStep("personal");
          return;
        }

        const errorSection = selectedTemplate.sections.find((section) =>
          section.fields.some((field) => field.name === errorField)
        );

        // If found, switch to that section tab
        if (errorSection) {
          setActiveTab(errorSection.name);
          setCurrentStep("details");
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
      personalInfo: formData.personalInfo,
      sectionData: organizedSectionData, // Using nested object format instead of Map
      status: formData.patientStatusData || {
        name: "active",
        label: "Active",
        date: new Date(),
        color: "#28a745", // Green color for active patients
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
        // Navigate to patient detail page after success
        if (result.data?.id) {
          router.push(`/patients/${result.data.id}`);
        } else {
          // Reset form
          form.reset();
          setSelectedTemplate(null);
          setCurrentStep("template");
        }
      }, 2000);
    } else {
      toast.error(result.error || "Failed to save patient data");
    }
  };

  // Back button handler
  const handleBack = () => {
    if (currentStep === "details") {
      setCurrentStep("personal");
    } else if (currentStep === "personal") {
      setCurrentStep("template");
    }
  };

  // Determine which content to show based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "template":
        return (
          <motion.div
            key="template-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TemplateSelection
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              onNext={() => setCurrentStep("personal")}
            />
          </motion.div>
        );
      case "personal":
        return (
          <motion.div
            key="personal-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-1"
          >
            <h3 className="text-lg font-semibold mb-5 text-blue-800 dark:text-blue-300">
              {t("patientPersonalInformation") ||
                "Patient Personal Information"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-400">
                  {t("basicInformation") || "Basic Information"}
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm">
                    {t("firstName")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder={t("firstName")}
                    {...form.register("personalInfo.firstName", {
                      required: true,
                    })}
                    className={cn(
                      `${
                        form.formState.errors.personalInfo?.firstName
                          ? "border-red-500"
                          : ""
                      }`,
                      isRTL && "text-right"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm">
                    {t("lastName")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder={t("lastName")}
                    {...form.register("personalInfo.lastName", {
                      required: true,
                    })}
                    className={cn(
                      `${
                        form.formState.errors.personalInfo?.lastName
                          ? "border-red-500"
                          : ""
                      }`,
                      isRTL && "text-right"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm">
                    {t("birthdate") || "Date of Birth"}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dateOfBirth"
                        variant="outline"
                        className={cn(
                          "w-full px-3 text-left font-normal border-slate-300 dark:border-slate-700 dark:bg-slate-900/50 hover:border-blue-400 dark:hover:border-blue-600 dark:text-slate-200",
                          !form.watch("personalInfo.dateOfBirth") &&
                            "text-muted-foreground dark:text-slate-500",
                          isRTL && "text-right"
                        )}
                      >
                        {form.watch("personalInfo.dateOfBirth") ? (
                          format(
                            new Date(
                              form.watch("personalInfo.dateOfBirth") ||
                                new Date()
                            ),
                            "PPP"
                          )
                        ) : (
                          <span>
                            {t("selectDateOfBirth") || "Select date of birth"}
                          </span>
                        )}
                        <CalendarIcon className={cn("h-4 w-4 opacity-50")} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border-slate-200 dark:border-slate-700 dark:bg-slate-900"
                      align="start"
                    >
                      <CustomCalendar
                        selected={
                          form.watch("personalInfo.dateOfBirth")
                            ? new Date(
                                form.watch("personalInfo.dateOfBirth") ||
                                  new Date()
                              )
                            : undefined
                        }
                        onSelect={(date) =>
                          form.setValue("personalInfo.dateOfBirth", date)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm">
                    {t("gender")}
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue(
                        "personalInfo.gender",
                        value as "male" | "female"
                      )
                    }
                    value={form.watch("personalInfo.gender")}
                  >
                    <SelectTrigger className={cn(isRTL && "text-right")}>
                      <SelectValue
                        placeholder={t("selectGender") || "Select gender"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="male"
                        className={cn(isRTL && "text-right")}
                      >
                        {t("male") || "Male"}
                      </SelectItem>
                      <SelectItem
                        value="female"
                        className={cn(isRTL && "text-right")}
                      >
                        {t("female") || "Female"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalRecordNumber" className="text-sm">
                    {t("medicalRecordNumber") || "Medical Record Number"}
                  </Label>
                  <Input
                    id="medicalRecordNumber"
                    placeholder="MRN"
                    {...form.register("personalInfo.medicalRecordNumber")}
                    className={cn(isRTL && "text-right")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-400">
                  {t("contactInformation") || "Contact Information"}
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber" className="text-sm">
                    {t("contactNumber") || "Contact Number"}
                  </Label>
                  <Input
                    id="contactNumber"
                    placeholder={t("phoneTranslate") || "Phone Number"}
                    {...form.register("personalInfo.contactNumber")}
                    className={cn(isRTL && "text-right")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">
                    {t("emailName") || "Email"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailAddress") || "Email Address"}
                    {...form.register("personalInfo.email")}
                    className={cn(isRTL && "text-right")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm">
                    {t("addressName") || "Address"}
                  </Label>
                  <Input
                    id="address"
                    placeholder={t("addressName") || "Address"}
                    {...form.register("personalInfo.address")}
                    className={cn(isRTL && "text-right")}
                  />
                </div>

                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-400 mt-4 pt-2">
                  {t("emergencyContact") || "Emergency Contact"}
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="emergencyName" className="text-sm">
                    {t("emergencyContact") || "Emergency Contact Name"}
                  </Label>
                  <Input
                    id="emergencyName"
                    placeholder={t("contactName") || "Contact Name"}
                    {...form.register("personalInfo.emergencyContact.name")}
                    className={cn(isRTL && "text-right")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship" className="text-sm">
                      {t("relation") || "Relationship"}
                    </Label>
                    <Input
                      id="emergencyRelationship"
                      placeholder={t("relation") || "Relationship"}
                      {...form.register(
                        "personalInfo.emergencyContact.relationship"
                      )}
                      className={cn(isRTL && "text-right")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone" className="text-sm">
                      {t("phoneTranslate") || "Phone"}
                    </Label>
                    <Input
                      id="emergencyPhone"
                      placeholder={t("phoneTranslate") || "Phone Number"}
                      {...form.register("personalInfo.emergencyContact.phone")}
                      className={cn(isRTL && "text-right")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-400">
                  {t("insuranceInformation") || "Insurance Information"}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider" className="text-sm">
                      {t("provider") || "Insurance Provider"}
                    </Label>
                    <Input
                      id="provider"
                      placeholder={t("provider") || "Provider"}
                      {...form.register("personalInfo.insuranceInfo.provider")}
                      className={cn(isRTL && "text-right")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyNumber" className="text-sm">
                      {t("policyNumber") || "Policy Number"}
                    </Label>
                    <Input
                      id="policyNumber"
                      placeholder={t("policyNumber") || "Policy Number"}
                      {...form.register(
                        "personalInfo.insuranceInfo.policyNumber"
                      )}
                      className={cn(isRTL && "text-right")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="groupNumber" className="text-sm">
                      {t("groupNumber") || "Group Number"}
                    </Label>
                    <Input
                      id="groupNumber"
                      placeholder={t("groupNumber") || "Group Number"}
                      {...form.register(
                        "personalInfo.insuranceInfo.groupNumber"
                      )}
                      className={cn(isRTL && "text-right")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={cn("flex justify-end mt-6")}>
              <Button
                type="button"
                variant="outline"
                className={"me-2 mx-2"}
                onClick={handleBack}
              >
                {t("back") || "Back"}
              </Button>
              <Button
                type="button"
                onClick={validatePersonalInfo}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isRTL ? (
                  <>
                    <ArrowRight className="mx-2 h-4 w-4 rotate-180" />
                    {t("continue") || "Continue"}
                  </>
                ) : (
                  <>
                    {t("continue") || "Continue"}{" "}
                    <ArrowRight className="mx-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        );
      case "details":
        return (
          <motion.div
            key="template-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TemplateForm
              selectedTemplate={selectedTemplate!}
              form={form}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onValidationChange={handleValidationChange}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Calculate the title based on current step
  const getStepTitle = () => {
    switch (currentStep) {
      case "template":
        return t("selectPatientTemplate") || "Select Patient Template";
      case "personal":
        return t("enterPatientInformation") || "Enter Patient Information";
      case "details":
        if (selectedTemplate) {
          // For template with a name, just concat the strings
          return (
            (t("completePatientDetails") || "Complete") +
            " " +
            selectedTemplate.name
          );
        } else {
          return t("completePatientDetails") || "Complete Patient Details";
        }
      default:
        return t("newPatientRegistration") || "New Patient Registration";
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
                  {getStepTitle()}
                </CardTitle>
                <CardDescription className="text-blue-100 mt-1 opacity-90">
                  {currentStep === "template"
                    ? "Select a template to begin patient registration"
                    : currentStep === "personal"
                    ? "Enter the patient's personal information"
                    : selectedTemplate
                    ? `Completing template: ${selectedTemplate.name}`
                    : "Complete the patient registration form"}
                </CardDescription>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/20 p-3 rounded-full backdrop-blur-sm"
              >
                {currentStep === "personal" ? (
                  <UserCircle className="h-8 w-8 text-white" />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </motion.div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-blue-100 mb-1">
                <span>Progress</span>
                <span>{Math.round(formProgress)}%</span>
              </div>
              <Progress
                value={formProgress}
                className="h-1.5 bg-blue-800/40 [&>div]:bg-white"
              />
            </div>
          </CardHeader>

          <CardContent className="px-6 pt-6">
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
          </CardContent>

          <CardFooter className="px-6 py-5 bg-gray-50 dark:bg-slate-900/50 dark:border-t dark:border-slate-800">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {currentStep !== "template" && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-1/3 border-gray-300 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-200"
                  onClick={handleBack}
                  disabled={isCreating}
                >
                  {t("back") || "Back"}
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-1/3 border-gray-300 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-200 font-medium"
                onClick={() => router.push("/patients")}
                disabled={isCreating}
              >
                {t("cancel") || "Cancel"}
              </Button>

              <AnimatePresence>
                {showSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full sm:w-1/3 h-11 bg-green-600 dark:bg-green-700 text-white rounded-md flex items-center justify-center font-semibold"
                  >
                    <CheckCircle2 className="mx-2 h-5 w-5" />
                    Patient Saved!
                  </motion.div>
                ) : (
                  <Button
                    type={currentStep === "details" ? "submit" : "button"}
                    className={cn(
                      "w-full sm:w-1/3 text-white transition-all duration-200 font-semibold",
                      currentStep !== "details" ||
                        !isLastSection ||
                        !formIsValid ||
                        !personalInfoValid
                        ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    )}
                    onClick={
                      currentStep === "details" ? handleSubmit : undefined
                    }
                    disabled={
                      isCreating ||
                      (currentStep === "details" &&
                        (!selectedTemplate ||
                          !isLastSection ||
                          !formIsValid ||
                          !personalInfoValid))
                    }
                  >
                    {isCreating ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mx-2 h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {currentStep === "details" ? (
                          <>
                            <SaveIcon className="mx-2 h-4 w-4" />
                            <span>
                              {!isLastSection
                                ? "Complete All Sections"
                                : !formIsValid
                                ? "Fill Required Fields"
                                : "Save Patient Data"}
                            </span>
                          </>
                        ) : (
                          <span>{t("continue") || "Continue"}</span>
                        )}
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

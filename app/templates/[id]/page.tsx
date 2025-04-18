"use client";

import { motion } from "framer-motion";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CirclePlusIcon,
  EyeIcon,
  FileTextIcon,
  GripVerticalIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Field,
  PatientStatusOption,
  PatientTemplate,
  Section,
  fieldTypes,
} from "@/app/_types/Template";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function TemplateDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isViewMode = searchParams?.get("view") === "true";
  const isNew = params?.id === "new";
  const templateId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [template, setTemplate] = useState<PatientTemplate | null>(null);

  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<PatientStatusOption | null>(null);

  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const [currentTab, setCurrentTab] = useState("sections");
  const [fieldOptionText, setFieldOptionText] = useState("");
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [fieldToDelete, setFieldToDelete] = useState<{
    sectionId: string;
    fieldId: string;
  } | null>(null);
  const [statusToDelete, setStatusToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      // Initialize new template
      const newTemplate: PatientTemplate = {
        id: "new",
        name: "New Template",
        description: "",
        sections: [],
        statusOptions: [
          {
            id: Math.random().toString(36).substr(2),
            name: "active",
            label: "Active",
            color: "#4CAF50",
            isDefault: true,
          },
        ],
        isPrivate: false,
        isDefault: false,
        createdBy: "currentUser",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTemplate(newTemplate);
      setIsLoading(false);
      return;
    }

    // Fetch template data
    setIsLoading(true);
    setTimeout(() => {
      // This would be an API call in a real app
      const mockTemplates: PatientTemplate[] = [
        {
          id: "1",
          name: "General Patient Assessment",
          description: "Standard template for general patient assessment",
          sections: [
            {
              id: "section1",
              name: "personalInfo",
              label: "Personal Information",
              description: "Basic patient details",
              fields: [
                {
                  id: "field1",
                  name: "fullName",
                  label: "Full Name",
                  type: "text",
                  required: true,
                  description: "Patient's legal full name",
                  order: 0,
                },
                {
                  id: "field2",
                  name: "dateOfBirth",
                  label: "Date of Birth",
                  type: "date",
                  required: true,
                  description: "Patient's date of birth",
                  order: 1,
                },
                {
                  id: "field3",
                  name: "gender",
                  label: "Gender",
                  type: "select",
                  required: true,
                  options: ["Male", "Female", "Other", "Prefer not to say"],
                  description: "Patient's gender identity",
                  order: 2,
                },
              ],
              order: 0,
            },
            {
              id: "section2",
              name: "contactInfo",
              label: "Contact Information",
              description: "Patient's contact details",
              fields: [
                {
                  id: "field4",
                  name: "emailAddress",
                  label: "Email Address",
                  type: "email",
                  required: false,
                  description: "Primary email contact",
                  order: 0,
                },
                {
                  id: "field5",
                  name: "phoneNumber",
                  label: "Phone Number",
                  type: "phone",
                  required: true,
                  description: "Primary phone contact",
                  order: 1,
                },
              ],
              order: 1,
            },
          ],
          statusOptions: [
            {
              id: "status1",
              name: "active",
              label: "Active",
              color: "#4CAF50",
              isDefault: true,
            },
            {
              id: "status2",
              name: "inactive",
              label: "Inactive",
              color: "#F44336",
              isDefault: false,
            },
            {
              id: "status3",
              name: "pending",
              label: "Pending Review",
              color: "#FF9800",
              isDefault: false,
            },
          ],
          isPrivate: false,
          isDefault: true,
          createdBy: "user123",
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-03-10"),
        },
        {
          id: "2",
          name: "Pediatric Assessment",
          description: "Template for pediatric patient assessment",
          sections: [
            {
              id: "section3",
              name: "personalInfo",
              label: "Child Information",
              description: "Child's basic details",
              fields: [
                {
                  id: "field6",
                  name: "fullName",
                  label: "Full Name",
                  type: "text",
                  required: true,
                  order: 0,
                },
                {
                  id: "field7",
                  name: "age",
                  label: "Age",
                  type: "number",
                  required: true,
                  order: 1,
                },
              ],
              order: 0,
            },
            {
              id: "section4",
              name: "parentInfo",
              label: "Parent/Guardian Information",
              description: "Parent or guardian contact details",
              fields: [
                {
                  id: "field8",
                  name: "guardianName",
                  label: "Guardian Name",
                  type: "text",
                  required: true,
                  order: 0,
                },
                {
                  id: "field9",
                  name: "relationship",
                  label: "Relationship to Child",
                  type: "select",
                  options: [
                    "Parent",
                    "Legal Guardian",
                    "Other Relative",
                    "Other",
                  ],
                  required: true,
                  order: 1,
                },
              ],
              order: 1,
            },
          ],
          statusOptions: [
            {
              id: "status4",
              name: "active",
              label: "Active",
              color: "#4CAF50",
              isDefault: true,
            },
          ],
          isPrivate: false,
          isDefault: false,
          createdBy: "user123",
          createdAt: new Date("2024-02-20"),
          updatedAt: new Date("2024-02-20"),
        },
      ];

      const foundTemplate = mockTemplates.find((t) => t.id === templateId);
      if (foundTemplate) {
        setTemplate(foundTemplate);
      } else {
        // Handle template not found
        toast.error("The requested template could not be found.");
        router.push("/templates");
      }
      setIsLoading(false);
    }, 500);
  }, [templateId, isNew, router, toast]);

  const handleBack = () => {
    router.push("/templates");
  };

  const toggleEditMode = () => {
    if (isViewMode) {
      router.push(`/templates/${templateId}`);
    } else {
      router.push(`/templates/${templateId}?view=true`);
    }
  };

  const handleSave = async () => {
    if (!template) return;

    setIsSaving(true);

    // Validate template
    if (!template.name?.trim()) {
      toast.error("Template name is required");
      setIsSaving(false);
      return;
    }

    // In a real app, this would be an API call
    setTimeout(() => {
      toast.success(
        isNew
          ? "Template created successfully"
          : "Template updated successfully"
      );
      setIsSaving(false);
      router.push("/templates");
    }, 1000);
  };

  // Template basic info handlers
  const updateTemplateField = (field: string, value: any) => {
    if (!template) return;
    setTemplate({ ...template, [field]: value });
  };

  // Section handlers
  const addSection = () => {
    setSelectedSection({
      id: Math.random().toString(36).substr(2),
      name: "",
      label: "",
      description: "",
      fields: [],
      order: template?.sections.length || 0,
    });
    setShowSectionDialog(true);
  };

  const editSection = (section: Section) => {
    setSelectedSection({ ...section });
    setShowSectionDialog(true);
  };

  const deleteSection = (sectionId: string) => {
    if (!template) return;
    setTemplate({
      ...template,
      sections: template.sections.filter((s) => s.id !== sectionId),
    });
    toast.success("The section has been removed from the template");
    setSectionToDelete(null);
  };

  const saveSection = () => {
    if (!template || !selectedSection) return;

    // Validate section
    if (!selectedSection.name?.trim() || !selectedSection.label?.trim()) {
      toast.error("Section name and label are required");
      return;
    }

    // Format section name (no spaces, lowercase)
    selectedSection.name = selectedSection.name
      .replace(/\s+/g, "")
      .toLowerCase();

    const existingSectionIndex = template.sections.findIndex(
      (s) => s.id === selectedSection.id
    );

    if (existingSectionIndex >= 0) {
      // Update existing section
      const updatedSections = [...template.sections];
      updatedSections[existingSectionIndex] = selectedSection;
      setTemplate({
        ...template,
        sections: updatedSections,
      });
    } else {
      // Add new section
      setTemplate({
        ...template,
        sections: [...template.sections, selectedSection],
      });
    }

    setShowSectionDialog(false);
    setSelectedSection(null);
  };

  // Field handlers
  const addField = (sectionId: string) => {
    const section = template?.sections.find((s) => s.id === sectionId);
    if (!section) return;

    setSelectedField({
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      label: "",
      type: "text",
      required: false,
      description: "",
      order: section.fields.length || 0,
    });
    setSelectedSection(section);
    setShowFieldDialog(true);
  };

  const editField = (sectionId: string, fieldId: string) => {
    if (!template) return;

    const section = template.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const field = section.fields.find((f) => f.id === fieldId);
    if (!field) return;

    setSelectedSection(section);
    setSelectedField({ ...field });
    setShowFieldDialog(true);
  };

  const deleteField = (sectionId: string, fieldId: string) => {
    if (!template) return;

    const sectionIndex = template.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex < 0) return;

    const updatedSections = [...template.sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      fields: updatedSections[sectionIndex].fields.filter(
        (f) => f.id !== fieldId
      ),
    };

    setTemplate({
      ...template,
      sections: updatedSections,
    });

    toast.error("The field has been removed from the section");

    setFieldToDelete(null);
  };

  const saveField = () => {
    if (!template || !selectedSection || !selectedField) return;

    // Validate field
    if (!selectedField.name?.trim() || !selectedField.label?.trim()) {
      toast.error("Field name and label are required");
      return;
    }

    // Format field name (no spaces, lowercase)
    selectedField.name = selectedField.name.replace(/\s+/g, "").toLowerCase();

    // Update or add field to section
    const sectionIndex = template.sections.findIndex(
      (s) => s.id === selectedSection.id
    );
    if (sectionIndex < 0) return;

    const fieldIndex = template.sections[sectionIndex].fields.findIndex(
      (f) => f.id === selectedField.id
    );
    const updatedSections = [...template.sections];
    const updatedFields = [...updatedSections[sectionIndex].fields];

    if (fieldIndex >= 0) {
      // Update existing field
      updatedFields[fieldIndex] = selectedField;
    } else {
      // Add new field
      updatedFields.push(selectedField);
    }

    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      fields: updatedFields,
    };

    setTemplate({
      ...template,
      sections: updatedSections,
    });

    setShowFieldDialog(false);
    setSelectedField(null);
    setSelectedSection(null);
  };

  const addFieldOption = () => {
    if (!selectedField || !fieldOptionText.trim()) return;

    const options = selectedField.options || [];
    setSelectedField({
      ...selectedField,
      options: [...options, fieldOptionText.trim()],
    });

    setFieldOptionText("");
  };

  const removeFieldOption = (index: number) => {
    if (!selectedField || !selectedField.options) return;

    const options = [...selectedField.options];
    options.splice(index, 1);

    setSelectedField({
      ...selectedField,
      options,
    });
  };

  // Status option handlers
  const addStatus = () => {
    setSelectedStatus({
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      label: "",
      color: "#3498db",
      description: "",
      isDefault: template?.statusOptions.length === 0,
    });
    setShowStatusDialog(true);
  };

  const editStatus = (statusOption: PatientStatusOption) => {
    setSelectedStatus({ ...statusOption });
    setShowStatusDialog(true);
  };

  const deleteStatus = (statusId: string) => {
    if (!template) return;
    // Check if this is the only status or the default status
    const isDefault = template.statusOptions.find(
      (s) => s.id === statusId
    )?.isDefault;
    if (template.statusOptions.length <= 1) {
      toast.error("Templates must have at least one status option");
      return;
    }

    const updatedStatusOptions = template.statusOptions.filter(
      (s) => s.id !== statusId
    );

    // If the deleted status was the default, set a new default
    if (isDefault && updatedStatusOptions.length > 0) {
      updatedStatusOptions[0].isDefault = true;
    }

    setTemplate({
      ...template,
      statusOptions: updatedStatusOptions,
    });

    toast.success("The status option has been removed");

    setStatusToDelete(null);
  };

  const saveStatus = () => {
    if (!template || !selectedStatus) return;

    // Validate status
    if (!selectedStatus.name?.trim() || !selectedStatus.label?.trim()) {
      toast("Status name and label are required");
      return;
    }

    // Format status name (no spaces, lowercase)
    selectedStatus.name = selectedStatus.name.replace(/\s+/g, "").toLowerCase();

    const existingStatusIndex = template.statusOptions.findIndex(
      (s) => s.id === selectedStatus.id
    );
    let updatedStatusOptions = [...template.statusOptions];

    if (existingStatusIndex >= 0) {
      // Update existing status
      const wasDefault = updatedStatusOptions[existingStatusIndex].isDefault;
      updatedStatusOptions[existingStatusIndex] = selectedStatus;

      // If this was default but is no longer, set another as default
      if (
        wasDefault &&
        !selectedStatus.isDefault &&
        updatedStatusOptions.length > 0
      ) {
        updatedStatusOptions[0].isDefault = true;
      }
    } else {
      // Add new status
      updatedStatusOptions.push(selectedStatus);
    }

    // If this is set as default, unset any other defaults
    if (selectedStatus.isDefault) {
      updatedStatusOptions = updatedStatusOptions.map((status) => ({
        ...status,
        isDefault: status.id === selectedStatus.id,
      }));
    } else if (!updatedStatusOptions.some((s) => s.isDefault)) {
      // Ensure we always have a default
      updatedStatusOptions[0].isDefault = true;
    }

    setTemplate({
      ...template,
      statusOptions: updatedStatusOptions,
    });

    setShowStatusDialog(false);
    setSelectedStatus(null);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-screen">
        <AlertCircleIcon className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-600">Template Not Found</h2>
        <p className="text-gray-600 mb-4">
          The requested template could not be found
        </p>
        <Button
          onClick={handleBack}
          className="bg-green-600 hover:bg-green-700"
        >
          Return to Templates
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-6xl"
      >
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-2 pl-0 text-green-700 dark:text-green-400 hover:text-green-800 hover:bg-transparent dark:hover:text-green-300"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Templates
            </Button>
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
              {isNew ? "Create New Template" : template.name}
            </h1>
            <p className="text-green-600 dark:text-green-400">
              {isNew
                ? "Define template structure and fields"
                : isViewMode
                ? "View template details"
                : "Edit template structure and fields"}
            </p>
          </div>
          <div className="flex gap-2">
            {!isNew && (
              <Button
                className="bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300"
                onClick={toggleEditMode}
              >
                {isViewMode ? (
                  <>
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Edit Template
                  </>
                ) : (
                  <>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View Only
                  </>
                )}
              </Button>
            )}
            {!isViewMode && (
              <Button
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Save Template
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6">
          {/* Basic Info Card */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                Template Information
              </CardTitle>
              <CardDescription>
                Basic details about this patient template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="templateName"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Template Name
                  </Label>
                  <Input
                    id="templateName"
                    placeholder="Enter template name"
                    value={template.name}
                    onChange={(e) =>
                      updateTemplateField("name", e.target.value)
                    }
                    disabled={isViewMode}
                    className="bg-white dark:bg-slate-800 border-green-100 dark:border-green-900"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label
                      htmlFor="isPrivate"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Private Template
                    </Label>
                    <Switch
                      id="isPrivate"
                      checked={template.isPrivate}
                      onCheckedChange={(checked) =>
                        updateTemplateField("isPrivate", checked)
                      }
                      disabled={isViewMode}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {template.isPrivate
                      ? "This template is private and only visible to you"
                      : "This template is public and visible to all users"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="templateDescription"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="templateDescription"
                    placeholder="Enter template description"
                    value={template.description || ""}
                    onChange={(e) =>
                      updateTemplateField("description", e.target.value)
                    }
                    disabled={isViewMode}
                    className="bg-white dark:bg-slate-800 border-green-100 dark:border-green-900"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label
                      htmlFor="isDefault"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Default Template
                    </Label>
                    <Switch
                      id="isDefault"
                      checked={template.isDefault}
                      onCheckedChange={(checked) =>
                        updateTemplateField("isDefault", checked)
                      }
                      disabled={isViewMode}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {template.isDefault
                      ? "This template will be used as the default for new patients"
                      : "This template will not be used as the default for new patients"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Sections and Status Options */}
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="bg-green-50 dark:bg-slate-800 border border-green-100 dark:border-green-900 mb-4">
              <TabsTrigger
                value="sections"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Sections & Fields
              </TabsTrigger>
              <TabsTrigger
                value="status"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Status Options
              </TabsTrigger>
            </TabsList>

            {/* Sections & Fields Tab */}
            <TabsContent value="sections">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                      Template Sections
                    </CardTitle>
                    <CardDescription>
                      Organize fields into logical sections
                    </CardDescription>
                  </div>
                  {!isViewMode && (
                    <Button
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                      onClick={addSection}
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Section
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {template.sections.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                        <FileTextIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                        No Sections Found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Start by adding sections to organize your template
                        fields
                      </p>
                      {!isViewMode && (
                        <Button
                          className="mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                          onClick={addSection}
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add First Section
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="space-y-4">
                      {template.sections.map((section) => (
                        <AccordionItem
                          key={section.id}
                          value={section.id || ""}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800"
                        >
                          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 group">
                            <div className="flex items-center flex-grow">
                              <GripVerticalIcon className="h-5 w-5 text-gray-400 opacity-50 group-hover:opacity-100 mr-2" />
                              <div className="flex-grow">
                                <h3 className="text-green-700 dark:text-green-400 font-medium text-sm">
                                  {section.label}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">
                                  {section.description ||
                                    `Contains ${section.fields.length} fields`}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="p-4 bg-gray-50 dark:bg-slate-700/50">
                              <div className="flex justify-between items-center mb-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Fields
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {section.fields.length}{" "}
                                    {section.fields.length === 1
                                      ? "field"
                                      : "fields"}{" "}
                                    in this section
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  {!isViewMode && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
                                        onClick={() => editSection(section)}
                                      >
                                        <PencilIcon className="h-4 w-4 mr-1" />
                                        Edit Section
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
                                        onClick={() =>
                                          addField(section.id || "")
                                        }
                                      >
                                        <CirclePlusIcon className="h-4 w-4 mr-1" />
                                        Add Field
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30"
                                            onClick={() =>
                                              setSectionToDelete(
                                                section.id || ""
                                              )
                                            }
                                          >
                                            <TrashIcon className="h-4 w-4 mr-1" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Delete Section
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete
                                              the "{section.label}" section?
                                              This will also delete all fields
                                              within this section. This action
                                              cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel
                                              onClick={() =>
                                                setSectionToDelete(null)
                                              }
                                            >
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              className="bg-red-600 hover:bg-red-700 text-white"
                                              onClick={() =>
                                                deleteSection(section.id || "")
                                              }
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </>
                                  )}
                                </div>
                              </div>

                              {section.fields.length === 0 ? (
                                <div className="text-center py-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    No fields have been added to this section
                                    yet
                                  </p>
                                  {!isViewMode && (
                                    <Button
                                      className="mt-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                                      size="sm"
                                      onClick={() => addField(section.id || "")}
                                    >
                                      <PlusIcon className="mr-1 h-3 w-3" />
                                      Add Field
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {section.fields.map((field) => (
                                    <div
                                      key={field.id}
                                      className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
                                          <span className="text-xs font-medium text-green-800 dark:text-green-300">
                                            {field.type}
                                          </span>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {field.label}
                                            {field.required && (
                                              <span className="text-red-500 ml-1">
                                                *
                                              </span>
                                            )}
                                          </h4>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {field.name}
                                            {field.description &&
                                              ` - ${field.description}`}
                                          </p>
                                        </div>
                                      </div>
                                      {!isViewMode && (
                                        <div className="flex gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-500 hover:text-green-700 dark:text-gray-400 dark:hover:text-green-400"
                                            onClick={() =>
                                              editField(
                                                section.id || "",
                                                field.id || ""
                                              )
                                            }
                                          >
                                            <PencilIcon className="h-4 w-4" />
                                          </Button>
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                                onClick={() =>
                                                  setFieldToDelete({
                                                    sectionId: section.id || "",
                                                    fieldId: field.id || "",
                                                  })
                                                }
                                              >
                                                <TrashIcon className="h-4 w-4" />
                                              </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                  Delete Field
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  Are you sure you want to
                                                  delete the "{field.label}"
                                                  field? This action cannot be
                                                  undone.
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel
                                                  onClick={() =>
                                                    setFieldToDelete(null)
                                                  }
                                                >
                                                  Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                  className="bg-red-600 hover:bg-red-700 text-white"
                                                  onClick={() =>
                                                    deleteField(
                                                      section.id || "",
                                                      field.id || ""
                                                    )
                                                  }
                                                >
                                                  Delete
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Status Options Tab */}
            <TabsContent value="status">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                      Patient Status Options
                    </CardTitle>
                    <CardDescription>
                      Define possible status values for patients using this
                      template
                    </CardDescription>
                  </div>
                  {!isViewMode && (
                    <Button
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                      onClick={addStatus}
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Status
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {template.statusOptions.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                        <AlertCircleIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                        No Status Options Found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Status options define the possible states for patients
                        using this template
                      </p>
                      {!isViewMode && (
                        <Button
                          className="mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                          onClick={addStatus}
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add First Status
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {template.statusOptions.map((status) => (
                        <div
                          key={status.id}
                          className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              style={{ backgroundColor: status.color }}
                              className="h-6 w-6 rounded-full flex items-center justify-center"
                            >
                              {status.isDefault && (
                                <CheckCircleIcon className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                {status.label}
                                {status.isDefault && (
                                  <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                                    Default
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {status.description || status.name}
                              </p>
                            </div>
                          </div>
                          {!isViewMode && (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-green-700 dark:text-gray-400 dark:hover:text-green-400"
                                onClick={() => editStatus(status)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                    onClick={() =>
                                      setStatusToDelete(status.id || "")
                                    }
                                    disabled={
                                      template.statusOptions.length <= 1
                                    }
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Status
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the "
                                      {status.label}" status option? This action
                                      cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      onClick={() => setStatusToDelete(null)}
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                      onClick={() =>
                                        deleteStatus(status.id || "")
                                      }
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      {/* Section Dialog */}
      <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSection?.id ? "Edit Section" : "Add New Section"}
            </DialogTitle>
            <DialogDescription>
              Create or modify a section to organize related fields
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="sectionName">Section Name</Label>
              <Input
                id="sectionName"
                placeholder="e.g. personalInfo"
                value={selectedSection?.name || ""}
                onChange={(e) =>
                  setSelectedSection((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
              <p className="text-xs text-gray-500">
                Internal name used in code (no spaces, lowercase)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sectionLabel">Display Label</Label>
              <Input
                id="sectionLabel"
                placeholder="e.g. Personal Information"
                value={selectedSection?.label || ""}
                onChange={(e) =>
                  setSelectedSection((prev) =>
                    prev ? { ...prev, label: e.target.value } : null
                  )
                }
              />
              <p className="text-xs text-gray-500">
                User-friendly label displayed in the UI
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sectionDescription">Description (Optional)</Label>
              <Textarea
                id="sectionDescription"
                placeholder="Describe this section's purpose"
                value={selectedSection?.description || ""}
                onChange={(e) =>
                  setSelectedSection((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSectionDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveSection}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Field Dialog */}
      <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedField?.id ? "Edit Field" : "Add New Field"}
            </DialogTitle>
            <DialogDescription>
              {selectedSection &&
                `Adding field to "${selectedSection.label}" section`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fieldName">Field Name</Label>
                <Input
                  id="fieldName"
                  placeholder="e.g. firstName"
                  value={selectedField?.name || ""}
                  onChange={(e) =>
                    setSelectedField((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                />
                <p className="text-xs text-gray-500">
                  Internal name (no spaces)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fieldLabel">Display Label</Label>
                <Input
                  id="fieldLabel"
                  placeholder="e.g. First Name"
                  value={selectedField?.label || ""}
                  onChange={(e) =>
                    setSelectedField((prev) =>
                      prev ? { ...prev, label: e.target.value } : null
                    )
                  }
                />
                <p className="text-xs text-gray-500">User-friendly label</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fieldType">Field Type</Label>
                <Select
                  value={selectedField?.type || "text"}
                  onValueChange={(value) =>
                    setSelectedField((prev) =>
                      prev ? { ...prev, type: value } : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="required"
                    checked={selectedField?.required || false}
                    onCheckedChange={(checked) =>
                      setSelectedField((prev) =>
                        prev ? { ...prev, required: !!checked } : null
                      )
                    }
                  />
                  <Label htmlFor="required">Required Field</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fieldDescription">Description (Optional)</Label>
              <Textarea
                id="fieldDescription"
                placeholder="Help text for this field"
                value={selectedField?.description || ""}
                onChange={(e) =>
                  setSelectedField((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                rows={2}
              />
            </div>

            {/* Options for select field type */}
            {selectedField?.type === "select" && (
              <div className="space-y-3">
                <Label>Options</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add new option"
                    value={fieldOptionText}
                    onChange={(e) => setFieldOptionText(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={addFieldOption}
                    disabled={!fieldOptionText.trim()}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2">
                  {(selectedField.options || []).length === 0 ? (
                    <p className="text-xs text-gray-500">
                      No options added yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {(selectedField.options || []).map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-2 rounded"
                        >
                          <span className="text-sm">{option}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFieldOption(index)}
                            className="h-6 w-6 p-0 text-gray-500 hover:text-red-600"
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFieldDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveField}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedStatus?.id ? "Edit Status" : "Add New Status"}
            </DialogTitle>
            <DialogDescription>
              Define a patient status option
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="statusName">Status Name</Label>
                <Input
                  id="statusName"
                  placeholder="e.g. active"
                  value={selectedStatus?.name || ""}
                  onChange={(e) =>
                    setSelectedStatus((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                />
                <p className="text-xs text-gray-500">
                  Internal name (no spaces)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusLabel">Display Label</Label>
                <Input
                  id="statusLabel"
                  placeholder="e.g. Active"
                  value={selectedStatus?.label || ""}
                  onChange={(e) =>
                    setSelectedStatus((prev) =>
                      prev ? { ...prev, label: e.target.value } : null
                    )
                  }
                />
                <p className="text-xs text-gray-500">User-friendly label</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="statusColor">Color</Label>
                <Input
                  id="statusColor"
                  type="color"
                  value={selectedStatus?.color || "#3498db"}
                  onChange={(e) =>
                    setSelectedStatus((prev) =>
                      prev ? { ...prev, color: e.target.value } : null
                    )
                  }
                  className="h-10 w-full p-1"
                />
              </div>
              <div className="space-y-2 flex items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDefault"
                    checked={selectedStatus?.isDefault || false}
                    onCheckedChange={(checked) =>
                      setSelectedStatus((prev) =>
                        prev ? { ...prev, isDefault: !!checked } : null
                      )
                    }
                  />
                  <Label htmlFor="isDefault">Default Status</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statusDescription">Description (Optional)</Label>
              <Textarea
                id="statusDescription"
                placeholder="Description of this status"
                value={selectedStatus?.description || ""}
                onChange={(e) =>
                  setSelectedStatus((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveStatus}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

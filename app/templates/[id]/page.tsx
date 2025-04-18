"use client";

import { motion } from "framer-motion";
import { ArrowLeftIcon, EyeIcon, PencilIcon, SaveIcon } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  Field,
  PatientStatusOption,
  PatientTemplate,
  Section,
} from "@/app/_types/Template";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

// Import component parts
import ErrorComp from "@/app/_components/ErrorComp";
import Loading from "@/app/_components/Loading";
import { DeleteAlerts } from "@/app/_components/template/DeleteAlerts";
import { StatusOptions } from "@/app/_components/template/StatusOptions";
import { TemplateInfo } from "@/app/_components/template/TemplateInfo";
import { TemplateSections } from "@/app/_components/template/TemplateSections";
import { FieldDialog } from "@/app/_components/template/dialogs/FieldDialog";
import { SectionDialog } from "@/app/_components/template/dialogs/SectionDialog";
import { StatusDialog } from "@/app/_components/template/dialogs/StatusDialog";
import { useTemplates } from "@/app/_hooks/useTemplates";

export default function TemplateDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isViewMode = searchParams?.get("view") === "true";
  const isNew = params?.id === "new";
  const templateId = params?.id as string;

  const {
    getTemplate,
    createTemplate,
    updateTemplate,
    isLoading: isTemplateLoading,
  } = useTemplates(false); // Don't fetch all templates on mount

  const [isLoading, setIsLoading] = useState(isNew ? false : true);
  const [isSaving, setIsSaving] = useState(false);
  const [template, setTemplate] = useState<PatientTemplate | null>(
    isNew
      ? ({
          id: "new",
          name: "New Template",
          description: "",
          sections: [],
          statusOptions: [
            {
              _id: Math.random().toString(36).substr(2, 9),
              name: "active",
              label: "Active",
              color: "#4CAF50",
              isDefault: true,
              description: "Default status for active patients",
            },
            {
              _id: Math.random().toString(36).substr(2, 9),
              name: "inactive",
              label: "Inactive",
              color: "#9E9E9E",
              isDefault: false,
              description: "Status for inactive patients",
            },
          ],
          isPrivate: false,
          isDefault: false,
          createdBy: "currentUser",
          createdAt: new Date(),
          updatedAt: new Date(),
        } as PatientTemplate)
      : null
  );
  const [error, setError] = useState<string | null>(null);
  const fetchAttempted = useRef(false);

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
    // If this is a new template, we've already initialized it in the useState
    if (isNew) {
      return;
    }

    // Check if we've already attempted to fetch the template to prevent loops
    if (fetchAttempted.current) {
      return;
    }

    // Fetch template data
    setIsLoading(true);
    fetchAttempted.current = true;

    getTemplate(templateId)
      .then((data) => {
        if (!data) {
          throw new Error("Template not found");
        }

        // Ensure all sections and fields have proper IDs
        const processedData = {
          ...data,
          sections: data.sections.map((section: any) => ({
            ...section,
            _id: section._id || Math.random().toString(36).substr(2, 9),
            fields: (section.fields || []).map((field: any) => ({
              ...field,
              _id: field._id || Math.random().toString(36).substr(2, 9),
              options: field.options || [],
            })),
          })),
          statusOptions: (data.statusOptions || []).map((status: any) => ({
            ...status,
            _id: status._id || Math.random().toString(36).substr(2, 9),
          })),
        };

        setTemplate(processedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching template:", error);
        setError("Template not found or error loading template");
        setIsLoading(false);
      });
  }, [isNew, templateId, getTemplate]);

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

    if (template.sections.length === 0) {
      toast.error("Template must have at least one section");
      setIsSaving(false);
      return;
    }

    if (template.statusOptions.length === 0) {
      toast.error("Template must have at least one status option");
      setIsSaving(false);
      return;
    }

    // Ensure at least one default status
    const hasDefaultStatus = template.statusOptions.some((s) => s.isDefault);
    if (!hasDefaultStatus && template.statusOptions.length > 0) {
      // Set the first status as default
      const updatedStatusOptions = [...template.statusOptions];
      updatedStatusOptions[0].isDefault = true;
      setTemplate({
        ...template,
        statusOptions: updatedStatusOptions,
      });
    }

    try {
      // Clean up the template data for API submission
      const cleanSections = template.sections.map((section) => ({
        name: section.name,
        label: section.label,
        description: section.description || "",
        order: section.order || 0,
        _id: section._id,
        fields: section.fields.map((field) => ({
          name: field.name,
          label: field.label,
          type: field.type,
          required: field.required || false,
          description: field.description || "",
          options: field.options || [],
          order: field.order || 0,
          _id: field._id,
        })),
      }));

      const cleanStatusOptions = template.statusOptions.map((status) => ({
        name: status.name,
        label: status.label,
        color: status.color,
        description: status.description || "",
        isDefault: status.isDefault || false,
        _id: status._id,
      }));

      // Create a clean template object with only the necessary fields
      const templateToSave: Partial<PatientTemplate> = {
        name: template.name,
        description: template.description || "",
        sections: cleanSections,
        statusOptions: cleanStatusOptions,
        isPrivate: template.isPrivate || false,
        isDefault: template.isDefault || false,
      };

      // If not a new template, include the ID
      if (!isNew && template.id) {
        templateToSave.id = template.id;
      }

      let result;
      if (isNew) {
        // Create new template
        result = await createTemplate(templateToSave);
      } else {
        // Update existing template
        result = await updateTemplate(templateId, templateToSave);
      }

      if (result.success) {
        toast.success(
          isNew
            ? "Template created successfully"
            : "Template updated successfully"
        );
        router.push("/templates");
      } else {
        toast.error(result.error || "Failed to save template");
      }
    } catch (error) {
      toast.error("An error occurred while saving the template");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Template basic info handlers
  const updateTemplateField = (field: string, value: any) => {
    if (!template) return;
    setTemplate({ ...template, [field]: value });
  };

  // Section handlers
  const addSection = () => {
    setSelectedSection({
      _id: Math.random().toString(36).substr(2),
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
      sections: template.sections.filter((s) => s._id !== sectionId),
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

    // Ensure unique IDs for new sections
    const sectionWithId = {
      ...selectedSection,
      _id: selectedSection._id || Math.random().toString(36).substr(2, 9),
    };

    const existingSectionIndex = template.sections.findIndex(
      (s) => s._id === sectionWithId._id
    );

    if (existingSectionIndex >= 0) {
      // Update existing section
      const updatedSections = [...template.sections];
      updatedSections[existingSectionIndex] = sectionWithId;
      setTemplate({
        ...template,
        sections: updatedSections,
      });
      toast.success("Section updated successfully");
    } else {
      // Add new section
      setTemplate({
        ...template,
        sections: [...template.sections, sectionWithId],
      });
      toast.success("New section added");
    }

    setShowSectionDialog(false);
    setSelectedSection(null);
  };

  // Field handlers
  const addField = (sectionId: string) => {
    const section = template?.sections.find((s) => s._id === sectionId);
    if (!section) return;

    setSelectedField({
      _id: Math.random().toString(36).substr(2, 9),
      name: "",
      label: "",
      type: "text",
      required: false,
      description: "",
      options: [],
      order: section.fields.length || 0,
    });
    setSelectedSection(section);
    setShowFieldDialog(true);
  };

  const editField = (sectionId: string, fieldId: string) => {
    if (!template) return;

    const section = template.sections.find((s) => s._id === sectionId);
    if (!section) return;

    const field = section.fields.find((f) => f._id === fieldId);
    if (!field) return;

    setSelectedSection(section);
    setSelectedField({ ...field });
    setShowFieldDialog(true);
  };

  const deleteField = (sectionId: string, fieldId: string) => {
    if (!template) return;

    const sectionIndex = template.sections.findIndex(
      (s) => s._id === sectionId
    );
    if (sectionIndex < 0) return;

    const updatedSections = [...template.sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      fields: updatedSections[sectionIndex].fields.filter(
        (f) => f._id !== fieldId
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

    // Ensure unique field ID
    const fieldWithId = {
      ...selectedField,
      _id: selectedField._id || Math.random().toString(36).substr(2, 9),
    };

    // Update or add field to section
    const sectionIndex = template.sections.findIndex(
      (s) => s._id === selectedSection._id
    );
    if (sectionIndex < 0) return;

    const fieldIndex = template.sections[sectionIndex].fields.findIndex(
      (f) => f._id === fieldWithId._id
    );
    const updatedSections = [...template.sections];
    const updatedFields = [...updatedSections[sectionIndex].fields];

    if (fieldIndex >= 0) {
      // Update existing field
      updatedFields[fieldIndex] = fieldWithId;
      toast.success("Field updated successfully");
    } else {
      // Add new field
      updatedFields.push(fieldWithId);
      toast.success("New field added");
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
      _id: Math.random().toString(36).substr(2, 9),
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
      (s) => s._id === statusId
    )?.isDefault;
    if (template.statusOptions.length <= 1) {
      toast.error("Templates must have at least one status option");
      return;
    }

    const updatedStatusOptions = template.statusOptions.filter(
      (s) => s._id !== statusId
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
      (s) => s._id === selectedStatus._id
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
        isDefault: status._id === selectedStatus._id,
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

  // Early return for error state
  if (error) {
    return <ErrorComp message={error} />;
  }

  // Render loading state only if we're actually loading
  if (isLoading && !isNew) {
    return <Loading />;
  }

  if (!template) {
    return <ErrorComp message="No Template Found" />;
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
          <TemplateInfo
            template={template}
            isViewMode={isViewMode}
            updateTemplateField={updateTemplateField}
          />

          {/* Tabs for Sections and Status Options */}
          <Tabs defaultValue="sections" className="w-full">
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
            <TabsContent value="sections" className="mt-0">
              <TemplateSections
                template={template}
                isViewMode={isViewMode}
                onAddSection={addSection}
                onEditSection={editSection}
                onDeleteSection={deleteSection}
                onAddField={addField}
                onEditField={editField}
                onDeleteField={deleteField}
                setSectionToDelete={setSectionToDelete}
                setFieldToDelete={setFieldToDelete}
              />
            </TabsContent>

            {/* Status Options Tab */}
            <TabsContent value="status" className="mt-0">
              <StatusOptions
                template={template}
                isViewMode={isViewMode}
                onAddStatus={addStatus}
                onEditStatus={editStatus}
                setStatusToDelete={setStatusToDelete}
              />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      {/* Dialogs */}
      <SectionDialog
        open={showSectionDialog}
        onOpenChange={setShowSectionDialog}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        onSave={saveSection}
      />

      <FieldDialog
        open={showFieldDialog}
        onOpenChange={setShowFieldDialog}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        onSave={saveField}
      />

      <StatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onSave={saveStatus}
      />

      {/* Delete Alerts */}
      <DeleteAlerts
        sectionToDelete={sectionToDelete}
        setSectionToDelete={setSectionToDelete}
        onDeleteSection={deleteSection}
        fieldToDelete={fieldToDelete}
        setFieldToDelete={setFieldToDelete}
        onDeleteField={deleteField}
        statusToDelete={statusToDelete}
        setStatusToDelete={setStatusToDelete}
        onDeleteStatus={deleteStatus}
      />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowLeftIcon, EyeIcon, PencilIcon, SaveIcon } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Field, PatientTemplate, Section } from "@/app/_types/Template";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

// Import component parts
import ErrorComp from "@/app/_components/ErrorComp";
import Loading from "@/app/_components/Loading";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useTemplates } from "@/app/_hooks/template/useTemplates";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { DeleteAlerts } from "@/app/templates/_components/DeleteAlerts";
import { TemplateInfo } from "@/app/templates/_components/TemplateInfo";
import { TemplateSections } from "@/app/templates/_components/TemplateSections";
import { FieldDialog } from "@/app/templates/_components/dialogs/FieldDialog";
import { SectionDialog } from "@/app/templates/_components/dialogs/SectionDialog";

export default function TemplateDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, dir } = useLanguage();

  const isViewMode = searchParams?.get("view") === "true";
  const isNew = params?.id === "new";
  const templateId = params?.id as string;
  const { user } = useAuthContext();

  const { getTemplate, createTemplate, updateTemplate } = useTemplates(false); // Don't fetch all templates on mount

  const [isLoading, setIsLoading] = useState(isNew ? false : true);
  const [isSaving, setIsSaving] = useState(false);
  const [template, setTemplate] = useState<PatientTemplate | null>(
    isNew
      ? ({
          id: "new",
          name: "New Template",
          description: "",
          sections: [
            {
              _id: Math.random().toString(36).substr(2, 9),
              name: "general",
              label: "General Information",
              description:
                "General section that can be customized for your needs",
              order: 0,
              fields: [
                {
                  _id: Math.random().toString(36).substr(2, 9),
                  name: "title",
                  label: "Title",
                  type: "text",
                  required: true,
                  description: "Add a title",
                  order: 0,
                },
                {
                  _id: Math.random().toString(36).substr(2, 9),
                  name: "description",
                  label: "Description",
                  type: "textarea",
                  required: false,
                  description: "Add a description",
                  order: 1,
                },
                {
                  _id: Math.random().toString(36).substr(2, 9),
                  name: "category",
                  label: "Category",
                  type: "select",
                  required: false,
                  options: ["Option 1", "Option 2", "Option 3"],
                  description: "Select a category",
                  order: 2,
                },
              ],
            },
          ],
          isPrivate: true, // Set private to true by default for new templates
          isDefault: false,
          createdBy: user?.id || "currentUser",
          createdAt: new Date(),
          updatedAt: new Date(),
        } as PatientTemplate)
      : null
  );
  const [error, setError] = useState<string | null>(null);
  const fetchAttempted = useRef(false);

  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [showSectionDialog, setShowSectionDialog] = useState(false);

  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [fieldToDelete, setFieldToDelete] = useState<{
    sectionId: string;
    fieldId: string;
  } | null>(null);

  // Check if the current user is the creator of the template or a super_admin
  const canEdit = useCallback(() => {
    if (!template || !user) return false;
    if (isNew) return true;

    // Allow editing if user is the creator or super_admin
    if (user.role === "super_admin") return true;

    // Check if createdBy is a string (just the ID) or an object
    if (typeof template.createdBy === "string") {
      return user.id === template.createdBy;
    } else if (template.createdBy && typeof template.createdBy === "object") {
      // If createdBy is an object with an ID field
      return (
        user.id === template.createdBy.id || user.id === template.createdBy._id
      );
    }

    return false;
  }, [isNew, template, user]);

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
          sections: (data.sections || []).map((section: any) => ({
            ...section,
            _id:
              section._id ||
              section.id ||
              Math.random().toString(36).substr(2, 9),
            fields: (section.fields || []).map((field: any) => ({
              ...field,
              _id:
                field._id ||
                field.id ||
                Math.random().toString(36).substr(2, 9),
              options: field.options || [],
            })),
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

  // Check for AI-generated template in localStorage when creating a new template
  useEffect(() => {
    if (isNew) {
      try {
        // Only run in browser environment
        if (typeof window !== "undefined") {
          const aiTemplate = localStorage.getItem("aiGeneratedTemplate");

          if (aiTemplate) {
            // Parse and use the AI-generated template
            const parsedTemplate = JSON.parse(aiTemplate);

            // Add necessary properties if they're missing
            const processedTemplate = {
              id: "new",
              ...parsedTemplate,
              // Ensure each section and field has an _id
              sections: (parsedTemplate.sections || []).map((section: any) => ({
                ...section,
                _id: section._id || Math.random().toString(36).substr(2, 9),
                fields: (section.fields || []).map((field: any) => ({
                  ...field,
                  _id: field._id || Math.random().toString(36).substr(2, 9),
                })),
              })),
              createdBy: user?.id || "currentUser",
              isPrivate: true, // Set private to true by default
              isDefault: false, // Set default to false by default
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            // Set as our template
            setTemplate(processedTemplate);

            // Remove from localStorage to prevent loading it again
            localStorage.removeItem("aiGeneratedTemplate");

            // Show a success message
            toast.success("AI-generated template loaded successfully!");
          }
        }
      } catch (error) {
        console.error("Error loading AI template:", error);
        // If there's an error, we'll use the default template (already set)
      }
    }
  }, [isNew, user]);

  // If the user isn't the creator and isn't a super_admin, redirect to view mode
  useEffect(() => {
    if (!isNew && !isViewMode && !canEdit() && template) {
      router.push(`/templates/${templateId}?view=true`);
    }
  }, [template, isNew, isViewMode, templateId, router, canEdit]);

  const handleBack = () => {
    router.push("/templates");
  };

  const toggleEditMode = () => {
    if (isViewMode) {
      // Check if user can edit before switching to edit mode
      if (canEdit()) {
        router.push(`/templates/${templateId}`);
      } else {
        toast.error(t("noPermissionEdit"));
      }
    } else {
      router.push(`/templates/${templateId}?view=true`);
    }
  };

  const handleSave = async () => {
    if (!template) return;

    setIsSaving(true);

    // Validate template
    if (!template.name?.trim()) {
      toast.error(t("templateNameRequired"));
      setIsSaving(false);
      return;
    }

    if (template.sections.length === 0) {
      toast.error(t("templateSectionRequired"));
      setIsSaving(false);
      return;
    }

    try {
      // Clean up the template data for API submission
      const cleanSections = template.sections.map((section) => ({
        name: section.name,
        label: section.label,
        description: section.description || "",
        order: section.order || 0,
        fields: section.fields.map((field) => ({
          name: field.name,
          label: field.label,
          type: field.type,
          required: field.required || false,
          description: field.description || "",
          options: field.options || [],
          order: field.order || 0,
        })),
      }));

      // Create a clean template object with only the necessary fields
      const templateToSave: Partial<PatientTemplate> = {
        name: template.name,
        description: template.description || "",
        sections: cleanSections,
        isPrivate: template.isPrivate, // Use the value from the form
        // Only super_admin can set isDefault
        isDefault: user?.role === "super_admin" ? template.isDefault : false,
      };

      // Add ID if updating an existing template
      if (!isNew && template.id) {
        templateToSave.id = template.id;
      }

      // Add MongoDB ID if present
      if (!isNew && template._id) {
        templateToSave._id = template._id;
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
          isNew ? t("templateCreatedSuccess") : t("templateUpdatedSuccess")
        );
        router.push("/templates");
      } else {
        toast.error(result.error || t("failedToSaveTemplate"));
      }
    } catch (error) {
      toast.error(t("errorSavingTemplate"));
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
              className="mb-2 px-0 text-green-700 dark:text-green-400 hover:text-green-800 hover:bg-transparent dark:hover:text-green-300"
            >
              <ArrowLeftIcon className="mx-2 h-4 w-4" />
              {t("backToTemplates")}
            </Button>
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
              {isNew ? t("createNewTemplate") : template.name}
            </h1>
            <p className="text-green-600 dark:text-green-400">
              {isNew
                ? t("defineTemplateStructure")
                : isViewMode
                ? t("viewTemplateDetails")
                : t("editTemplateStructure")}
            </p>
          </div>
          <div className="flex gap-2">
            {!isNew && canEdit() && (
              <Button
                className="bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300"
                onClick={toggleEditMode}
              >
                {isViewMode ? (
                  <>
                    <PencilIcon className="mx-2 h-4 w-4" />
                    {t("editTemplate")}
                  </>
                ) : (
                  <>
                    <EyeIcon className="mx-2 h-4 w-4" />
                    {t("viewOnly")}
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
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mx-2"></div>
                    {t("saving")}
                  </div>
                ) : (
                  <>
                    <SaveIcon className="mx-2 h-4 w-4" />
                    {t("saveTemplate")}
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
            userRole={user?.role}
          />

          {/* Tabs for Sections */}
          <Tabs
            defaultValue="sections"
            className="w-full"
            dir={dir as "ltr" | "rtl"}
          >
            <TabsList className="bg-green-50 dark:bg-slate-800 border border-green-100 dark:border-green-900 mb-4">
              <TabsTrigger
                value="sections"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                {t("sectionsAndFields")}
              </TabsTrigger>
            </TabsList>

            {/* Sections & Fields Tab */}
            <TabsContent value="sections" className="mt-0">
              <TemplateSections
                template={template}
                isViewMode={isViewMode}
                onAddSection={addSection}
                onEditSection={editSection}
                onAddField={addField}
                onEditField={editField}
                setSectionToDelete={setSectionToDelete}
                setFieldToDelete={setFieldToDelete}
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

      {/* Delete Alerts */}
      <DeleteAlerts
        sectionToDelete={sectionToDelete}
        setSectionToDelete={setSectionToDelete}
        onDeleteSection={deleteSection}
        fieldToDelete={fieldToDelete}
        setFieldToDelete={setFieldToDelete}
        onDeleteField={deleteField}
      />
    </div>
  );
}

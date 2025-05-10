import { useLanguage } from "@/app/_contexts/LanguageContext";
import { PatientTemplate, Section } from "@/app/_types/Template";
import { SectionItem } from "@/app/templates/_components/SectionItem";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileTextIcon, LayersIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface TemplateSectionsProps {
  template: PatientTemplate;
  isViewMode: boolean;
  onAddSection: () => void;
  onEditSection: (section: Section) => void;
  onAddField: (sectionId: string) => void;
  onEditField: (sectionId: string, fieldId: string) => void;
  setSectionToDelete: (sectionId: string | null) => void;
  setFieldToDelete: (
    data: { sectionId: string; fieldId: string } | null
  ) => void;
}

export function TemplateSections({
  template,
  isViewMode,
  onAddSection,
  onEditSection,
  onAddField,
  onEditField,
  setSectionToDelete,
  setFieldToDelete,
}: TemplateSectionsProps) {
  const { t, dir } = useLanguage();
  // Store open section values in state
  const [openSections, setOpenSections] = useState<string[]>([]);

  // Only open the first section on initial load in view mode
  useEffect(() => {
    if (template.sections.length > 0 && openSections.length === 0) {
      // In view mode, open the first section
      if (isViewMode && template.sections[0]?._id) {
        setOpenSections([template.sections[0]._id]);
      }
    }
  }, [template.sections, isViewMode, openSections.length]);

  // Handle section value change in accordion
  const handleValueChange = (value: string[]) => {
    // Store the new open sections state
    setOpenSections(value);
  };

  return (
    <Card
      dir={dir}
      className="bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-green-100 dark:border-green-900 shadow-lg overflow-hidden"
    >
      <CardHeader className="flex flex-row items-center justify-between bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900 pb-4">
        <div>
          <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center">
            <LayersIcon className="h-5 w-5 mx-2 text-green-600 dark:text-green-400" />
            {t("templateSections")}
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400">
            {t("organizeSectionsFields")}
          </CardDescription>
        </div>
        {!isViewMode && (
          <Button
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white shadow-sm"
            onClick={onAddSection}
          >
            <PlusIcon className="mx-2 h-4 w-4" />
            {t("addSection")}
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {template.sections.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-green-200 dark:border-green-900 rounded-lg bg-green-50/50 dark:bg-green-900/10">
            <div className="bg-white dark:bg-slate-700 shadow-sm rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 border border-green-100 dark:border-green-900">
              <FileTextIcon className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-green-800 dark:text-green-300 font-medium text-lg mb-2">
              {t("noSectionsFound")}
            </h3>
            <p className="text-green-600 dark:text-green-400 text-sm max-w-md mx-auto">
              {t("startAddingSections")}
            </p>
            {!isViewMode && (
              <Button
                className="mt-6 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white shadow-sm transition-all duration-200 hover:scale-105"
                onClick={onAddSection}
              >
                <PlusIcon className="mx-2 h-4 w-4" />
                {t("addFirstSection")}
              </Button>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-green-600 dark:text-green-400">
                <span className="font-medium text-green-800 dark:text-green-300">
                  {template.sections.length}
                </span>{" "}
                {template.sections.length === 1
                  ? t("sectionCount")
                  : t("sectionsCount")}{" "}
              </p>
              {!isViewMode && template.sections.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-900 hover:bg-green-50 dark:hover:bg-green-900/20"
                  onClick={onAddSection}
                >
                  <PlusIcon className="mx-1 h-3 w-3" />
                  {t("addAnotherSection")}
                </Button>
              )}
            </div>
            <Accordion
              type="multiple"
              className="space-y-4"
              value={openSections}
              onValueChange={handleValueChange}
            >
              {template.sections.map((section, index) => {
                const sectionId = section._id || `section_${index}`;
                return (
                  <SectionItem
                    key={sectionId}
                    section={section}
                    isViewMode={isViewMode}
                    onEditSection={() => onEditSection(section)}
                    onAddField={() => onAddField(sectionId)}
                    onEditField={(fieldId) => onEditField(sectionId, fieldId)}
                    setSectionToDelete={() => setSectionToDelete(sectionId)}
                    setFieldToDelete={(fieldId) =>
                      setFieldToDelete({
                        sectionId: sectionId,
                        fieldId,
                      })
                    }
                  />
                );
              })}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

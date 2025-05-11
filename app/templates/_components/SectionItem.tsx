import { Section } from "@/app/_types/Template";
import { FieldItem } from "@/app/templates/_components/FieldItem";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  CirclePlusIcon,
  GripVerticalIcon,
  Layers3Icon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

interface SectionItemProps {
  section: Section;
  isViewMode: boolean;
  onEditSection: () => void;
  onAddField: () => void;
  onEditField: (fieldId: string) => void;
  setSectionToDelete: () => void;
  setFieldToDelete: (fieldId: string) => void;
}

export function SectionItem({
  section,
  isViewMode,
  onEditSection,
  onAddField,
  onEditField,
  setSectionToDelete,
  setFieldToDelete,
}: SectionItemProps) {
  // Ensure we have a valid ID for the section
  const sectionId =
    section._id || `section_${Math.random().toString(36).substr(2, 9)}`;

  return (
    <AccordionItem
      value={sectionId}
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <AccordionTrigger className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 dark:hover:bg-slate-700 group w-full text-left">
        <div className="flex items-center w-full flex-grow pointer-events-none">
          <div className="flex items-center justify-center h-6 sm:h-7 w-6 sm:w-7 bg-green-100 dark:bg-green-900/30 rounded-full mx-2 sm:mx-3 text-green-600 dark:text-green-400">
            <Layers3Icon className="h-3 sm:h-4 w-3 sm:w-4" />
          </div>
          <div className="flex-grow">
            <h3 className="text-green-700 dark:text-green-400 font-medium text-xs sm:text-sm flex items-center flex-wrap gap-1 sm:gap-0">
              {section.label}
              <span className="sm:mx-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-full">
                {section.fields.length}{" "}
                {section.fields.length === 1 ? "field" : "fields"}
              </span>
            </h3>
            {section.description && (
              <p className="text-gray-500 dark:text-gray-400 text-xs hidden sm:block">
                {section.description}
              </p>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-3 sm:p-4 bg-gradient-to-b from-gray-50 to-white dark:from-slate-700/50 dark:to-slate-800">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 sm:mb-4">
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <GripVerticalIcon className="h-3 sm:h-4 w-3 sm:w-4 text-gray-400 mx-1" />
                Fields
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {section.fields.length}{" "}
                {section.fields.length === 1 ? "field" : "fields"} in this
                section
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {!isViewMode && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 shadow-sm text-xs sm:text-sm h-7 sm:h-8 py-0 px-2 sm:px-3"
                    onClick={onEditSection}
                  >
                    <PencilIcon className="h-3 sm:h-4 w-3 sm:w-4 mx-0.5 sm:mx-1" />
                    Edit Section
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 shadow-sm text-xs sm:text-sm h-7 sm:h-8 py-0 px-2 sm:px-3"
                    onClick={onAddField}
                  >
                    <CirclePlusIcon className="h-3 sm:h-4 w-3 sm:w-4 mx-0.5 sm:mx-1" />
                    Add Field
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 shadow-sm h-7 sm:h-8 w-7 sm:w-8 p-0"
                        onClick={setSectionToDelete}
                      >
                        <TrashIcon className="h-3 sm:h-4 w-3 sm:w-4" />
                      </Button>
                    </AlertDialogTrigger>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>

          {section.fields.length === 0 ? (
            <div className="text-center py-4 sm:py-6 border border-dashed border-green-200 dark:border-green-900 rounded-lg bg-green-50/50 dark:bg-green-900/10">
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2">
                No fields have been added to this section yet
              </p>
              {!isViewMode && (
                <Button
                  className="mt-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white shadow-sm text-xs sm:text-sm h-7 sm:h-8 py-0"
                  size="sm"
                  onClick={onAddField}
                >
                  <CirclePlusIcon className="mx-0.5 sm:mx-1 h-3 w-3" />
                  Add Field
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {section.fields.map((field, index) => {
                const fieldId = field._id || `field_${index}`;
                return (
                  <FieldItem
                    key={fieldId}
                    field={field}
                    isViewMode={isViewMode}
                    onEditField={() => onEditField(fieldId)}
                    onDeleteField={() => setFieldToDelete(fieldId)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

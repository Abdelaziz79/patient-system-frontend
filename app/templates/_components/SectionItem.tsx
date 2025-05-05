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
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 group w-full text-left">
        <div className="flex items-center w-full flex-grow pointer-events-none">
          <div className="flex items-center justify-center h-7 w-7 bg-green-100 dark:bg-green-900/30 rounded-full mx-3 text-green-600 dark:text-green-400">
            <Layers3Icon className="h-4 w-4" />
          </div>
          <div className="flex-grow">
            <h3 className="text-green-700 dark:text-green-400 font-medium text-sm flex items-center">
              {section.label}
              <span className="mx-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {section.fields.length}{" "}
                {section.fields.length === 1 ? "field" : "fields"}
              </span>
            </h3>
            {section.description && (
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {section.description}
              </p>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-4 bg-gradient-to-b from-gray-50 to-white dark:from-slate-700/50 dark:to-slate-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <GripVerticalIcon className="h-4 w-4 text-gray-400 mx-1" />
                Fields
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {section.fields.length}{" "}
                {section.fields.length === 1 ? "field" : "fields"} in this
                section
              </p>
            </div>
            <div className="flex gap-2">
              {!isViewMode && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 shadow-sm"
                    onClick={onEditSection}
                  >
                    <PencilIcon className="h-4 w-4 mx-1" />
                    Edit Section
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 shadow-sm"
                    onClick={onAddField}
                  >
                    <CirclePlusIcon className="h-4 w-4 mx-1" />
                    Add Field
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 shadow-sm"
                        onClick={setSectionToDelete}
                      >
                        <TrashIcon className="h-4 w-4 mx-1" />
                      </Button>
                    </AlertDialogTrigger>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>

          {section.fields.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-green-200 dark:border-green-900 rounded-lg bg-green-50/50 dark:bg-green-900/10">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                No fields have been added to this section yet
              </p>
              {!isViewMode && (
                <Button
                  className="mt-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white shadow-sm"
                  size="sm"
                  onClick={onAddField}
                >
                  <CirclePlusIcon className="mx-1 h-3 w-3" />
                  Add Field
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
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

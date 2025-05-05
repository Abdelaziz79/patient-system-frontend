import { Field } from "@/app/_types/Template";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";

interface FieldItemProps {
  field: Field;
  isViewMode: boolean;
  onEditField: () => void;
  onDeleteField: () => void;
}

export function FieldItem({
  field,
  isViewMode,
  onEditField,
  onDeleteField,
}: FieldItemProps) {
  // Function to get field type icon color
  const getFieldTypeColor = (type: string) => {
    switch (type) {
      case "text":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "select":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "number":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "date":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "textarea":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
      case "checkbox":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3">
        <div className={`${getFieldTypeColor(field.type)} p-2 rounded-md`}>
          <span className="text-xs font-medium">{field.type}</span>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
            {field.label}
            {field.required && (
              <span className="text-red-500 mx-1 font-bold">*</span>
            )}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-600 dark:text-gray-300">
              {field.name}
            </span>
            {field.description && (
              <span className="mx-1">- {field.description}</span>
            )}
          </p>
        </div>
      </div>
      {!isViewMode && (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-green-700 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-900/20 rounded-full h-8 w-8 p-0"
            onClick={onEditField}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-full h-8 w-8 p-0"
                onClick={onDeleteField}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}

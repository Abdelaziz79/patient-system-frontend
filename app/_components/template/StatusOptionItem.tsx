import { PatientStatusOption } from "@/app/_types/Template";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircleIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

interface StatusOptionItemProps {
  status: PatientStatusOption;
  isViewMode: boolean;
  onEditStatus: () => void;
  onDeleteStatus: () => void;
  isOnlyStatus: boolean;
}

export function StatusOptionItem({
  status,
  isViewMode,
  onEditStatus,
  onDeleteStatus,
  isOnlyStatus,
}: StatusOptionItemProps) {
  // Calculate whether to use light or dark text based on background color
  const getContrastText = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance - simplified formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? "text-gray-900" : "text-white";
  };

  const contrastText = getContrastText(status.color);

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: status.color }}
            className="h-8 w-8 rounded-full flex items-center justify-center shadow-sm"
          >
            {status.isDefault && (
              <CheckIcon className={`h-4 w-4 ${contrastText}`} />
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
              {status.label}
              {status.isDefault && (
                <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs font-medium">
                  Default
                </Badge>
              )}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-600 dark:text-gray-300">
                {status.name}
              </span>
              {status.description && (
                <span className="ml-1">- {status.description}</span>
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
              onClick={onEditStatus}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-full h-8 w-8 p-0 disabled:opacity-50"
                  onClick={onDeleteStatus}
                  disabled={isOnlyStatus}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Status Color Preview */}
      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <div
          className="w-full h-2 rounded-full mt-1"
          style={{ backgroundColor: status.color }}
        ></div>
      </div>
    </div>
  );
}

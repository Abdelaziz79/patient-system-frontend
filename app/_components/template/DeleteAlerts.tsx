import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangleIcon } from "lucide-react";

interface DeleteAlertsProps {
  sectionToDelete: string | null;
  setSectionToDelete: (id: string | null) => void;
  onDeleteSection: (id: string) => void;

  fieldToDelete: { sectionId: string; fieldId: string } | null;
  setFieldToDelete: (
    data: { sectionId: string; fieldId: string } | null
  ) => void;
  onDeleteField: (sectionId: string, fieldId: string) => void;

  statusToDelete: string | null;
  setStatusToDelete: (id: string | null) => void;
  onDeleteStatus: (id: string) => void;
}

export function DeleteAlerts({
  sectionToDelete,
  setSectionToDelete,
  onDeleteSection,

  fieldToDelete,
  setFieldToDelete,
  onDeleteField,

  statusToDelete,
  setStatusToDelete,
  onDeleteStatus,
}: DeleteAlertsProps) {
  return (
    <>
      {/* Section Delete Confirmation */}
      <AlertDialog
        open={!!sectionToDelete}
        onOpenChange={(open) => !open && setSectionToDelete(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-slate-800 border-red-100 dark:border-red-900 shadow-lg max-w-md">
          <AlertDialogHeader className="space-y-2">
            <div className="mx-auto bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-full flex items-center justify-center">
              <AlertTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl text-center text-red-600 dark:text-red-400 font-bold">
              Delete Section
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300 text-center">
              Are you sure you want to delete this section? This will also
              delete all fields within this section. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 space-x-2">
            <AlertDialogCancel
              onClick={() => setSectionToDelete(null)}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 border-none"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
              onClick={() => {
                if (sectionToDelete) {
                  onDeleteSection(sectionToDelete);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Field Delete Confirmation */}
      <AlertDialog
        open={!!fieldToDelete}
        onOpenChange={(open) => !open && setFieldToDelete(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-slate-800 border-red-100 dark:border-red-900 shadow-lg max-w-md">
          <AlertDialogHeader className="space-y-2">
            <div className="mx-auto bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-full flex items-center justify-center">
              <AlertTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl text-center text-red-600 dark:text-red-400 font-bold">
              Delete Field
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300 text-center">
              Are you sure you want to delete this field? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 space-x-2">
            <AlertDialogCancel
              onClick={() => setFieldToDelete(null)}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 border-none"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
              onClick={() => {
                if (fieldToDelete) {
                  onDeleteField(fieldToDelete.sectionId, fieldToDelete.fieldId);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Delete Confirmation */}
      <AlertDialog
        open={!!statusToDelete}
        onOpenChange={(open) => !open && setStatusToDelete(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-slate-800 border-red-100 dark:border-red-900 shadow-lg max-w-md">
          <AlertDialogHeader className="space-y-2">
            <div className="mx-auto bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-full flex items-center justify-center">
              <AlertTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl text-center text-red-600 dark:text-red-400 font-bold">
              Delete Status
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300 text-center">
              Are you sure you want to delete this status option? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 space-x-2">
            <AlertDialogCancel
              onClick={() => setStatusToDelete(null)}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 border-none"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
              onClick={() => {
                if (statusToDelete) {
                  onDeleteStatus(statusToDelete);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

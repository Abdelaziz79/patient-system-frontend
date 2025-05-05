import { useLanguage } from "@/app/_contexts/LanguageContext";
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
}

export function DeleteAlerts({
  sectionToDelete,
  setSectionToDelete,
  onDeleteSection,

  fieldToDelete,
  setFieldToDelete,
  onDeleteField,
}: DeleteAlertsProps) {
  const { t } = useLanguage();

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
              {t("deleteSection")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300 text-center">
              {t("deleteSectionConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-x-2">
            <AlertDialogCancel
              onClick={() => setSectionToDelete(null)}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 border-none"
            >
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
              onClick={() => {
                if (sectionToDelete) {
                  onDeleteSection(sectionToDelete);
                }
              }}
            >
              {t("delete")}
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
              {t("deleteField")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300 text-center">
              {t("deleteFieldConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-x-2">
            <AlertDialogCancel
              onClick={() => setFieldToDelete(null)}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 border-none"
            >
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
              onClick={() => {
                if (fieldToDelete) {
                  onDeleteField(fieldToDelete.sectionId, fieldToDelete.fieldId);
                }
              }}
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

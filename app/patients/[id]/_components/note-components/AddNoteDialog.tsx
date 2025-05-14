import { useLanguage } from "@/app/_contexts/LanguageContext";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FilePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface AddNoteDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  patientId?: string;
  onNoteAdded?: () => void;
}

export function AddNoteDialog({
  isOpen,
  setIsOpen,
  patientId,
  onNoteAdded,
}: AddNoteDialogProps) {
  const { t } = useLanguage();
  const { addNote, isAddingNote } = usePatient({
    initialFetch: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    content: "",
    category: "general",
    priority: "medium",
    isPinned: false,
  });

  const [errors, setErrors] = useState<{
    name?: string;
    content?: string;
  }>({});

  const resetForm = () => {
    setFormData({
      name: "",
      content: "",
      category: "general",
      priority: "medium",
      isPinned: false,
    });
    setErrors({});
  };

  const handleCloseDialog = () => {
    resetForm();
    setIsOpen(false);
  };

  const validateForm = () => {
    const newErrors: { name?: string; content?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t("titleRequired");
    }

    if (!formData.content.trim()) {
      newErrors.content = t("contentRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!patientId) {
      toast.error(t("patientIdMissing"));
      return;
    }

    if (!validateForm()) return;

    try {
      const result = await addNote(patientId, formData);

      if (result.success) {
        toast.success(t("noteAddedSuccess"));
        handleCloseDialog();
        if (onNoteAdded) onNoteAdded();
      } else {
        toast.error(result.error || t("failedToAddNote"));
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error(t("errorAddingNote"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <FilePlus className="h-5 w-5" />
            {t("addNewNote")}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-5">
          <div className="transition-all duration-200">
            <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("title")} <span className="text-red-500">*</span>
            </label>
            <input
              className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 
                ${
                  errors.name
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                }`}
              value={formData.name}
              placeholder="Enter note title..."
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center">
                <span className="mx-1">•</span> {errors.name}
              </p>
            )}
          </div>

          <div className="transition-all duration-200">
            <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("content")} <span className="text-red-500">*</span>
            </label>
            <Textarea
              className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 min-h-[120px] 
                ${
                  errors.content
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                }`}
              value={formData.content}
              placeholder="Enter note content..."
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
            {errors.content && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center">
                <span className="mx-1">•</span> {errors.content}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                {t("category")}
              </label>
              <select
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 bg-white dark:bg-gray-800 transition-all duration-200"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="general">{t("categoryGeneral")}</option>
                <option value="clinical">{t("categoryClinical")}</option>
                <option value="administrative">
                  {t("categoryAdministrative")}
                </option>
                <option value="follow_up">{t("categoryFollowUp")}</option>
                <option value="other">{t("categoryOther")}</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                {t("priority")}
              </label>
              <select
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 bg-white dark:bg-gray-800 transition-all duration-200"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="low">{t("priorityLow")}</option>
                <option value="medium">{t("priorityMedium")}</option>
                <option value="high">{t("priorityHigh")}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="is-pinned"
              checked={formData.isPinned}
              onChange={(e) =>
                setFormData({ ...formData, isPinned: e.target.checked })
              }
              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="is-pinned"
              className="mx-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {t("pinThisNote")}
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2 border-t">
          <Button
            variant="outline"
            onClick={handleCloseDialog}
            className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isAddingNote}
            className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
          >
            {isAddingNote ? (
              <>
                <Loader2 className="mx-2 h-4 w-4 animate-spin" /> {t("adding")}
              </>
            ) : (
              t("addNote")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  CalendarClock,
  Edit,
  Loader2,
  MoreVertical,
  Pin,
  Trash,
  Undo,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface NoteCardProps {
  note: {
    _id?: string;
    id?: string;
    name: string;
    content: string;
    category?: string;
    priority?: string;
    isPinned?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    createdBy?: any;
    updatedBy?: any;
  };
  onDelete?: (noteId: string) => void;
  onRestore?: (noteId: string) => void;
  isDeleted?: boolean;
  isDeleting?: boolean;
  isRestoring?: boolean;
  onNoteUpdate?: () => void;
}

export function NoteCard({
  note,
  onDelete,
  onRestore,
  isDeleted = false,
  isDeleting = false,
  isRestoring = false,
  onNoteUpdate,
}: NoteCardProps) {
  const { t, dir } = useLanguage();
  const { updateNote, isUpdatingNote } = usePatient({
    initialFetch: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({
    name: note.name,
    content: note.content,
    category: note.category || "general",
    priority: note.priority || "medium",
    isPinned: note.isPinned || false,
  });

  // Format date for display
  const formatDate = (dateStr?: Date | string) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "PPp");
    } catch (e) {
      return String(dateStr);
    }
  };

  // Get note ID (handle both _id and id)
  const getNoteId = () => {
    return note._id || note.id || "";
  };

  // Get category display name
  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case "general":
        return t("categoryGeneral");
      case "clinical":
        return t("categoryClinical");
      case "administrative":
        return t("categoryAdministrative");
      case "follow_up":
        return t("categoryFollowUp");
      case "other":
        return t("categoryOther");
      default:
        return category || t("categoryGeneral");
    }
  };

  // Get priority display color
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-amber-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Handle note edit
  const handleEdit = async () => {
    const noteId = getNoteId();
    if (!noteId) return;

    try {
      const patientId = window.location.pathname.split("/")[2]; // Get patient ID from URL
      const result = await updateNote(patientId, noteId, editedNote);

      if (result.success) {
        toast.success(t("noteUpdatedSuccess"));
        setIsEditing(false);
        if (onNoteUpdate) onNoteUpdate();
      } else {
        toast.error(result.error || t("failedToUpdateNote"));
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error(t("errorUpdatingNote"));
    }
  };
  return (
    <>
      <Card
        className={`w-full transition-all duration-300 hover:shadow-lg border-l-4 ${
          isDeleted
            ? "bg-gray-50 dark:bg-slate-800/30 border-l-gray-300 dark:border-l-gray-600"
            : note.isPinned
            ? "border-l-amber-500 hover:border-l-amber-600"
            : note.priority === "high"
            ? "border-l-red-500 hover:border-l-red-600"
            : note.priority === "medium"
            ? "border-l-amber-500 hover:border-l-amber-600"
            : "border-l-indigo-500 hover:border-l-indigo-600"
        }`}
        dir={dir as "rtl" | "ltr"}
      >
        <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-medium text-slate-800 dark:text-slate-100">
                {note.name}
              </CardTitle>
              {note.isPinned && (
                <Pin className="h-4 w-4 text-amber-500 animate-pulse" />
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge
                variant="outline"
                className="text-xs bg-slate-100 dark:bg-slate-700 font-medium px-2 py-0.5"
              >
                {getCategoryLabel(note.category)}
              </Badge>
              <Badge
                className={`text-xs font-medium px-2 py-0.5 ${getPriorityColor(
                  note.priority
                )}`}
              >
                {note.priority}
              </Badge>
            </div>
          </div>

          {!isDeleted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 border border-slate-200 dark:border-slate-700"
              >
                <DropdownMenuItem
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700"
                >
                  <Edit className="mx-2 h-4 w-4" /> {t("edit")}
                </DropdownMenuItem>
                {onDelete && (
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
                    onClick={() => onDelete(getNoteId())}
                    disabled={isDeleting}
                  >
                    <Trash className="mx-2 h-4 w-4" /> {t("delete")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isDeleted && onRestore && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRestore(getNoteId())}
              disabled={isRestoring}
              className="h-8 text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {isRestoring ? (
                <Loader2 className="h-3 w-3 mx-1 animate-spin" />
              ) : (
                <Undo className="h-3 w-3 mx-1" />
              )}
              {t("restore")}
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-4 pt-3">
          <div className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {note.content}
          </div>
        </CardContent>

        <CardFooter className="p-3 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <CalendarClock className="h-3 w-3" />
              <span>{formatDate(note.createdAt)}</span>
            </div>
          </div>

          {note.createdBy && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>
                {typeof note.createdBy === "object"
                  ? note.createdBy.name
                  : note.createdBy}
              </span>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Edit Note Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <Edit className="h-5 w-5" />
              {t("editNote")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 py-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                {t("title")}
              </label>
              <input
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 dark:bg-gray-800"
                value={editedNote.name}
                onChange={(e) =>
                  setEditedNote({ ...editedNote, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                {t("content")}
              </label>
              <Textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 min-h-[120px] dark:bg-gray-800"
                value={editedNote.content}
                onChange={(e) =>
                  setEditedNote({ ...editedNote, content: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("category")}
                </label>
                <select
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 bg-white dark:bg-gray-800 transition-all duration-200"
                  value={editedNote.category}
                  onChange={(e) =>
                    setEditedNote({ ...editedNote, category: e.target.value })
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
                  value={editedNote.priority}
                  onChange={(e) =>
                    setEditedNote({ ...editedNote, priority: e.target.value })
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
                checked={editedNote.isPinned}
                onChange={(e) =>
                  setEditedNote({ ...editedNote, isPinned: e.target.checked })
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
              onClick={() => setIsEditing(false)}
              className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleEdit}
              disabled={isUpdatingNote}
              className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
            >
              {isUpdatingNote ? (
                <>
                  <Loader2 className="mx-2 h-4 w-4 animate-spin" />{" "}
                  {t("saving")}
                </>
              ) : (
                t("saveChanges")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

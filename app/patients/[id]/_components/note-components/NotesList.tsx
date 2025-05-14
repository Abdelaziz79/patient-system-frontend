import { useLanguage } from "@/app/_contexts/LanguageContext";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import { IPatient } from "@/app/_types/Patient";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilePlus, Filter, Loader2, Search, StickyNote, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AddNoteDialog } from "./AddNoteDialog";
import { NoteCard } from "./NoteCard";

interface NotesListProps {
  patient: IPatient;
  onNoteUpdate?: () => void;
}

export function NotesList({ patient, onNoteUpdate }: NotesListProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("active");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | undefined>(
    undefined
  );
  const [filterPriority, setFilterPriority] = useState<string | undefined>(
    undefined
  );
  const [isPinnedOnly, setIsPinnedOnly] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const {
    getPatientNotes,
    searchNotes,
    deleteNote,
    restoreNote,
    isDeletingNote,
    isRestoringNote,
  } = usePatient({
    initialFetch: false,
  });

  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get active notes
  const activeNotes = patient.notes
    ? patient.notes.filter((note) => !note.isDeleted)
    : [];

  // Get deleted notes
  const deletedNotes = patient.notes
    ? patient.notes.filter((note) => note.isDeleted)
    : [];

  // Reset filters
  const resetFilters = () => {
    setFilterCategory(undefined);
    setFilterPriority(undefined);
    setIsPinnedOnly(false);
    setSearchQuery("");
  };

  useEffect(() => {
    // Reset notes when patient changes
    resetFilters();
  }, [patient.id]);

  const fetchNotes = async () => {
    if (!patient?.id) return;

    try {
      setIsLoading(true);
      const params = {
        category: filterCategory,
        priority: filterPriority,
        isPinned: isPinnedOnly || undefined,
        query: searchQuery || undefined,
      };

      const result = await getPatientNotes(patient.id, params);
      setNotes(result);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error(t("failedToFetchNotes"));
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for deleting a note with confirmation
  const handleDeleteNote = async (noteId: string) => {
    if (!patient?.id) return;

    if (window.confirm(t("confirmDeleteNote"))) {
      try {
        const result = await deleteNote(patient.id, noteId);
        if (result.success) {
          toast.success(t("noteDeletedSuccess"));
          if (onNoteUpdate) onNoteUpdate();
        } else {
          toast.error(result.error || t("failedToDeleteNote"));
        }
      } catch (error) {
        console.error("Error deleting note:", error);
        toast.error(t("errorDeletingNote"));
      }
    }
  };

  // Handler for restoring a deleted note
  const handleRestoreNote = async (noteId: string) => {
    if (!patient?.id) return;

    try {
      const result = await restoreNote(patient.id, noteId);
      if (result.success) {
        toast.success(t("noteRestoredSuccess"));
        if (onNoteUpdate) onNoteUpdate();
      } else {
        toast.error(result.error || t("failedToRestoreNote"));
      }
    } catch (error) {
      console.error("Error restoring note:", error);
      toast.error(t("errorRestoringNote"));
    }
  };

  // Handler for searching notes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchNotes();
  };

  // Apply filters handler
  const handleApplyFilters = () => {
    fetchNotes();
  };

  const getActiveNotesCount = () => {
    if (filterCategory || filterPriority || isPinnedOnly || searchQuery) {
      return notes.filter((n) => !n.isDeleted).length;
    }
    return activeNotes.length;
  };

  const getDeletedNotesCount = () => {
    if (filterCategory || filterPriority || isPinnedOnly || searchQuery) {
      return notes.filter((n) => n.isDeleted).length;
    }
    return deletedNotes.length;
  };

  // Check if any filters are applied
  const hasActiveFilters = () => {
    return (
      !!filterCategory || !!filterPriority || isPinnedOnly || !!searchQuery
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <StickyNote className="h-4 w-4 text-indigo-600" />
          {t("patientNotes")}
        </h2>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            size="sm"
            className="h-8 sm:h-9 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs sm:text-sm transition-colors shadow-sm"
            onClick={() => setIsDialogOpen(true)}
          >
            <FilePlus className="h-3 w-3 sm:h-4 sm:w-4 mx-1" />
            <span>{t("addNote")}</span>
          </Button>
        </div>
      </div>

      <div className="px-1 py-2 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t("searchNotes")}
              className="p-2 px-9 border rounded-md w-full focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-colors dark:bg-gray-800 dark:border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 px-3 flex items-center"
                onClick={() => {
                  setSearchQuery("");
                  if (hasActiveFilters()) fetchNotes();
                }}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className={`${
              isFiltersVisible
                ? "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800"
                : ""
            } min-w-[80px]`}
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          >
            <Filter className="h-4 w-4 mx-1" />
            {t("filters")}
          </Button>
        </div>

        {isFiltersVisible && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md animate-in fade-in duration-300 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                  {t("category")}
                </label>
                <select
                  value={filterCategory || ""}
                  onChange={(e) =>
                    setFilterCategory(e.target.value || undefined)
                  }
                  className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">{t("allCategories")}</option>
                  <option value="general">{t("categoryGeneral")}</option>
                  <option value="clinical">{t("categoryClinical")}</option>
                  <option value="administrative">
                    {t("categoryAdministrative")}
                  </option>
                  <option value="follow_up">{t("categoryFollowUp")}</option>
                  <option value="other">{t("categoryOther")}</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                  {t("priority")}
                </label>
                <select
                  value={filterPriority || ""}
                  onChange={(e) =>
                    setFilterPriority(e.target.value || undefined)
                  }
                  className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">{t("allPriorities")}</option>
                  <option value="low">{t("priorityLow")}</option>
                  <option value="medium">{t("priorityMedium")}</option>
                  <option value="high">{t("priorityHigh")}</option>
                </select>
              </div>

              <div className="flex items-end pb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pinned-only"
                    checked={isPinnedOnly}
                    onChange={() => setIsPinnedOnly(!isPinnedOnly)}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="pinned-only"
                    className="mx-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {t("pinnedOnly")}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8 border-gray-300 dark:border-gray-600"
                onClick={resetFilters}
              >
                {t("clearFilters")}
              </Button>
              <Button
                size="sm"
                className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleApplyFilters}
              >
                {t("apply")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {hasActiveFilters() && (
        <div className="px-2 py-1 text-sm text-indigo-700 dark:text-indigo-400">
          <p>
            {notes.length} results
            {hasActiveFilters() && (
              <Button
                variant="link"
                size="sm"
                className="text-xs p-0 h-auto font-normal underline text-indigo-600 dark:text-indigo-400"
                onClick={resetFilters}
              >
                {t("clearFilters")}
              </Button>
            )}
          </p>
        </div>
      )}

      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100 dark:bg-slate-800 p-1">
          <TabsTrigger
            value="active"
            className="text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 transition-all"
          >
            {t("activeNotes")} ({getActiveNotesCount()})
          </TabsTrigger>
          <TabsTrigger
            value="deleted"
            className="text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 transition-all"
          >
            {t("deletedNotes")} ({getDeletedNotesCount()})
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="active"
          className="animate-in fade-in-50 duration-300"
        >
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <span className="mt-2 text-sm text-gray-500">Loading...</span>
              </div>
            </div>
          ) : hasActiveFilters() &&
            notes.filter((n) => !n.isDeleted).length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/30">
              <p className="text-gray-500 mb-2">No notes match the filters</p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="mt-2"
              >
                {t("clearFilters")}
              </Button>
            </div>
          ) : activeNotes.length === 0 && !hasActiveFilters() ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/30">
              <p className="text-gray-500 mb-2">{t("noActiveNotes")}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                className="mt-2"
              >
                {t("createFirstNote")}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {hasActiveFilters()
                ? notes
                    .filter((note) => !note.isDeleted)
                    .map((note) => (
                      <NoteCard
                        key={note._id || note.id}
                        note={note}
                        onDelete={handleDeleteNote}
                        isDeleting={isDeletingNote}
                        onNoteUpdate={onNoteUpdate}
                      />
                    ))
                : activeNotes.map((note) => (
                    <NoteCard
                      key={note._id || note.id}
                      note={note}
                      onDelete={handleDeleteNote}
                      isDeleting={isDeletingNote}
                      onNoteUpdate={onNoteUpdate}
                    />
                  ))}
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="deleted"
          className="animate-in fade-in-50 duration-300"
        >
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <span className="mt-2 text-sm text-gray-500">Loading...</span>
              </div>
            </div>
          ) : hasActiveFilters() &&
            notes.filter((n) => n.isDeleted).length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/30">
              <p className="text-gray-500 mb-2">
                No deleted notes match the filters
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="mt-2"
              >
                {t("clearFilters")}
              </Button>
            </div>
          ) : deletedNotes.length === 0 && !hasActiveFilters() ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/30">
              <p className="text-gray-500">{t("noDeletedNotes")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {hasActiveFilters()
                ? notes
                    .filter((note) => note.isDeleted)
                    .map((note) => (
                      <NoteCard
                        key={note._id || note.id}
                        note={note}
                        isDeleted
                        onRestore={handleRestoreNote}
                        isRestoring={isRestoringNote}
                      />
                    ))
                : deletedNotes.map((note) => (
                    <NoteCard
                      key={note._id || note.id}
                      note={note}
                      isDeleted
                      onRestore={handleRestoreNote}
                      isRestoring={isRestoringNote}
                    />
                  ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddNoteDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        patientId={patient?.id}
        onNoteAdded={onNoteUpdate}
      />
    </div>
  );
}

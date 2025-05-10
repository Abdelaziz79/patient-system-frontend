import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IPatient } from "@/app/_types/Patient";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilePlus, Flag } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { EventCard } from "./EventCard";

interface EventsListProps {
  patient: IPatient;
  activeEvents: any[];
  onDeleteEvent: (eventId: string) => Promise<any>;
  onRestoreEvent: (eventId: string) => Promise<any>;
  isDeletingEvent: boolean;
  isRestoringEvent?: boolean;
  onEventUpdate?: () => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export function EventsList({
  patient,
  activeEvents,
  onDeleteEvent,
  onRestoreEvent,
  isDeletingEvent,
  isRestoringEvent,
  onEventUpdate,
  setIsDialogOpen,
}: EventsListProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("active");

  // Get deleted events
  const deletedEvents = patient.events
    ? patient.events.filter((event) => event.isDeleted)
    : [];

  // Handler for deleting an event with confirmation
  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      if (window.confirm(t("confirmDeleteEvent"))) {
        try {
          const result = await onDeleteEvent(eventId);
          if (result.success) {
            toast.success(t("eventDeletedSuccess"));
            // Refresh patient data
            if (onEventUpdate) {
              onEventUpdate();
            }
          } else {
            toast.error(result.error || t("failedToDeleteEvent"));
          }
        } catch (error) {
          console.error("Error deleting event:", error);
          toast.error(t("errorDeletingEvent"));
        }
      }
    },
    [onDeleteEvent, onEventUpdate, t]
  );

  // Handler for restoring an event
  const handleRestoreEvent = useCallback(
    async (eventId: string) => {
      try {
        const result = await onRestoreEvent(eventId);
        if (result.success) {
          toast.success(t("eventRestoredSuccess"));
          // Refresh patient data
          if (onEventUpdate) {
            onEventUpdate();
          }
        } else {
          toast.error(result.error || t("failedToRestoreEvent"));
        }
      } catch (error) {
        console.error("Error restoring event:", error);
        toast.error(t("errorRestoringEvent"));
      }
    },
    [onRestoreEvent, onEventUpdate, t]
  );

  // If no events at all
  if (!patient?.events || patient.events.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50/60 dark:bg-slate-800/60 rounded-lg border border-gray-100 dark:border-gray-700">
        <Flag className="h-12 w-12 mx-auto text-green-300 dark:text-slate-600 mb-3" />
        <p className="text-green-600 dark:text-slate-400 font-medium">
          {t("noEventsRecorded")}
        </p>
        <p className="text-green-500 dark:text-slate-500 text-sm mt-1 mb-4">
          {t("addFirstEventDescription")}
        </p>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-colors shadow-sm"
        >
          <FilePlus className="h-4 w-4 mx-2" />
          {t("addFirstEvent")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="active" className="flex items-center gap-1">
            Active Events ({activeEvents.length})
          </TabsTrigger>
          <TabsTrigger value="deleted" className="flex items-center gap-1">
            Deleted Events ({deletedEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeEvents.length > 0 ? (
            activeEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDeleteEvent={handleDeleteEvent}
                isDeletingEvent={isDeletingEvent}
              />
            ))
          ) : (
            <div className="text-center p-6 bg-gray-50/60 dark:bg-slate-800/60 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                {t("noActiveEvents")}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="deleted" className="space-y-4">
          {deletedEvents.length > 0 ? (
            deletedEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDeleteEvent={handleDeleteEvent}
                onRestoreEvent={handleRestoreEvent}
                isDeletingEvent={isDeletingEvent}
                isRestoringEvent={isRestoringEvent}
              />
            ))
          ) : (
            <div className="text-center p-6 bg-gray-50/60 dark:bg-slate-800/60 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No deleted events.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

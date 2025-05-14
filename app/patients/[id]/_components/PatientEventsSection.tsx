import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useEvents } from "@/app/_hooks/event/useEvents";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { IPatient } from "@/app/_types/Patient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brain, CalendarDays, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

import { AddEventDialog } from "./event-components/AddEventDialog";
import { AIAnalysisSection } from "./event-components/AIAnalysisSection";
import { EventsList } from "./event-components/EventsList";

interface PatientEventsSectionProps {
  patient: IPatient;
  onEventUpdate?: () => void;
}

export function PatientEventsSection({
  patient,
  onEventUpdate,
}: PatientEventsSectionProps) {
  const { t, language } = useLanguage();
  const { user } = useAuthContext();
  const canUseAIFeatures =
    user?.role === "admin" ||
    user?.role === "super_admin" ||
    user?.role === "doctor";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aiEventAnalysis, setAiEventAnalysis] = useState<string | null>(null);
  const [isAnalyzingEvents, setIsAnalyzingEvents] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState<string>("insights");

  // AI analysis states
  const [insightsData, setInsightsData] = useState<string | null>(null);
  const [recommendationsData, setRecommendationsData] = useState<string | null>(
    null
  );
  const [correlationData, setCorrelationData] = useState<string | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [isLoadingCorrelation, setIsLoadingCorrelation] = useState(false);

  const {
    addEvent,
    isAddingEvent,
    deleteEvent,
    isDeletingEvent,
    restoreEvent,
    isRestoringEvent,
  } = usePatient({
    initialFetch: false,
  });

  const {
    analyzeEvents,
    getEventInsights,
    getEventRecommendations,
    getEventCorrelation,
  } = useEvents();

  // Memoize callback functions to prevent unnecessary re-renders
  const handleDeleteEvent = useCallback(
    (eventId: string) => deleteEvent(patient.id || "", eventId),
    [deleteEvent, patient.id]
  );

  const handleRestoreEvent = useCallback(
    (eventId: string) => restoreEvent(patient.id || "", eventId),
    [restoreEvent, patient.id]
  );

  const handleAddEvent = useCallback(
    (eventData: any) => addEvent(patient.id || "", eventData),
    [addEvent, patient.id]
  );

  // Get active events
  const activeEvents = patient.events
    ? patient.events.filter((event) => !event.isDeleted)
    : [];

  // Handler for getting event insights
  const handleGetEventInsights = useCallback(async () => {
    if (!patient?.id || activeEvents.length === 0) {
      toast.error(t("noEventsToAnalyze"));
      return;
    }

    try {
      setIsLoadingInsights(true);
      const result = await getEventInsights(
        patient.id,
        language === "ar" ? "arabic" : "english"
      );

      if (result.success && result.data) {
        setInsightsData(result.data.insights || t("noInsightsFound"));
        setActiveAiTab("insights");
      } else {
        toast.error(result.error || t("failedToGetEventInsights"));
      }
    } catch (error) {
      console.error("Error getting event insights:", error);
      toast.error(t("errorGettingEventInsights"));
    } finally {
      setIsLoadingInsights(false);
    }
  }, [patient?.id, activeEvents, getEventInsights, t]);

  // Handler for getting event recommendations
  const handleGetEventRecommendations = useCallback(async () => {
    if (!patient?.id || activeEvents.length === 0) {
      toast.error(t("noEventsToAnalyze"));
      return;
    }

    try {
      setIsLoadingRecommendations(true);
      const result = await getEventRecommendations(
        patient.id,
        undefined,
        language === "ar" ? "arabic" : "english"
      );

      if (result.success && result.data) {
        setRecommendationsData(
          result.data.recommendations || t("noRecommendationsFound")
        );
        setActiveAiTab("recommendations");
      } else {
        toast.error(result.error || t("failedToGetEventRecommendations"));
      }
    } catch (error) {
      console.error("Error getting event recommendations:", error);
      toast.error(t("errorGettingEventRecommendations"));
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [patient?.id, activeEvents, getEventRecommendations, t]);

  // Handler for getting event correlation
  const handleGetEventCorrelation = useCallback(async () => {
    if (!patient?.id || activeEvents.length === 0) {
      toast.error(t("noEventsToAnalyze"));
      return;
    }

    try {
      setIsLoadingCorrelation(true);
      const result = await getEventCorrelation(
        patient.id,
        language === "ar" ? "arabic" : "english"
      );

      if (result.success && result.data) {
        setCorrelationData(result.data.correlation || t("noCorrelationFound"));
        setActiveAiTab("correlation");
      } else {
        toast.error(result.error || t("failedToGetEventCorrelation"));
      }
    } catch (error) {
      console.error("Error getting event correlation:", error);
      toast.error(t("errorGettingEventCorrelation"));
    } finally {
      setIsLoadingCorrelation(false);
    }
  }, [patient?.id, activeEvents, getEventCorrelation, t]);

  // Count all events for display
  const totalEvents = patient.events ? patient.events.length : 0;

  return (
    <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-indigo-100 dark:border-slate-800 shadow-xl transition-all duration-200 mb-3 sm:mb-6">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
          <div>
            <CardTitle className="text-lg sm:text-xl text-indigo-800 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
              <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-slate-400" />
              {t("patientEvents")}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-indigo-600 dark:text-slate-400">
              {totalEvents} Total Events ({activeEvents.length} Active)
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {canUseAIFeatures && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 sm:h-9 flex items-center gap-1 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-xs sm:text-sm"
                    disabled={activeEvents.length === 0}
                  >
                    <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">{t("aiTools")}</span>
                    <span className="xs:hidden">AI</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 sm:w-56">
                  <DropdownMenuItem
                    onClick={handleGetEventInsights}
                    disabled={isLoadingInsights || activeEvents.length === 0}
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    {t("getEventInsights")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleGetEventRecommendations}
                    disabled={
                      isLoadingRecommendations || activeEvents.length === 0
                    }
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    {t("getEventRecommendations")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleGetEventCorrelation}
                    disabled={isLoadingCorrelation || activeEvents.length === 0}
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    {t("analyzeEventCorrelation")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              size="sm"
              className="h-8 sm:h-9 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs sm:text-sm"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mx-1" />
              <span className="hidden xs:inline">{t("addEvent")}</span>
              <span className="xs:hidden">{t("add")}</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-6 py-2 sm:py-4">
        {/* AI Analysis Section - Only show if user has permission */}
        {canUseAIFeatures && (
          <AIAnalysisSection
            activeAiTab={activeAiTab}
            setActiveAiTab={setActiveAiTab}
            insightsData={insightsData}
            recommendationsData={recommendationsData}
            correlationData={correlationData}
            isLoadingInsights={isLoadingInsights}
            isLoadingRecommendations={isLoadingRecommendations}
            isLoadingCorrelation={isLoadingCorrelation}
            isAnalyzingEvents={isAnalyzingEvents}
            aiEventAnalysis={aiEventAnalysis}
          />
        )}

        {/* Events List */}
        <EventsList
          patient={patient}
          activeEvents={activeEvents}
          onDeleteEvent={handleDeleteEvent}
          onRestoreEvent={handleRestoreEvent}
          isDeletingEvent={isDeletingEvent}
          isRestoringEvent={isRestoringEvent}
          onEventUpdate={onEventUpdate}
          setIsDialogOpen={setIsDialogOpen}
        />

        {/* Add Event Dialog */}
        <AddEventDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onAddEvent={handleAddEvent}
          isAddingEvent={isAddingEvent}
          onEventUpdate={onEventUpdate}
        />
      </CardContent>
    </Card>
  );
}

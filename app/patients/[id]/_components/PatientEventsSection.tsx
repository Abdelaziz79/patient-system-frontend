import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useEvents } from "@/app/_hooks/event/useEvents";
import { usePatient } from "@/app/_hooks/patient/usePatient";
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
import { useState } from "react";
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
  const { t } = useLanguage();
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
    updateEvent,
    isUpdatingEvent,
  } = usePatient({
    initialFetch: false,
  });

  const {
    analyzeEvents,
    getEventInsights,
    getEventRecommendations,
    getEventCorrelation,
    isLoading: isEventsLoading,
  } = useEvents();

  // Get active events
  const activeEvents = patient.events
    ? patient.events.filter((event) => !event.isDeleted)
    : [];

  // Handler for AI event analysis (legacy)
  const handleAnalyzeEvents = async () => {
    if (!patient?.id || activeEvents.length === 0) {
      toast.error(t("noEventsToAnalyze"));
      return;
    }

    try {
      setIsAnalyzingEvents(true);
      const result = await analyzeEvents({
        patientId: patient.id,
        eventIds: activeEvents.map((event) => event._id),
        analysisType: "overview",
      });

      if (result.success && result.data) {
        setAiEventAnalysis(result.data.analysis || t("noNotablePatternsFound"));
      } else {
        toast.error(result.error || t("failedToAnalyzeEvents"));
      }
    } catch (error) {
      console.error("Error analyzing events:", error);
      toast.error(t("errorDuringEventAnalysis"));
    } finally {
      setIsAnalyzingEvents(false);
    }
  };

  // Handler for getting event insights
  const handleGetEventInsights = async () => {
    if (!patient?.id || activeEvents.length === 0) {
      toast.error(t("noEventsToAnalyze"));
      return;
    }

    try {
      setIsLoadingInsights(true);
      const result = await getEventInsights(patient.id);

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
  };

  // Handler for getting event recommendations
  const handleGetEventRecommendations = async () => {
    if (!patient?.id || activeEvents.length === 0) {
      toast.error(t("noEventsToAnalyze"));
      return;
    }

    try {
      setIsLoadingRecommendations(true);
      const result = await getEventRecommendations(patient.id);

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
  };

  // Handler for getting event correlation
  const handleGetEventCorrelation = async () => {
    if (!patient?.id || activeEvents.length === 0) {
      toast.error(t("noEventsToAnalyze"));
      return;
    }

    try {
      setIsLoadingCorrelation(true);
      const result = await getEventCorrelation(patient.id);

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
  };

  // Count all events for display
  const totalEvents = patient.events ? patient.events.length : 0;

  return (
    <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-indigo-100 dark:border-slate-800 shadow-xl transition-all duration-200 mb-6">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-xl text-indigo-800 dark:text-slate-300 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-indigo-600 dark:text-slate-400" />
              {t("patientEvents")}
            </CardTitle>
            <CardDescription className="text-indigo-600 dark:text-slate-400">
              {totalEvents} Total Events ({activeEvents.length} Active)
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 flex items-center gap-1 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                  disabled={activeEvents.length === 0}
                >
                  <Brain className="h-4 w-4" />
                  <span>{t("aiTools")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={handleGetEventInsights}
                  disabled={isLoadingInsights || activeEvents.length === 0}
                  className="cursor-pointer"
                >
                  {t("getEventInsights")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleGetEventRecommendations}
                  disabled={
                    isLoadingRecommendations || activeEvents.length === 0
                  }
                  className="cursor-pointer"
                >
                  {t("getEventRecommendations")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleGetEventCorrelation}
                  disabled={isLoadingCorrelation || activeEvents.length === 0}
                  className="cursor-pointer"
                >
                  {t("analyzeEventCorrelation")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleAnalyzeEvents}
                  disabled={isAnalyzingEvents || activeEvents.length === 0}
                  className="cursor-pointer"
                >
                  {t("legacyAiAnalysis")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className="h-9 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mx-1" /> {t("addEvent")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* AI Analysis Section */}
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

        {/* Events List */}
        <EventsList
          patient={patient}
          activeEvents={activeEvents}
          onDeleteEvent={(eventId) => deleteEvent(patient.id || "", eventId)}
          onRestoreEvent={(eventId) => restoreEvent(patient.id || "", eventId)}
          isDeletingEvent={isDeletingEvent}
          isRestoringEvent={isRestoringEvent}
          onEventUpdate={onEventUpdate}
          setIsDialogOpen={setIsDialogOpen}
        />
      </CardContent>

      {/* Add Event Dialog */}
      <AddEventDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onAddEvent={(eventData) => addEvent(patient.id || "", eventData)}
        isAddingEvent={isAddingEvent}
        onEventUpdate={onEventUpdate}
      />
    </Card>
  );
}

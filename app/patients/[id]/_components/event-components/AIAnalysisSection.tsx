import LoadingInsights from "@/app/_components/LoadingInsights";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Brain, TrendingUp } from "lucide-react";

interface AIAnalysisSectionProps {
  activeAiTab: string;
  setActiveAiTab: (tab: string) => void;
  insightsData: string | null;
  recommendationsData: string | null;
  correlationData: string | null;
  isLoadingInsights: boolean;
  isLoadingRecommendations: boolean;
  isLoadingCorrelation: boolean;
  isAnalyzingEvents: boolean;
  aiEventAnalysis: string | null;
}

export function AIAnalysisSection({
  activeAiTab,
  setActiveAiTab,
  insightsData,
  recommendationsData,
  correlationData,
  isLoadingInsights,
  isLoadingRecommendations,
  isLoadingCorrelation,
  isAnalyzingEvents,
  aiEventAnalysis,
}: AIAnalysisSectionProps) {
  const { t, dir } = useLanguage();

  // If there's no AI data and no loading states, don't render anything
  if (
    !insightsData &&
    !recommendationsData &&
    !correlationData &&
    !isLoadingInsights &&
    !isLoadingRecommendations &&
    !isLoadingCorrelation &&
    !aiEventAnalysis &&
    !isAnalyzingEvents
  ) {
    return null;
  }

  // AI tabs section
  if (
    insightsData ||
    recommendationsData ||
    correlationData ||
    isLoadingInsights ||
    isLoadingRecommendations ||
    isLoadingCorrelation
  ) {
    return (
      <Tabs
        value={activeAiTab}
        onValueChange={setActiveAiTab}
        className="mb-6"
        dir={dir as "ltr" | "rtl"}
      >
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="insights" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            {t("insights")}
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="flex items-center gap-1"
          >
            <TrendingUp className="h-4 w-4" />
            {t("recommendations")}
          </TabsTrigger>
          <TabsTrigger value="correlation" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            {t("correlation")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          <LoadingInsights
            isLoading={false}
            isGenerating={isLoadingInsights}
            insights={insightsData}
            title={t("eventInsights")}
            loadingText={t("analyzingEventsAndPatterns")}
            loadingSubtext={t("lookingForPatterns")}
            className="w-full"
          />
        </TabsContent>

        <TabsContent value="recommendations">
          <LoadingInsights
            isLoading={false}
            isGenerating={isLoadingRecommendations}
            insights={recommendationsData}
            title={t("eventRecommendations")}
            loadingText={t("generatingRecommendations")}
            loadingSubtext={t("analyzingEventHistory")}
            className="w-full"
          />
        </TabsContent>

        <TabsContent value="correlation">
          <LoadingInsights
            isLoading={false}
            isGenerating={isLoadingCorrelation}
            insights={correlationData}
            title={t("eventCorrelation")}
            loadingText={t("analyzingCorrelations")}
            loadingSubtext={t("findingCausalRelationships")}
            className="w-full"
          />
        </TabsContent>
      </Tabs>
    );
  }

  // Legacy AI Analysis (for backward compatibility)
  return (
    <LoadingInsights
      isLoading={false}
      isGenerating={isAnalyzingEvents}
      insights={aiEventAnalysis}
      title={t("aiEventAnalysis")}
      loadingText={t("analyzingEventsAndPatterns")}
      loadingSubtext={t("lookingForTrends")}
      className="mb-6"
    />
  );
}

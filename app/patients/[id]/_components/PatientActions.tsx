import LoadingInsights from "@/app/_components/LoadingInsights";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useAI } from "@/app/_hooks/AI/useAI";
import { useExport } from "@/app/_hooks/export/useExport";
import { useReport } from "@/app/_hooks/report/useReport";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Edit,
  FileSpreadsheet,
  FileText,
  MoreVertical,
  Printer,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { PatientActionsProps } from "./types";

export function PatientActions({
  patient,
  handleGoBack,
  handleEditPatient,
  handlePrintPatient,
}: PatientActionsProps) {
  const { t } = useLanguage();
  const { getPatientInsights, isLoadingInsights } = useAI();
  const { exportPatient, exportPatientToPDF, patientExportLoading } =
    useExport();
  const { generatePatientAIReport } = useReport();
  const { user } = useAuthContext();

  const canUseAIFeatures =
    user?.role === "admin" ||
    user?.role === "super_admin" ||
    user?.role === "doctor";
  const [insights, setInsights] = useState<string | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  const handleGenerateInsights = async () => {
    try {
      setIsGeneratingInsights(true);
      const result = await getPatientInsights(patient?.id || "");
      if (result.success) {
        setInsights(result.data.insights);
        toast.success(t("insightsGeneratedSuccess"));
      } else {
        // Handle error
        toast.error(result.message);
        console.error(result.message);
      }
    } catch (error) {
      toast.error(t("failedToGenerateInsights"));
      console.error(error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleGenerateAIReport = async () => {
    if (!patient?.id) {
      toast.error(t("patientIdRequired"));
      return;
    }

    try {
      setIsGeneratingReport(true);
      const result = await generatePatientAIReport(patient.id);

      if (result.success) {
        setAiReport(result.data?.aiAnalysis || t("noAnalysisAvailable"));
        setReportData(result.data);
        toast.success(t("aiReportGeneratedSuccess"));
      } else {
        toast.error(result.error || t("failedToGenerateAIReport"));
      }
    } catch (error) {
      toast.error(t("errorGeneratingAIReport"));
      console.error(error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleExport = async (format: string) => {
    if (!patient?.id) {
      toast.error(t("patientIdRequired"));
      return;
    }

    try {
      if (format === "pdf") {
        await exportPatientToPDF(patient.id);
      } else {
        await exportPatient(patient.id, format as any);
      }
      toast.success(
        t("patientDataExportedAs").replace("{{format}}", format.toUpperCase())
      );
    } catch (error) {
      toast.error(
        t("failedToExportAs").replace("{{format}}", format.toUpperCase())
      );
      console.error(error);
    }
  };

  return (
    <div className="mb-3 sm:mb-6">
      <div className="p-2 sm:p-4 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md mb-3 sm:mb-6 border border-indigo-100 dark:border-indigo-900">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 mb-2 xs:mb-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 sm:h-9 flex items-center gap-1 sm:gap-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" /> {t("back")}
            </Button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-800 dark:text-indigo-300 truncate">
              {t("patientDetails")}
            </h1>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2 w-full xs:w-auto justify-start xs:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="h-8 sm:h-9 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handlePrintPatient}
            >
              <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
              {t("print")}
              <span className="hidden xs:inline">{t("print")}</span>
            </Button>

            {canUseAIFeatures && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                onClick={handleGenerateInsights}
                disabled={isGeneratingInsights || isLoadingInsights}
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                {t("aiInsights")}
                <span className="hidden xs:inline">
                  {isGeneratingInsights || isLoadingInsights
                    ? t("processing")
                    : t("aiInsights")}
                </span>
              </Button>
            )}

            {canUseAIFeatures && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                onClick={handleGenerateAIReport}
                disabled={isGeneratingReport}
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                {t("aiReport")}
                <span className="hidden xs:inline">
                  {isGeneratingReport ? t("generating") : t("aiReport")}
                </span>
              </Button>
            )}

            <Button
              size="sm"
              className="h-8 sm:h-9 text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white shadow-sm"
              onClick={handleEditPatient}
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2" />
              {t("edit")}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 sm:h-9 text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={patientExportLoading}
                >
                  <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 sm:w-56">
                <DropdownMenuLabel className="text-xs sm:text-sm">
                  {t("patientActions")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400">
                    {t("exportAs")}
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => handleExport("excel")}
                    disabled={patientExportLoading}
                    className="text-xs sm:text-sm"
                  >
                    <FileSpreadsheet className="mx-1 sm:mx-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{t("excelFormat")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport("csv")}
                    disabled={patientExportLoading}
                    className="text-xs sm:text-sm"
                  >
                    <FileText className="mx-1 sm:mx-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{t("csvFormat")}</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {canUseAIFeatures && (
        <LoadingInsights
          isLoading={isLoadingInsights}
          isGenerating={isGeneratingInsights}
          insights={insights}
          title={t("aiAnalysisAndInsights")}
          loadingText={t("analyzingPatientData")}
          loadingSubtext={t("thisMayTakeAMoment")}
        />
      )}

      {canUseAIFeatures && (isGeneratingReport || aiReport) && (
        <div className="mb-3 sm:mb-6 p-3 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-800 bg-white/90 dark:bg-slate-800/90 shadow-md">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-base sm:text-lg font-medium text-purple-800 dark:text-purple-300 flex flex-wrap items-center gap-1 sm:gap-2">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
              {t("medicalAssessmentReport")}
              {reportData?.generatedAt && (
                <span className="text-xs text-purple-600 dark:text-purple-400 font-normal mx-1 sm:mx-2">
                  {t("generated")}:{" "}
                  {new Date(reportData.generatedAt).toLocaleDateString()}
                </span>
              )}
            </h3>

            {!isGeneratingReport && aiReport && (
              <div className="flex gap-1 sm:gap-2 mt-2 xs:mt-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 sm:h-8 text-xs sm:text-sm text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                  onClick={() => setAiReport(null)}
                >
                  {t("dismiss")}
                </Button>
              </div>
            )}
          </div>

          {isGeneratingReport ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <ReactMarkdown>{aiReport || ""}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

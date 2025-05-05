"use client";

import { Spinner } from "@/app/_components/Spinner";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import {
  IAIGroupAnalysisOptions,
  IAIProgressAnalysisOptions,
  IAITreatmentRecommendationsOptions,
} from "@/app/_hooks/report/reportApi";
import { useReport } from "@/app/_hooks/report/useReport";
import { IPatient } from "@/app/_types/Patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Brain,
  Loader2,
  Search,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import LoadingInsights from "@/app/_components/LoadingInsights";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AIReportsProps {
  patients?: IPatient[];
  isPatientsLoading?: boolean;
  generatePatientAIReport?: (patientId: string) => Promise<any>;
  generateGroupAnalysis?: (
    patientIds: string[],
    options?: IAIGroupAnalysisOptions
  ) => Promise<any>;
  generateTreatmentRecommendations?: (
    patientId: string,
    options?: IAITreatmentRecommendationsOptions
  ) => Promise<any>;
  generateProgressAnalysis?: (
    patientId: string,
    options?: IAIProgressAnalysisOptions
  ) => Promise<any>;
  searchPatients?: (params: { query?: string }) => Promise<any>;
}

export default function AIReports({
  patients: propPatients,
  isPatientsLoading: propIsPatientsLoading,
  generatePatientAIReport: propGeneratePatientAIReport,
  generateGroupAnalysis: propGenerateGroupAnalysis,
  generateTreatmentRecommendations: propGenerateTreatmentRecommendations,
  generateProgressAnalysis: propGenerateProgressAnalysis,
  searchPatients: propSearchPatients,
}: AIReportsProps) {
  const { t, isRTL } = useLanguage();

  // Only use hooks as fallback when props aren't provided
  const patientHook = usePatient({
    initialFetch: !propPatients,
    initialLimit: 10,
  });

  // Only initialize useReport if needed for the fallback functions
  const {
    generatePatientAIReport,
    generateGroupAnalysis,
    generateTreatmentRecommendations,
    generateProgressAnalysis,
  } = useReport({
    initialFetch: false,
  });

  // Use props if provided, otherwise use hooks
  const patients = propPatients || patientHook.patients;
  const isPatientsLoading =
    propIsPatientsLoading !== undefined
      ? propIsPatientsLoading
      : patientHook.isLoading;
  const handleGeneratePatientAIReport =
    propGeneratePatientAIReport || generatePatientAIReport;
  const handleGenerateGroupAnalysis =
    propGenerateGroupAnalysis || generateGroupAnalysis;
  const handleGenerateTreatmentRecommendations =
    propGenerateTreatmentRecommendations || generateTreatmentRecommendations;
  const handleGenerateProgressAnalysis =
    propGenerateProgressAnalysis || generateProgressAnalysis;
  const performSearch = propSearchPatients || patientHook.performSearch;
  const refetchPatients = patientHook.refetch;

  const [activeTab, setActiveTab] = useState("patient-report");
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [selectedPatients, setSelectedPatients] = useState<IPatient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IPatient[]>([]);
  const [result, setResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Treatment recommendations options
  const [treatmentOptions, setTreatmentOptions] = useState({
    considerHistoricalTreatments: true,
    specificCondition: "",
  });

  // Group analysis options
  const [groupOptions, setGroupOptions] = useState({
    focus: "",
    timeframe: "all",
    includeVisits: true,
  });

  // Progress analysis options
  const [progressOptions, setProgressOptions] = useState({
    timeframe: "6months",
    focusArea: "",
  });

  // Set initial search results
  useEffect(() => {
    if (patients && patients.length > 0) {
      setSearchResults(patients);
    }
  }, [patients]);

  const getPatientName = (patient: IPatient): string => {
    return patient.personalInfo?.firstName && patient.personalInfo?.lastName
      ? `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`
      : `Patient ${patient.id?.substring(0, 6)}`;
  };

  const handleSearch = async () => {
    if (searchTerm.trim().length < 2) {
      // If search term is cleared, show all patients
      if (searchTerm.trim().length === 0) {
        setSearchResults(patients || []);
      }
      return;
    }

    setIsSearching(true);
    try {
      const results = await performSearch({ query: searchTerm });
      if (results.success) {
        setSearchResults(results.data);
        if (results.data.length === 0) {
          toast.error("No patients found matching your search criteria");
        }
      } else {
        toast.error("Failed to search patients");
      }
    } catch (error) {
      console.error("Error searching patients:", error);
      toast.error("An error occurred while searching patients");
    } finally {
      setIsSearching(false);
    }
  };

  const handlePatientSelect = (patient: IPatient) => {
    setSelectedPatient(patient);
    toast.success(`Selected: ${getPatientName(patient)}`);
  };

  const togglePatientSelection = (patient: IPatient) => {
    if (selectedPatients.some((p) => p.id === patient.id)) {
      setSelectedPatients(selectedPatients.filter((p) => p.id !== patient.id));
      toast.success(`Removed: ${getPatientName(patient)}`);
    } else {
      setSelectedPatients([...selectedPatients, patient]);
      toast.success(`Added: ${getPatientName(patient)}`);
    }
  };

  const handleGeneratePatientReport = async () => {
    if (!selectedPatient?.id) {
      toast.error("Please select a patient first");
      return;
    }

    setGenerating(true);
    setAiResponse(null);
    setError(null);

    try {
      const result = await handleGeneratePatientAIReport(selectedPatient.id);
      if (result.success && result.data) {
        setAiResponse(result.data.aiAnalysis);
      } else {
        setError(result.error || t("failedToGenerateTemplate"));
      }
    } catch (error) {
      console.error("Error generating AI report:", error);
      setError(t("errorGeneratingTemplate"));
    } finally {
      setGenerating(false);
    }
  };

  const generateGroupReport = async () => {
    if (selectedPatients.length < 2) {
      toast.error("Please select at least 2 patients for group analysis");
      return;
    }

    setIsLoading(true);
    setResult(null);

    const loadingToast = toast.loading("Generating group analysis...");

    try {
      const patientIds = selectedPatients.map((p) => p.id || "");
      const reportData = await handleGenerateGroupAnalysis(
        patientIds,
        groupOptions
      );
      setResult(reportData);
      toast.success("Group analysis generated successfully");
    } catch (error) {
      console.error("Error generating group analysis:", error);
      toast.error("Failed to generate group analysis");
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  const generateTreatmentReport = async () => {
    if (!selectedPatient?.id) {
      toast.error("Please select a patient");
      return;
    }

    setIsLoading(true);
    setResult(null);

    const loadingToast = toast.loading(
      "Generating treatment recommendations..."
    );

    try {
      const reportData = await handleGenerateTreatmentRecommendations(
        selectedPatient.id,
        treatmentOptions
      );
      setResult(reportData);
      toast.success("Treatment recommendations generated successfully");
    } catch (error) {
      console.error("Error generating treatment recommendations:", error);
      toast.error("Failed to generate treatment recommendations");
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  const generateProgressReport = async () => {
    if (!selectedPatient?.id) {
      toast.error("Please select a patient");
      return;
    }

    setIsLoading(true);
    setResult(null);

    const loadingToast = toast.loading("Generating progress analysis...");

    try {
      const reportData = await handleGenerateProgressAnalysis(
        selectedPatient.id,
        progressOptions
      );
      setResult(reportData);
      toast.success("Progress analysis generated successfully");
    } catch (error) {
      console.error("Error generating progress analysis:", error);
      toast.error("Failed to generate progress analysis");
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  const renderPatientsList = () => (
    <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
      <div className="flex items-center gap-x-2 mb-4">
        <Input
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          size="sm"
          disabled={isSearching}
          variant="secondary"
        >
          {isSearching ? <Spinner size="sm" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {isPatientsLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : searchResults.length > 0 ? (
        searchResults.map((patient: IPatient, index: number) => (
          <div
            key={patient.id || `patient-${index}`}
            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
              activeTab === "group-analysis"
                ? selectedPatients.some((p) => p.id === patient.id)
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                : selectedPatient?.id === patient.id
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
            onClick={() =>
              activeTab === "group-analysis"
                ? togglePatientSelection(patient)
                : handlePatientSelect(patient)
            }
          >
            <div className="flex items-center">
              {activeTab === "group-analysis" && (
                <Checkbox
                  checked={selectedPatients.some((p) => p.id === patient.id)}
                  className="mx-2"
                  onCheckedChange={() => togglePatientSelection(patient)}
                />
              )}
              <div>
                <p className="font-medium">{getPatientName(patient)}</p>
                <p className="text-xs text-gray-500">
                  {patient.status && `Status: ${patient.status.label}`}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-gray-500">
          {searchTerm.trim().length > 1
            ? "No patients found"
            : "Search for patients to begin"}
        </div>
      )}
    </div>
  );

  const renderResultView = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Generating AI analysis...</p>
          <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
        </div>
      );
    }

    if (!result) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
          <Brain className="h-16 w-16 mb-4 opacity-30" />
          <p>Configure and generate a report to see AI analysis results</p>
        </div>
      );
    }

    // Transform the result data to string format for LoadingInsights
    const insightContent =
      result.aiAnalysis ||
      result.recommendations ||
      result.analysis ||
      result.report ||
      JSON.stringify(result, null, 2);

    return (
      <div className="p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">
            {activeTab === "patient-report" && "AI Patient Analysis"}
            {activeTab === "group-analysis" && "AI Group Analysis"}
            {activeTab === "treatment-recommendations" &&
              "AI Treatment Recommendations"}
          </h2>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // Save to localStorage for the detailed view
              localStorage.setItem(
                "currentReport",
                JSON.stringify({
                  type: activeTab,
                  data: result,
                  generatedAt: new Date().toISOString(),
                })
              );

              // Navigate to the detailed report page
              window.location.href = "/reports/view";
            }}
          >
            View Full Report
          </Button>
        </div>

        {result.patient && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="font-medium">{result.patient.name}</p>
          </div>
        )}

        {result.patientIds && (
          <div className="mb-4">
            <p className="font-medium">
              Group Analysis for {result.patientIds.length} patients
            </p>
          </div>
        )}

        <LoadingInsights
          isLoading={false}
          isGenerating={false}
          insights={insightContent}
          title="AI Analysis & Insights"
          loadingText="Analyzing data..."
          loadingSubtext="This may take a moment"
        />

        <div className="mt-4 text-sm text-gray-400">
          Generated on:{" "}
          {result.generatedAt
            ? new Date(result.generatedAt).toLocaleString()
            : new Date().toLocaleString()}
        </div>
      </div>
    );
  };

  // Helper function to get report type labels without relying on t() function directly
  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "patient":
        return "Patient Reports";
      case "visit":
        return "Visit Reports";
      case "status":
        return "Status Reports";
      case "custom":
        return "Custom Reports";
      case "event":
        return "Event Reports";
      default:
        return "Reports";
    }
  };

  // Render patient report tab
  const renderPatientReportTab = () => (
    <Card className="bg-white dark:bg-slate-900 shadow-sm border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {getReportTypeLabel("patient")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("patient")}</Label>
            {/* Display selected patient or prompt to select one */}
            {selectedPatient ? (
              <div className="p-3 border rounded-lg border-green-500 bg-green-50 dark:bg-green-900/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {getPatientName(selectedPatient)}
                    </p>
                    {selectedPatient.status && (
                      <p className="text-xs text-gray-500">
                        Status: {selectedPatient.status.label}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPatient(null)}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 border rounded-lg border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 text-sm">
                  Please select a patient from the list below
                </p>
              </div>
            )}

            {/* Patient list for selection */}
            {!selectedPatient && renderPatientsList()}

            <Button
              onClick={handleGeneratePatientReport}
              disabled={generating || !selectedPatient}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 mt-4"
            >
              {generating ? (
                <>
                  <Loader2 className="mx-2 h-4 w-4 animate-spin" />
                  {t("generating")}
                </>
              ) : (
                <>
                  <Sparkles className="mx-2 h-4 w-4" />
                  {t("createReport")}
                </>
              )}
            </Button>
          </div>

          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="rounded-lg border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-4"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mx-2" />
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            </motion.div>
          )}

          {/* Display AI analysis using LoadingInsights component */}
          {aiResponse && (
            <LoadingInsights
              isLoading={false}
              isGenerating={false}
              insights={aiResponse}
              title="AI Analysis & Insights"
              className="mt-4"
              loadingText="Analyzing data..."
              loadingSubtext="This may take a moment"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 flex items-center">
          <Sparkles className="h-5 w-5 mx-2 text-blue-500" />
          {t("aiAnalysis")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t("reportsDescription")}
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm p-1 rounded-lg">
          <TabsTrigger
            value="patient-report"
            className="px-3 py-1.5 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950"
          >
            {getReportTypeLabel("patient")}
          </TabsTrigger>
          <TabsTrigger
            value="group-analysis"
            className="px-3 py-1.5 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950"
          >
            {getReportTypeLabel("visit")}
          </TabsTrigger>
          <TabsTrigger
            value="treatment-recommendations"
            className="px-3 py-1.5 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950"
          >
            {getReportTypeLabel("status")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patient-report" className="space-y-4">
          {renderPatientReportTab()}
        </TabsContent>

        <TabsContent value="group-analysis" className="space-y-4">
          <Card className="bg-white dark:bg-slate-900 shadow-sm border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {getReportTypeLabel("visit")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Sparkles className="h-12 w-12 mx-auto mb-3 text-blue-300 dark:text-blue-700 animate-pulse" />
                <p className="text-sm">{t("preparingYourContent")}</p>
                <p className="text-xs mt-2 font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full inline-block">
                  {t("comingSoon")}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatment-recommendations" className="space-y-4">
          <Card className="bg-white dark:bg-slate-900 shadow-sm border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {getReportTypeLabel("status")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Sparkles className="h-12 w-12 mx-auto mb-3 text-blue-300 dark:text-blue-700 animate-pulse" />
                <p className="text-sm">{t("preparingYourContent")}</p>
                <p className="text-xs mt-2 font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full inline-block">
                  {t("comingSoon")}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

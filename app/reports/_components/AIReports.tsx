"use client";

import React, { useState, useEffect } from "react";
import { useReport } from "@/app/_hooks/useReport";
import { usePatient } from "@/app/_hooks/usePatient";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/app/_components/Spinner";
import {
  Brain,
  FileText,
  TrendingUp,
  Users,
  ClipboardList,
  Search,
} from "lucide-react";
import { IPatient } from "@/app/_types/Patient";
import { toast } from "react-hot-toast";
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

export default function AIReports() {
  const {
    generatePatientAIReport,
    generateGroupAnalysis,
    generateTreatmentRecommendations,
    generateProgressAnalysis,
  } = useReport();

  // Using patient hook with more options
  const {
    patients,
    isLoading: isPatientsLoading,
    performSearch,
    refetch: refetchPatients,
  } = usePatient({
    initialFetch: true,
    initialLimit: 10,
  });

  const [activeTab, setActiveTab] = useState("patient-analysis");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IPatient[]>([]);
  const [result, setResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

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

  // Initialize with patients from the hook
  useEffect(() => {
    if (patients && patients.length > 0) {
      setSearchResults(patients);
    }
  }, [patients]);

  const handleSearch = async () => {
    if (searchTerm.trim().length < 2) {
      // If search term is cleared, show all patients
      if (searchTerm.trim().length === 0) {
        setSearchResults(patients);
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

  const handlePatientSelect = (id: string) => {
    setSelectedPatientId(id);
    toast.success("Patient selected");
  };

  const togglePatientSelection = (id: string) => {
    if (selectedPatientIds.includes(id)) {
      setSelectedPatientIds(
        selectedPatientIds.filter((patientId) => patientId !== id)
      );
      toast.success("Patient removed from selection");
    } else {
      setSelectedPatientIds([...selectedPatientIds, id]);
      toast.success("Patient added to selection");
    }
  };

  const generateSinglePatientReport = async () => {
    if (!selectedPatientId) {
      toast.error("Please select a patient");
      return;
    }

    setIsLoading(true);
    setResult(null);

    const loadingToast = toast.loading("Generating AI analysis...");

    try {
      const reportData = await generatePatientAIReport(selectedPatientId);
      setResult(reportData);
      toast.success("AI analysis generated successfully");
    } catch (error) {
      console.error("Error generating patient AI report:", error);
      toast.error("Failed to generate AI analysis for this patient");
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  const generateGroupReport = async () => {
    if (selectedPatientIds.length < 2) {
      toast.error("Please select at least 2 patients for group analysis");
      return;
    }

    setIsLoading(true);
    setResult(null);

    const loadingToast = toast.loading("Generating group analysis...");

    try {
      const reportData = await generateGroupAnalysis(
        selectedPatientIds,
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
    if (!selectedPatientId) {
      toast.error("Please select a patient");
      return;
    }

    setIsLoading(true);
    setResult(null);

    const loadingToast = toast.loading(
      "Generating treatment recommendations..."
    );

    try {
      const reportData = await generateTreatmentRecommendations(
        selectedPatientId,
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
    if (!selectedPatientId) {
      toast.error("Please select a patient");
      return;
    }

    setIsLoading(true);
    setResult(null);

    const loadingToast = toast.loading("Generating progress analysis...");

    try {
      const reportData = await generateProgressAnalysis(
        selectedPatientId,
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
      <div className="flex items-center space-x-2 mb-4">
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
                ? selectedPatientIds.includes(patient.id || "")
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                : selectedPatientId === patient.id
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
            onClick={() =>
              activeTab === "group-analysis"
                ? togglePatientSelection(patient.id || "")
                : handlePatientSelect(patient.id || "")
            }
          >
            <div className="flex items-center">
              {activeTab === "group-analysis" && (
                <Checkbox
                  checked={selectedPatientIds.includes(patient.id || "")}
                  className="mr-2"
                  onCheckedChange={() =>
                    togglePatientSelection(patient.id || "")
                  }
                />
              )}
              <div>
                <p className="font-medium">
                  {patient.sectionData?.personalinfo?.full_name ||
                    `Patient ${patient.id?.substring(0, 6)}`}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {patient.id}
                  {patient.status && ` • Status: ${patient.status.label}`}
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

    return (
      <div className="p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">
            {activeTab === "patient-analysis" && "AI Patient Analysis"}
            {activeTab === "group-analysis" && "AI Group Analysis"}
            {activeTab === "treatment-recommendations" &&
              "AI Treatment Recommendations"}
            {activeTab === "progress-analysis" && "AI Progress Analysis"}
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
            <p className="text-sm text-gray-500">ID: {result.patient.id}</p>
          </div>
        )}

        {result.patientIds && (
          <div className="mb-4">
            <p className="font-medium">
              Group Analysis for {result.patientIds.length} patients
            </p>
          </div>
        )}

        <div className="mt-4 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-lg max-h-[400px] overflow-y-auto">
          {result.aiAnalysis ||
            result.recommendations ||
            result.analysis ||
            result.report ||
            JSON.stringify(result, null, 2)}
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Generated on:{" "}
          {result.generatedAt
            ? new Date(result.generatedAt).toLocaleString()
            : new Date().toLocaleString()}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>AI Analysis Tools</CardTitle>
            <CardDescription>
              Use AI to generate insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full">
                <TabsTrigger value="patient-analysis" className="flex-1">
                  <Brain className="h-4 w-4 mr-2" />
                  Patient
                </TabsTrigger>
                <TabsTrigger value="group-analysis" className="flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  Group
                </TabsTrigger>
                <TabsTrigger
                  value="treatment-recommendations"
                  className="hidden sm:flex flex-1"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Treatment
                </TabsTrigger>
                <TabsTrigger
                  value="progress-analysis"
                  className="hidden sm:flex flex-1"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Progress
                </TabsTrigger>
              </TabsList>

              <div className="p-4">
                <TabsContent value="patient-analysis">
                  <h3 className="font-medium mb-2">Patient AI Analysis</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Generate a comprehensive AI analysis for a single patient
                  </p>
                  {renderPatientsList()}
                </TabsContent>

                <TabsContent value="group-analysis">
                  <h3 className="font-medium mb-2">Group Analysis</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Compare multiple patients with AI analysis
                  </p>

                  <div className="space-y-3 mt-4 mb-4">
                    <div>
                      <Label htmlFor="focus">Analysis Focus (Optional)</Label>
                      <Input
                        id="focus"
                        placeholder="e.g., Treatment effectiveness"
                        value={groupOptions.focus}
                        onChange={(e) =>
                          setGroupOptions({
                            ...groupOptions,
                            focus: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeframe">Time Period</Label>
                      <Select
                        value={groupOptions.timeframe}
                        onValueChange={(value) =>
                          setGroupOptions({ ...groupOptions, timeframe: value })
                        }
                      >
                        <SelectTrigger id="timeframe">
                          <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="1month">Last Month</SelectItem>
                          <SelectItem value="3months">Last 3 Months</SelectItem>
                          <SelectItem value="6months">Last 6 Months</SelectItem>
                          <SelectItem value="1year">Last Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeVisits"
                        checked={groupOptions.includeVisits}
                        onCheckedChange={(checked) =>
                          setGroupOptions({
                            ...groupOptions,
                            includeVisits: checked === true,
                          })
                        }
                      />
                      <Label htmlFor="includeVisits">
                        Include visit history in analysis
                      </Label>
                    </div>
                  </div>

                  <p className="text-sm font-medium mb-2">
                    Select patients to compare:
                  </p>
                  {renderPatientsList()}
                </TabsContent>

                <TabsContent value="treatment-recommendations">
                  <h3 className="font-medium mb-2">
                    Treatment Recommendations
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Get AI-powered treatment suggestions for a patient
                  </p>

                  <div className="space-y-3 mt-4 mb-4">
                    <div>
                      <Label htmlFor="specificCondition">
                        Specific Condition (Optional)
                      </Label>
                      <Input
                        id="specificCondition"
                        placeholder="e.g., Hypertension"
                        value={treatmentOptions.specificCondition}
                        onChange={(e) =>
                          setTreatmentOptions({
                            ...treatmentOptions,
                            specificCondition: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="considerHistoricalTreatments"
                        checked={treatmentOptions.considerHistoricalTreatments}
                        onCheckedChange={(checked) =>
                          setTreatmentOptions({
                            ...treatmentOptions,
                            considerHistoricalTreatments: checked === true,
                          })
                        }
                      />
                      <Label htmlFor="considerHistoricalTreatments">
                        Consider historical treatments
                      </Label>
                    </div>
                  </div>

                  <p className="text-sm font-medium mb-2">Select a patient:</p>
                  {renderPatientsList()}
                </TabsContent>

                <TabsContent value="progress-analysis">
                  <h3 className="font-medium mb-2">Progress Analysis</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Analyze patient's improvement over time
                  </p>

                  <div className="space-y-3 mt-4 mb-4">
                    <div>
                      <Label htmlFor="focusArea">Focus Area (Optional)</Label>
                      <Input
                        id="focusArea"
                        placeholder="e.g., Medication adherence"
                        value={progressOptions.focusArea}
                        onChange={(e) =>
                          setProgressOptions({
                            ...progressOptions,
                            focusArea: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="progressTimeframe">Time Period</Label>
                      <Select
                        value={progressOptions.timeframe}
                        onValueChange={(value) =>
                          setProgressOptions({
                            ...progressOptions,
                            timeframe: value,
                          })
                        }
                      >
                        <SelectTrigger id="progressTimeframe">
                          <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1month">Last Month</SelectItem>
                          <SelectItem value="3months">Last 3 Months</SelectItem>
                          <SelectItem value="6months">Last 6 Months</SelectItem>
                          <SelectItem value="1year">Last Year</SelectItem>
                          <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <p className="text-sm font-medium mb-2">Select a patient:</p>
                  {renderPatientsList()}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={
                isLoading ||
                (activeTab === "patient-analysis" && !selectedPatientId) ||
                (activeTab === "group-analysis" &&
                  selectedPatientIds.length < 2) ||
                (activeTab === "treatment-recommendations" &&
                  !selectedPatientId) ||
                (activeTab === "progress-analysis" && !selectedPatientId)
              }
              onClick={() => {
                if (activeTab === "patient-analysis")
                  generateSinglePatientReport();
                if (activeTab === "group-analysis") generateGroupReport();
                if (activeTab === "treatment-recommendations")
                  generateTreatmentReport();
                if (activeTab === "progress-analysis") generateProgressReport();
              }}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate{" "}
                  {activeTab
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
            <CardDescription>
              View the AI-generated insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>{renderResultView()}</CardContent>
        </Card>
      </div>
    </div>
  );
}

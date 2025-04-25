"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  FileTextIcon,
  ListIcon,
  Sparkles,
  TrendingUpIcon,
  UserPlusIcon,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAI } from "../_hooks/useAI";
import { usePatient } from "../_hooks/usePatient";
import LoadingInsights from "./ai/LoadingInsights";

// Define stats interfaces
interface AgeGroup {
  _id: string;
  count: number;
}

interface GenderDistribution {
  _id: string;
  count: number;
}

interface StatusStat {
  _id: string;
  count: number;
  label: string;
  color: string;
}

interface TemplateStats {
  templateId: string;
  templateName: string;
  count: number;
}

interface MonthlyTrend {
  year: number;
  month: number;
  date: string;
  count: number;
}

interface Stats {
  patientCounts: {
    total: number;
    active: number;
    inactive: number;
    recentlyAdded: number;
  };
  demographicStats: {
    ageGroups: AgeGroup[];
    genderDistribution: GenderDistribution[];
  };
  statusStats: StatusStat[];
  visitsCount: number;
  templateStats: TemplateStats[];
  trends: {
    monthly: MonthlyTrend[];
  };
}

export default function PatientDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { getDemographicsSummary, isLoadingDemographics } = useAI();
  const [demographicsSummary, setDemographicsSummary] = useState<string | null>(
    null
  );
  // Initialize the patient hook and fetch stats
  const { stats, isStatsLoading, refetchStats } = usePatient({
    initialFetch: false,
  });

  useEffect(() => {
    // Fetch stats data when component mounts
    refetchStats();
  }, [refetchStats]);

  useEffect(() => {
    if (stats && !isStatsLoading) {
      setIsLoading(false);
    }
  }, [stats, isStatsLoading]);

  const handleAddPatient = () => {
    router.push("/patients/add-patient");
  };

  const handleViewPatients = () => {
    router.push("/patients");
  };

  const handleViewAnalytics = () => {
    router.push("/analytics");
  };

  const handleGenerateDemographicsSummary = async () => {
    try {
      const result = await getDemographicsSummary();
      if (result.success) {
        console.log(result);
        setDemographicsSummary(result.data.summary);
        toast.success("Demographics summary generated successfully");
      } else {
        // Handle error
        toast.error(result.message);
        console.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to generate insights");
      console.error(error);
    }
  };
  return (
    <div className="flex items-center justify-center p-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-6xl"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
            Patient Dashboard
          </h1>
          <p className="text-green-600 dark:text-green-400">
            Patient Management and Medical Records
          </p>
          <Button
            variant="outline"
            className="flex items-center gap-2 mt-4"
            onClick={handleGenerateDemographicsSummary}
            disabled={isLoadingDemographics}
          >
            <Sparkles className="h-4 w-4" />
            {isLoadingDemographics
              ? "Processing..."
              : "AI Demographics Summary"}
          </Button>
          <LoadingInsights
            isLoading={isLoadingDemographics}
            isGenerating={false}
            insights={demographicsSummary}
            title="Demographics Summary"
            loadingText="Generating demographics summary..."
            loadingSubtext="This may take a moment"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-800 dark:text-green-300">
                  {isLoading
                    ? "-"
                    : stats?.patientCounts?.total?.toLocaleString() || 0}
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-800 dark:text-green-300">
                  {isLoading ? "-" : stats?.visitsCount?.toLocaleString() || 0}
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                  <TrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                New Patients (Recent)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-800 dark:text-green-300">
                  {isLoading ? "-" : stats?.patientCounts?.recentlyAdded || 0}
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                  <UserPlusIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Actions */}
          <div className="space-y-4">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all duration-200"
                  onClick={handleAddPatient}
                >
                  <UserPlusIcon className="mr-2 h-5 w-5" />
                  <span>Add New Patient</span>
                </Button>
                <Button
                  className="w-full justify-start bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-all duration-200"
                  variant="outline"
                  onClick={handleViewPatients}
                >
                  <ListIcon className="mr-2 h-5 w-5" />
                  <span>View Patient List</span>
                </Button>
                <Button
                  className="w-full justify-start bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-all duration-200"
                  variant="outline"
                  onClick={handleViewAnalytics}
                >
                  <TrendingUpIcon className="mr-2 h-5 w-5" />
                  <span>View Analytics</span>
                </Button>
                <Button
                  className="w-full justify-start bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-all duration-200"
                  variant="outline"
                >
                  <FileTextIcon className="mr-2 h-5 w-5" />
                  <span>Medical Forms</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                  Gender Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isStatsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats?.demographicStats?.genderDistribution?.map(
                      (item: GenderDistribution) => (
                        <div key={item._id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium dark:text-gray-200">
                              {item._id}
                            </span>
                            <span className="text-sm font-medium dark:text-gray-300">
                              {item.count.toLocaleString()} patients
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                              className={`${
                                item._id === "Male"
                                  ? "bg-blue-500"
                                  : "bg-pink-500"
                              } h-2.5 rounded-full`}
                              style={{
                                width: `${
                                  (item.count /
                                    (stats?.patientCounts?.total || 1)) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )
                    ) || (
                      <div className="text-sm text-gray-500">
                        No gender data available
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="link"
                  className="w-full text-green-600 dark:text-green-400"
                >
                  View Full Analysis
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Middle Column - Patient Demographics */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                Age Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats?.demographicStats?.ageGroups?.map((item: AgeGroup) => (
                    <div key={item._id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium dark:text-gray-200">
                          {item._id}
                        </span>
                        <span className="text-sm font-medium dark:text-gray-300">
                          {item.count.toLocaleString()} patients
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={getAgeGroupColor(item._id)}
                          style={{
                            width: `${
                              (item.count /
                                (stats?.patientCounts?.total || 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-sm text-gray-500">
                      No age data available
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                className="w-full text-green-600 dark:text-green-400"
              >
                View Full Analysis
              </Button>
            </CardFooter>
          </Card>

          {/* Right Column - Patient Status */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                Patient Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats?.statusStats?.map((item: StatusStat) => {
                    const percentage = Math.round(
                      (item.count / (stats?.patientCounts?.total || 1)) * 100
                    );

                    return (
                      <div key={item._id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium dark:text-gray-200">
                            {item.label}
                          </span>
                          <span className="text-sm font-medium dark:text-gray-300">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  }) || (
                    <div className="text-sm text-gray-500">
                      No status data available
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                className="w-full text-green-600 dark:text-green-400"
              >
                View All Statuses
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Monthly Trends */}
        <div className="mt-6">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                Monthly Patient Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats?.trends?.monthly?.map((item: MonthlyTrend) => {
                    const monthName = new Date(
                      item.date + "-01"
                    ).toLocaleString("default", { month: "long" });

                    return (
                      <div key={item.date} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium dark:text-gray-200">
                            {monthName} {item.year}
                          </span>
                          <span className="text-sm font-medium dark:text-gray-300">
                            {item.count.toLocaleString()} patients
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-green-500 h-2.5 rounded-full"
                            style={{
                              width: `${
                                (item.count /
                                  (Math.max(
                                    ...stats.trends.monthly.map(
                                      (m: MonthlyTrend) => m.count
                                    )
                                  ) || 1)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  }) || (
                    <div className="text-sm text-gray-500">
                      No trend data available
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Template Usage */}
        <div className="mt-6">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                Template Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats?.templateStats?.map((item: TemplateStats) => {
                    const percentage = Math.round(
                      (item.count / (stats?.patientCounts?.total || 1)) * 100
                    );

                    return (
                      <div key={item.templateId} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium dark:text-gray-200">
                            {item.templateName}
                          </span>
                          <span className="text-sm font-medium dark:text-gray-300">
                            {item.count.toLocaleString()} uses ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-indigo-500 h-2.5 rounded-full"
                            style={{
                              width: `${percentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  }) || (
                    <div className="text-sm text-gray-500">
                      No template data available
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

// Helper function to get a color for age group
function getAgeGroupColor(range: string): string {
  switch (range) {
    case "0-17":
      return "bg-blue-500";
    case "18-29":
      return "bg-green-500";
    case "30-44":
      return "bg-purple-500";
    case "45-59":
      return "bg-yellow-500";
    case "60-74":
      return "bg-pink-500";
    case "75+":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

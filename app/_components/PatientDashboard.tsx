"use client";

import LoadingInsights from "@/app/_components/LoadingInsights";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useAI } from "@/app/_hooks/AI/useAI";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const { t, dir } = useLanguage();
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

  const handleViewReports = () => {
    router.push("/reports");
  };
  const handleAddTemplate = () => {
    router.push("/templates");
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
    <div className="flex items-center justify-center p-4 py-6" dir={dir}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-6xl space-y-8"
      >
        {/* Header Section */}
        <div className="mb-8 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent"
          >
            {t("patientDashboard")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-green-600 dark:text-green-400 text-lg"
          >
            {t("patientManagement")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              variant="outline"
              className="flex items-center gap-2 mt-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 border-green-200 dark:border-green-800"
              onClick={handleGenerateDemographicsSummary}
              disabled={isLoadingDemographics}
            >
              <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
              {isLoadingDemographics
                ? t("processing")
                : t("aiDemographicsSummary")}
            </Button>
          </motion.div>
          <LoadingInsights
            isLoading={isLoadingDemographics}
            isGenerating={false}
            insights={demographicsSummary}
            title={t("demographicsSummary")}
            loadingText={t("generatingSummary")}
            loadingSubtext={t("thisMayTakeAMoment")}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2 ">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 ">
                  {t("totalPatients")}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between ">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                    {isLoading
                      ? "-"
                      : stats?.patientCounts?.total?.toLocaleString() || 0}
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("totalVisits")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                    {isLoading
                      ? "-"
                      : stats?.visitsCount?.toLocaleString() || 0}
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                    <TrendingUpIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("newPatientsRecent")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                    {isLoading ? "-" : stats?.patientCounts?.recentlyAdded || 0}
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                    <UserPlusIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Actions */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                    {t("quickActions")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <Button
                    className="w-full justify-start bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-700 dark:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={handleAddPatient}
                  >
                    <UserPlusIcon className="mx-2 h-5 w-5" />
                    <span>{t("addNewPatient")}</span>
                  </Button>
                  <Button
                    className="w-full justify-start bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-green-800 dark:text-green-300 transition-all duration-300 border-green-200 dark:border-green-800 shadow-sm hover:shadow-md"
                    variant="outline"
                    onClick={handleViewPatients}
                  >
                    <ListIcon className="mx-2 h-5 w-5" />
                    <span>{t("viewPatientList")}</span>
                  </Button>
                  <Button
                    className="w-full justify-start bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-green-800 dark:text-green-300 transition-all duration-300 border-green-200 dark:border-green-800 shadow-sm hover:shadow-md"
                    variant="outline"
                    onClick={handleViewReports}
                  >
                    <TrendingUpIcon className="mx-2 h-5 w-5" />
                    <span>{t("viewReports")}</span>
                  </Button>
                  <Button
                    className="w-full justify-start bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-green-800 dark:text-green-300 transition-all duration-300 border-green-200 dark:border-green-800 shadow-sm hover:shadow-md"
                    variant="outline"
                    onClick={handleAddTemplate}
                  >
                    <FileTextIcon className="mx-2 h-5 w-5" />
                    <span>{t("addTemplate")}</span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                    {t("genderDistribution")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
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
                                {item.count.toLocaleString()} {t("patients")}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`${
                                  item._id === "Male"
                                    ? "bg-blue-500"
                                    : "bg-pink-500"
                                } h-2.5 rounded-full transition-all duration-500`}
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
                          {t("noDataAvailable")}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Middle Column - Age Groups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                  {t("ageGroups")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats?.demographicStats?.ageGroups?.map(
                      (item: AgeGroup) => (
                        <div key={item._id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium dark:text-gray-200">
                              {item._id}
                            </span>
                            <span className="text-sm font-medium dark:text-gray-300">
                              {item.count.toLocaleString()} {t("patients")}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`${getAgeGroupColor(
                                item._id
                              )} h-2.5 rounded-full transition-all duration-500`}
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
                        {t("noDataAvailable")}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Patient Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                  {t("patientStatus")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
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
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="h-2.5 rounded-full transition-all duration-500"
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
                        {t("noDataAvailable")}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                {t("monthlyPatientTrends")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
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
                            {item.count.toLocaleString()} {t("patients")}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500"
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
                      {t("noDataAvailable")}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Template Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                {t("templateUsage")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
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
                            {item.count.toLocaleString()} {t("uses")} (
                            {percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  }) || (
                    <div className="text-sm text-gray-500">
                      {t("noDataAvailable")}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
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

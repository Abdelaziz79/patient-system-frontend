"use client";

import Loading from "@/app/_components/Loading";
import { IReport } from "@/app/_hooks/report/reportApi";
import { ReportFilterParams, useReport } from "@/app/_hooks/report/useReport";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  FileBarChart,
  FileSearch,
  FileStackIcon,
  Filter,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "../_contexts/LanguageContext";
import { usePatient } from "../_hooks/patient/usePatient";
import ReportCard from "./_components/ReportCard";

export default function Reports() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("all");
  const { t, dir } = useLanguage();
  const { reports, isReportsLoading, useFilteredReports } = useReport({
    initialFetch: true,
  });
  const { stats, isStatsLoading, refetchStats } = usePatient({
    initialFetch: false,
  });

  useEffect(() => {
    // Fetch stats data when component mounts
    refetchStats();
  }, [refetchStats]);
  // Use the filtered reports hook for the current active tab and search
  const getFilterParams = (): ReportFilterParams => {
    const params: ReportFilterParams = {};

    if (
      activeTab === "patient" ||
      activeTab === "visit" ||
      activeTab === "status" ||
      activeTab === "generated"
    ) {
      params.type = activeTab as any;
    }

    return params;
  };

  const { data: filteredReports = [], isPending: isFilteredLoading } =
    useFilteredReports(getFilterParams());

  // For the "generated" tab, we need to filter manually
  const displayedReports =
    activeTab === "generated" && filteredReports
      ? filteredReports.filter((report: IReport) => report.lastGeneratedAt)
      : filteredReports;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isStatsLoading || isReportsLoading) {
    return <Loading />;
  }

  // Count statistics
  const totalReports = reports?.length || 0;
  const generatedReports =
    reports?.filter((r: IReport) => r.lastGeneratedAt)?.length || 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return stats?.patientCounts.total ? (
    <div
      className="flex items-center justify-center p-3 sm:p-4 md:p-6"
      dir={dir}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-6xl"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              {t("reports")}
            </h1>
            <p className="text-blue-600 dark:text-blue-400 text-sm sm:text-base">
              {t("reportsDescription")}
            </p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6"
        >
          {/* Total Reports Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-blue-100 dark:border-blue-900 rounded-lg shadow p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:bg-white/90 dark:hover:bg-slate-800/90">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("allReports")}
                </p>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalReports}
                </h3>
              </div>
              <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FileStackIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Generated Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-green-100 dark:border-green-900 rounded-lg shadow p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:bg-white/90 dark:hover:bg-slate-800/90">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("generated")}
                </p>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {generatedReports}
                </h3>
              </div>
              <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <FileSearch className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs for report categories */}
        <motion.div variants={itemVariants}>
          {/* Mobile tabs using dropdown */}
          <div className="block md:hidden mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mx-2" />
                    <span>
                      {activeTab === "all" && t("allReports")}
                      {activeTab === "patient" && t("patientReports")}
                      {activeTab === "visit" && t("visitReports")}
                      {activeTab === "status" && t("statusReports")}
                      {activeTab === "generated" && t("generated")}
                    </span>
                  </div>
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem onClick={() => handleTabChange("all")}>
                  {t("allReports")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTabChange("patient")}>
                  {t("patientReports")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTabChange("visit")}>
                  {t("visitReports")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTabChange("status")}>
                  {t("statusReports")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTabChange("generated")}>
                  {t("generated")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop tabs */}
          <div className="hidden md:block">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full mb-6"
            >
              <TabsList className="grid grid-cols-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow rounded-xl">
                <TabsTrigger value="all">{t("all")}</TabsTrigger>
                <TabsTrigger value="patient">{t("patient")}</TabsTrigger>
                <TabsTrigger value="visit">{t("visits")}</TabsTrigger>
                <TabsTrigger value="status">{t("status")}</TabsTrigger>
                <TabsTrigger value="generated">{t("generated")}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mt-4">
            {isFilteredLoading ? (
              <div className="flex justify-center py-6 sm:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {displayedReports?.length > 0 ? (
                  displayedReports.map((report: IReport) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <ReportCard report={report} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-6 sm:py-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-800 shadow">
                    <FileBarChart className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                    <h3 className="mt-2 text-base sm:text-lg font-medium">
                      {t("noReportsFound")}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                      {activeTab !== "all"
                        ? `${t("noReportsFound")} `
                        : t("noReportsYet")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  ) : (
    <div
      className="flex items-center justify-center p-3 sm:p-4 md:p-6"
      dir={dir}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-blue-100 dark:border-blue-900 rounded-lg shadow-lg p-6 text-center"
        >
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <FileBarChart className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent mb-2">
            {t("noReportsFound")}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t("noReportsYet")}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t("createPatientsFirst")}
          </p>
          <Button
            onClick={() => router.push("/patients")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-full py-2"
          >
            {t("patients")}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

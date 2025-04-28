"use client";

import React, { useState } from "react";
import { useReport } from "../_hooks/useReport";
import { Spinner } from "../_components/Spinner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TabsNav from "../_components/TabsNav";
import ReportList from "./_components/ReportList";
import ReportBuilder from "./_components/ReportBuilder";
import ReportViewer from "./_components/ReportViewer";
import AIReports from "./_components/AIReports";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<string>("my-reports");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [showBuilder, setShowBuilder] = useState<boolean>(false);

  const {
    reports,
    isReportsLoading,
    reportsError,
    refetchReports,
    generateReport,
  } = useReport({ initialFetch: true });

  const handleViewReport = async (id: string) => {
    try {
      const result = await generateReport(id);
      setReportData(result);
      setSelectedReportId(id);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const tabs = [
    { value: "my-reports", label: "My Reports" },
    { value: "create-report", label: "Create Report" },
    { value: "ai-reports", label: "AI Analysis" },
  ];

  if (isReportsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (reportsError) {
    return (
      <div className="text-red-500 p-4">
        Error loading reports:{" "}
        {reportsError instanceof Error ? reportsError.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsNav tabs={tabs} />

        <div className="mt-6">
          <TabsContent value="my-reports">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <ReportList
                  reports={reports || []}
                  onViewReport={handleViewReport}
                  selectedReportId={selectedReportId}
                  onCreateNew={() => setActiveTab("create-report")}
                  onRefresh={refetchReports}
                />
              </div>
              <div className="md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                {reportData ? (
                  <ReportViewer reportData={reportData} />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    Select a report to view
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create-report">
            <ReportBuilder
              onReportCreated={() => {
                refetchReports();
                setActiveTab("my-reports");
              }}
            />
          </TabsContent>

          <TabsContent value="ai-reports">
            <AIReports />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

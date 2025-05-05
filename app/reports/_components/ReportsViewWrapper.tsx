"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReport } from "@/app/_hooks/report/useReport";
import { usePatient } from "@/app/_hooks/patient/usePatient";

// Dynamically import the ReportsView component
const ReportsView = dynamic(() => import("./ReportsView"), {
  loading: () => (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500">Loading reports module...</p>
      </div>
    </div>
  ),
  ssr: false,
});

export default function ReportsViewWrapper() {
  const [isClient, setIsClient] = useState(false);

  // Destructure the properties we need from useReport hook
  const {
    reports,
    hasAccess,
    isReportsLoading,
    reportsError,
    refetchReports,
    generateReport,
    generateCustomReport,
    createReport,
    updateReport,
    deleteReport,
    reportFields,
    refetchFields,
    isFieldsLoading,
    generatePatientAIReport,
    generateGroupAnalysis,
    generateTreatmentRecommendations,
    generateProgressAnalysis,
  } = useReport({ initialFetch: true });

  // Destructure properties from usePatient hook to get patient data
  const {
    patients,
    isLoading: isPatientsLoading,
    total: totalPatients,
    getPatient,
    performSearch: searchPatients,
    refetch: refetchPatients,
  } = usePatient({
    initialFetch: true,
    initialLimit: 100, // Fetch a larger initial set for reports
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-500">Loading reports module...</p>
        </div>
      </div>
    );
  }

  // Pass all the destructured properties to ReportsView
  return (
    <ReportsView
      // Report properties
      reports={reports}
      hasAccess={hasAccess}
      isReportsLoading={isReportsLoading}
      reportsError={reportsError}
      refetchReports={refetchReports}
      generateReport={generateReport}
      generateCustomReport={generateCustomReport}
      createReport={createReport}
      updateReport={updateReport}
      deleteReport={deleteReport}
      reportFields={reportFields}
      refetchFields={refetchFields}
      isFieldsLoading={isFieldsLoading}
      generatePatientAIReport={generatePatientAIReport}
      generateGroupAnalysis={generateGroupAnalysis}
      generateTreatmentRecommendations={generateTreatmentRecommendations}
      generateProgressAnalysis={generateProgressAnalysis}
      // Patient properties
      patients={patients}
      isPatientsLoading={isPatientsLoading}
      totalPatients={totalPatients}
      getPatient={getPatient}
      searchPatients={searchPatients}
      refetchPatients={refetchPatients}
    />
  );
}

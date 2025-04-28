"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Printer, Download, Share2 } from "lucide-react";
import { Spinner } from "@/app/_components/Spinner";
import { toast } from "react-hot-toast";

export default function ReportViewerPage() {
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get report data from localStorage
    const reportData = localStorage.getItem("currentReport");

    if (reportData) {
      try {
        const parsedReport = JSON.parse(reportData);
        setReport(parsedReport);
      } catch (error) {
        console.error("Error parsing report data:", error);
        toast.error("Failed to load report data");
      }
    } else {
      toast.error("No report data found");
    }

    setLoading(false);
  }, []);

  // Function to handle printing the report
  const handlePrint = () => {
    window.print();
  };

  // Function to download the report as a text file
  const handleDownload = () => {
    if (!report) return;

    const reportContent = getReportContent();
    const reportTitle = getReportTitle();
    const element = document.createElement("a");
    const file = new Blob([reportContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${reportTitle.replace(/\s+/g, "_").toLowerCase()}_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("Report downloaded successfully");
  };

  // Function to share the report (copy to clipboard)
  const handleShare = () => {
    if (!report) return;

    const reportContent = getReportContent();
    navigator.clipboard
      .writeText(reportContent)
      .then(() => {
        toast.success("Report copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        toast.error("Failed to copy report to clipboard");
      });
  };

  // Helper function to get report content
  const getReportContent = () => {
    if (!report || !report.data) return "";

    const reportData = report.data;
    const reportTitle = getReportTitle();
    const generatedAt = new Date(report.generatedAt).toLocaleString();

    let content = `${reportTitle}\n`;
    content += `Generated: ${generatedAt}\n\n`;

    if (reportData.patient) {
      content += `Patient: ${reportData.patient.name}\n`;
      content += `Patient ID: ${reportData.patient.id}\n\n`;
    }

    if (reportData.patientIds) {
      content += `Group Analysis for ${reportData.patientIds.length} patients\n\n`;
    }

    content +=
      reportData.aiAnalysis ||
      reportData.recommendations ||
      reportData.analysis ||
      reportData.report ||
      JSON.stringify(reportData, null, 2);

    return content;
  };

  // Helper function to get report title
  const getReportTitle = () => {
    if (!report) return "AI Report";

    switch (report.type) {
      case "patient-analysis":
        return "AI Patient Analysis";
      case "group-analysis":
        return "AI Group Analysis";
      case "treatment-recommendations":
        return "AI Treatment Recommendations";
      case "progress-analysis":
        return "AI Progress Analysis";
      default:
        return "AI Report";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500">Loading report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            No Report Found
          </h2>
          <p className="text-gray-500 max-w-md">
            There is no report data to display. Please generate a report first.
          </p>
          <Button onClick={() => router.push("/reports")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Return to Reports
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto py-6 max-w-4xl print:py-2"
      id="report-container"
    >
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Button variant="outline" onClick={() => router.push("/reports")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardHeader className="print:pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{getReportTitle()}</CardTitle>
              <CardDescription>
                Generated on {new Date(report.generatedAt).toLocaleString()}
              </CardDescription>
            </div>
            <div className="print:hidden">
              {report.data.patient && (
                <div className="text-right">
                  <div className="font-medium">{report.data.patient.name}</div>
                  <div className="text-sm text-gray-500">
                    ID: {report.data.patient.id}
                  </div>
                </div>
              )}
              {report.data.patientIds && (
                <div className="text-right">
                  <div className="font-medium">Group Analysis</div>
                  <div className="text-sm text-gray-500">
                    {report.data.patientIds.length} patients
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator className="print:hidden" />

        <CardContent className="pt-6 print:pt-2">
          {report.data.patient && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg print:bg-transparent print:p-0 print:mb-2">
              <h3 className="font-semibold mb-1">Patient Information</h3>
              <p className="font-medium">{report.data.patient.name}</p>
              <p className="text-sm text-gray-500">
                ID: {report.data.patient.id}
              </p>
              {report.data.patient.status && (
                <p className="text-sm text-gray-500">
                  Status: {report.data.patient.status}
                </p>
              )}
            </div>
          )}

          {report.data.patientIds && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg print:bg-transparent print:p-0 print:mb-2">
              <h3 className="font-semibold mb-1">Group Analysis</h3>
              <p>Analysis for {report.data.patientIds.length} patients</p>
              <p className="text-sm text-gray-500">
                Patient IDs: {report.data.patientIds.join(", ")}
              </p>
            </div>
          )}

          <div className="mt-6 print:mt-2">
            <h3 className="font-semibold mb-4 print:mb-2">Analysis Results</h3>
            <div className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-6 rounded-lg print:bg-transparent print:p-0">
              {report.data.aiAnalysis ||
                report.data.recommendations ||
                report.data.analysis ||
                report.data.report ||
                JSON.stringify(report.data, null, 2)}
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4 text-sm text-gray-500 print:hidden">
          This AI-generated report is intended for informational purposes only
          and should be reviewed by a healthcare professional.
        </CardFooter>
      </Card>

      <div className="mt-8 text-center text-xs text-gray-400 print:hidden">
        <p>Patient Management System &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}

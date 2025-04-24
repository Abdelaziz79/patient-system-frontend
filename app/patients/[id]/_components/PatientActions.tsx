import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Download,
  Edit,
  File,
  FileSpreadsheet,
  FileText,
  Printer,
  Share2,
} from "lucide-react";
import { PatientActionsProps } from "./types";

export function PatientActions({
  patient,
  isExportingToPdf,
  isExportingToCsv,
  isGeneratingReport,
  handleExportToPdf,
  handleExportToCsv,
  handleGoBack,
  handleEditPatient,
  handlePrintPatient,
  setIsShareDialogOpen,
  setIsReportDialogOpen,
}: PatientActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-300">
          Patient Details
        </h1>
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleExportToPdf}
              disabled={isExportingToPdf}
            >
              <File className="h-4 w-4 mr-2" />
              {isExportingToPdf ? "Exporting..." : "Export to PDF"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleExportToCsv}
              disabled={isExportingToCsv}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              {isExportingToCsv ? "Exporting..." : "Export to CSV"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setIsReportDialogOpen(true)}
              disabled={isGeneratingReport}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isGeneratingReport ? "Generating..." : "Generate Medical Report"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handlePrintPatient}
        >
          <Printer className="h-4 w-4" /> Print
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsShareDialogOpen(true)}
        >
          <Share2 className="h-4 w-4" /> Share
        </Button>

        <Button
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
          onClick={handleEditPatient}
        >
          <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
      </div>
    </div>
  );
}

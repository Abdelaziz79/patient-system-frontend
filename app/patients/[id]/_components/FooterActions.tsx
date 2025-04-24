import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  CalendarDays,
  Edit,
  File,
  Mail,
  Printer,
} from "lucide-react";
import { FooterActionsProps } from "./types";

export function FooterActions({
  handleGoBack,
  handlePrintPatient,
  handleExportToPdf,
  isExportingToPdf,
  handleEditPatient,
  setIsShareDialogOpen,
  setIsVisitDialogOpen,
}: FooterActionsProps) {
  return (
    <Card className="mt-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-green-100 dark:border-green-900 shadow-xl">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3 justify-end">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Patients
          </Button>
          <Button variant="outline" onClick={handlePrintPatient}>
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          <Button
            variant="outline"
            onClick={handleExportToPdf}
            disabled={isExportingToPdf}
          >
            <File className="h-4 w-4 mr-2" />{" "}
            {isExportingToPdf ? "Exporting..." : "Export PDF"}
          </Button>
          <Button variant="outline" onClick={() => setIsShareDialogOpen(true)}>
            <Mail className="h-4 w-4 mr-2" /> Share via Email
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
            onClick={handleEditPatient}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Patient
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
            onClick={() => setIsVisitDialogOpen(true)}
          >
            <CalendarDays className="h-4 w-4 mr-2" /> Schedule Visit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

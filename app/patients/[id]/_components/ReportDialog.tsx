import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReportDialogProps } from "./types";

export function ReportDialog({
  isReportDialogOpen,
  setIsReportDialogOpen,
  reportOptions,
  setReportOptions,
  handleGenerateReport,
  isGeneratingReport,
}: ReportDialogProps) {
  return (
    <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Medical Report</DialogTitle>
          <DialogDescription>
            Customize the medical report for this patient.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="report-title">Custom Title (Optional)</Label>
            <Input
              id="report-title"
              placeholder="Medical Report"
              value={reportOptions.customTitle}
              onChange={(e) =>
                setReportOptions({
                  ...reportOptions,
                  customTitle: e.target.value,
                })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="include-visits"
              checked={reportOptions.includeVisits}
              onChange={(e) =>
                setReportOptions({
                  ...reportOptions,
                  includeVisits: e.target.checked,
                })
              }
              className="rounded border-gray-300 focus:ring-green-500"
            />
            <Label htmlFor="include-visits">Include Visit History</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="include-history"
              checked={reportOptions.includeHistory}
              onChange={(e) =>
                setReportOptions({
                  ...reportOptions,
                  includeHistory: e.target.checked,
                })
              }
              className="rounded border-gray-300 focus:ring-green-500"
            />
            <Label htmlFor="include-history">Include Status History</Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsReportDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isGeneratingReport ? "Generating..." : "Generate Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

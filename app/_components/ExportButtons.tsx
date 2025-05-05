import { useLanguage } from "@/app/_contexts/LanguageContext";
import { ExportFormat, useExport } from "@/app/_hooks/export/useExport";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format as formatDate } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Download,
  File as FilePdf,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { CustomCalendar } from "./CustomCalendar";

interface ExportButtonsProps {
  patientId?: string;
  userId?: string;
  showAllOptions?: boolean;
}

export default function ExportButtons({
  patientId,
  userId,
  showAllOptions = false,
}: ExportButtonsProps) {
  const {
    hasRegularAccess,
    hasAdminAccess,
    isLoading,
    exportAllPatients,
    exportPatient,
    exportPatientToPDF,
    exportUsers,
    exportUser,
  } = useExport();

  const { t, dir } = useLanguage();

  const [showPatientFilters, setShowPatientFilters] = useState(false);
  const [patientFilters, setPatientFilters] = useState({
    status: "",
    isActive: undefined as boolean | undefined,
    tag: "",
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
  });

  if (!hasRegularAccess) {
    return null;
  }

  // Format for downloading a specific file
  const getFormatIcon = (format: ExportFormat) => {
    const iconClassName = "h-4 w-4 mx-2";

    switch (format) {
      case "excel":
        return <FileSpreadsheet className={iconClassName} />;
      case "csv":
        return <FileText className={iconClassName} />;
      case "pdf":
        return <FilePdf className={iconClassName} />;
      default:
        return <Download className={iconClassName} />;
    }
  };

  // Handle exports for a specific patient
  const handlePatientExport = (format: ExportFormat) => {
    if (patientId) {
      exportPatient(patientId, format);
    }
  };

  // Handle PDF export for a specific patient
  const handlePatientPDFExport = () => {
    if (patientId) {
      exportPatientToPDF(patientId);
    }
  };

  // Handle exports for all patients with optional filters
  const handleAllPatientsExport = (format: ExportFormat) => {
    exportAllPatients({
      format,
      status: patientFilters.status || undefined,
      isActive: patientFilters.isActive,
      tag: patientFilters.tag || undefined,
      fromDate: patientFilters.fromDate
        ? formatDate(patientFilters.fromDate, "yyyy-MM-dd")
        : undefined,
      toDate: patientFilters.toDate
        ? formatDate(patientFilters.toDate, "yyyy-MM-dd")
        : undefined,
    });
    setShowPatientFilters(false);
  };

  // Handle exports for a specific user
  const handleUserExport = (format: ExportFormat) => {
    if (userId) {
      exportUser(userId, format);
    }
  };

  // Handle exports for all users
  const handleAllUsersExport = (format: ExportFormat) => {
    exportUsers({ format });
  };

  // Return buttons based on available permissions and context
  return (
    <>
      {/* Single Patient Export Options */}
      {patientId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              disabled={isLoading}
              className="flex items-center border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <Download className="h-4 w-4 mx-2 text-emerald-600 dark:text-emerald-400" />
              {t("exportPatient") || "Export Patient"}
              <ChevronDown className="h-4 w-4 mx-2 text-emerald-600 dark:text-emerald-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-800"
          >
            <DropdownMenuItem
              onClick={() => handlePatientExport("excel")}
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              {getFormatIcon("excel")} Excel
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePatientExport("csv")}
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              {getFormatIcon("csv")} CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handlePatientPDFExport}
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              {getFormatIcon("pdf")} {t("pdfReport") || "PDF Report"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* All Patients Export Options */}
      {(showAllOptions || !patientId) && hasRegularAccess && (
        <Dialog open={showPatientFilters} onOpenChange={setShowPatientFilters}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              disabled={isLoading}
              className="flex items-center border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <Download className="h-4 w-4 mx-2 text-emerald-600 dark:text-emerald-400" />
              {t("exportAllPatients") || "Export All Patients"}
            </Button>
          </DialogTrigger>
          <DialogContent
            className={cn(
              "sm:max-w-[425px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-emerald-100 dark:border-emerald-900"
            )}
          >
            <DialogHeader
              className={cn(
                "border-b border-gray-100 dark:border-gray-700 pb-3 w-full",
                dir === "rtl" && "flex items-start"
              )}
            >
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent">
                {t("exportPatients") || "Export Patients"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                {t("filterPatientsExport") ||
                  "Filter patients to export and select your desired format."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4" dir={dir}>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="status"
                  className="col-span-4 text-emerald-700 dark:text-emerald-300"
                >
                  {t("status") || "Status"}
                </Label>
                <Input
                  id="status"
                  placeholder={t("filterByStatus") || "Filter by status"}
                  className="col-span-4 border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500"
                  value={patientFilters.status}
                  onChange={(e) =>
                    setPatientFilters((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="tag"
                  className="col-span-4 text-emerald-700 dark:text-emerald-300"
                >
                  {t("tag") || "Tag"}
                </Label>
                <Input
                  id="tag"
                  placeholder={t("filterByTag") || "Filter by tag"}
                  className="col-span-4 border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500"
                  value={patientFilters.tag}
                  onChange={(e) =>
                    setPatientFilters((prev) => ({
                      ...prev,
                      tag: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-x-2">
                <Checkbox
                  id="isActive"
                  checked={patientFilters.isActive}
                  className="text-emerald-600  border-emerald-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  onCheckedChange={(checked) =>
                    setPatientFilters((prev) => ({
                      ...prev,
                      isActive:
                        checked === "indeterminate" ? undefined : !!checked,
                    }))
                  }
                />
                <Label
                  htmlFor="isActive"
                  className="text-gray-700 dark:text-gray-300"
                >
                  {t("activePatientsOnly") || "Active patients only"}
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-2">
                  <Label
                    htmlFor="fromDate"
                    className="text-emerald-700 dark:text-emerald-300"
                  >
                    {t("fromDate") || "From Date"}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="fromDate"
                        variant={"outline"}
                        className="justify-start text-left font-normal border-emerald-200 dark:border-emerald-800"
                      >
                        <CalendarIcon className="h-4 w-4 mx-2 text-emerald-600 dark:text-emerald-400" />
                        {patientFilters.fromDate ? (
                          formatDate(patientFilters.fromDate, "PPP")
                        ) : (
                          <span>{t("fromDate") || "From date"}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border-emerald-100 dark:border-emerald-900"
                      align="start"
                    >
                      <CustomCalendar
                        selected={patientFilters.fromDate}
                        onSelect={(date: Date) =>
                          setPatientFilters((prev) => ({
                            ...prev,
                            fromDate: date || undefined,
                          }))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label
                    htmlFor="toDate"
                    className="text-emerald-700 dark:text-emerald-300"
                  >
                    {t("toDate") || "To Date"}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="toDate"
                        variant={"outline"}
                        className="justify-start text-left font-normal border-emerald-200 dark:border-emerald-800"
                      >
                        <CalendarIcon className="h-4 w-4 mx-2 text-emerald-600 dark:text-emerald-400" />
                        {patientFilters.toDate ? (
                          formatDate(patientFilters.toDate, "PPP")
                        ) : (
                          <span>{t("toDate") || "To date"}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border-emerald-100 dark:border-emerald-900"
                      align="start"
                    >
                      <CustomCalendar
                        selected={patientFilters.toDate}
                        onSelect={(date: Date) =>
                          setPatientFilters((prev) => ({
                            ...prev,
                            toDate: date || undefined,
                          }))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter className=" pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-col  w-full gap-y-2">
                <Button
                  variant="outline"
                  onClick={() => handleAllPatientsExport("excel")}
                  className="w-full sm:w-auto border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  {getFormatIcon("excel")}
                  {t("exportAsExcel") || "Export as Excel"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAllPatientsExport("csv")}
                  className="w-full sm:w-auto border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  {getFormatIcon("csv")} {t("exportAsCSV") || "Export as CSV"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Single User Export Options (Admin Only) */}
      {userId && hasAdminAccess && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              disabled={isLoading}
              className="flex items-center border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <Download className="h-4 w-4 mx-2 text-emerald-600 dark:text-emerald-400" />
              {t("exportUser") || "Export User"}
              <ChevronDown className="h-4 w-4 mx-2 text-emerald-600 dark:text-emerald-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-800"
          >
            <DropdownMenuItem
              onClick={() => handleUserExport("excel")}
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              {getFormatIcon("excel")} Excel
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleUserExport("csv")}
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              {getFormatIcon("csv")} CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleUserExport("pdf")}
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              {getFormatIcon("pdf")} PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* All Users Export Options (Admin Only) */}
      {(showAllOptions || !userId) && hasAdminAccess && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              disabled={isLoading}
              className="flex items-center border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <Download className="h-4 w-4 mx-2 text-emerald-600 dark:text-emerald-400" />
              {t("exportAllUsers") || "Export All Users"}
              <ChevronDown className="h-4 w-4 mx-2 text-emerald-600 dark:text-emerald-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-800"
          >
            <DropdownMenuItem
              onClick={() => handleAllUsersExport("excel")}
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              {getFormatIcon("excel")} Excel
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAllUsersExport("csv")}
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              {getFormatIcon("csv")} CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

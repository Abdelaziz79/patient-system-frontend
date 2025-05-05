import { IPatient, IPatientStatusOption } from "@/app/_types/Patient";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCcw,
  Activity,
  CalendarDays,
  Clock,
  History,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface PatientStatusSectionProps {
  patient: IPatient;
  onStatusChange?: () => void;
}

export function PatientStatusSection({
  patient,
  onStatusChange,
}: PatientStatusSectionProps) {
  const { t } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState<string>(
    patient.status?.name || ""
  );

  const { changePatientStatus, isChangingStatus } = usePatient({
    initialFetch: false,
  });

  // Format date for display
  const formatDateCleaner = (date: string | Date): string => {
    if (!date) return t("notAvailable");
    try {
      return format(new Date(date), "PP");
    } catch (e) {
      return t("invalidDate");
    }
  };

  const handleStatusChange = async (statusName: string) => {
    setSelectedStatus(statusName);

    // Find the status option
    const statusOption = patient.statusOptions.find(
      (option) => option.name === statusName
    );

    if (!statusOption) {
      toast.error(t("statusOptionNotFound"));
      return;
    }

    try {
      const result = await changePatientStatus(patient.id || "", {
        name: statusOption.name,
        label: statusOption.label,
        color: statusOption.color,
        date: new Date(),
      });

      if (result.success) {
        toast.success(
          t("patientStatusUpdated").replace("{{status}}", statusOption.label)
        );
        // Refresh the patient data if callback provided
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        toast.error(result.error || t("failedToUpdateStatus"));
      }
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error(t("errorUpdatingStatus"));
    }
  };

  return (
    <Card className="mb-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-indigo-100 dark:border-indigo-900 shadow-xl hover:shadow-indigo-100/30 dark:hover:shadow-indigo-900/30 transition-all duration-300">
      <CardHeader className="pb-3 border-b border-indigo-50 dark:border-slate-700/50">
        <CardTitle className="text-lg text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          {t("patientStatus")}
        </CardTitle>
        <CardDescription className="text-indigo-600 dark:text-indigo-400">
          {t("managePatientStatusAndHistory")}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Status */}
          <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900/30 shadow-sm">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <CalendarDays className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              {t("currentStatus")}
            </h3>
            <div className="flex flex-col gap-y-3">
              {patient.status && (
                <div className="flex items-center gap-x-3">
                  <Badge
                    style={{
                      backgroundColor: patient.status.color || "#3498db",
                    }}
                    className="text-white px-3 py-1.5 shadow-sm"
                  >
                    {patient.status.label}
                  </Badge>
                  <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {t("since")}{" "}
                    {formatDateCleaner(patient.status?.date || new Date())}
                  </span>
                </div>
              )}

              {patient.status?.notes && (
                <div className="mt-2 p-2 bg-white/80 dark:bg-slate-800/80 rounded-md border border-indigo-100/60 dark:border-slate-700/60">
                  <span className="text-sm text-gray-600 dark:text-gray-300 italic">
                    "{patient.status.notes}"
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Change Status */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 shadow-sm">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <RefreshCcw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {t("changeStatus")}
            </h3>
            <div className="flex items-center gap-x-2">
              <Select
                value={selectedStatus}
                onValueChange={handleStatusChange}
                disabled={isChangingStatus}
              >
                <SelectTrigger className="w-[200px] border-blue-200 dark:border-blue-900/50 focus:ring-blue-400">
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {patient.statusOptions &&
                    patient.statusOptions.map(
                      (option: IPatientStatusOption) => (
                        <SelectItem
                          key={option.name}
                          value={option.name}
                          className="flex items-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <div className="flex items-center">
                            <span
                              className="w-3 h-3 rounded-full mx-2"
                              style={{ backgroundColor: option.color }}
                            ></span>
                            {option.label}
                          </div>
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>

              {isChangingStatus && (
                <Button disabled variant="outline" size="sm" className="h-9">
                  <Loader2 className="h-4 w-4 animate-spin mx-1" />
                  {t("updating")}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Status History */}
        {patient.statusHistory && patient.statusHistory.length > 0 && (
          <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <History className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              {t("statusHistory")} ({patient.statusHistory.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto px-2">
              {patient.statusHistory.map((history, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 p-2 rounded-md bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="text-xs bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400"
                    >
                      {history.label}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDateCleaner(history.date)}
                    </span>
                  </div>
                  {history.notes && (
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1 italic">
                      "{history.notes}"
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

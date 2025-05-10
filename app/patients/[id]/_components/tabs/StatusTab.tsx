import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { isValid } from "date-fns";
import { Clock, Info, Shield } from "lucide-react";
import { PatientStatusTabProps } from "./types";

export function StatusTab({ patient, formatDate }: PatientStatusTabProps) {
  const { t } = useLanguage();

  // Format date for better display
  const formatDateCleaner = (date: string | Date): string => {
    if (!date) return t("notAvailable");
    try {
      const dateObj = new Date(date);
      if (!isValid(dateObj)) return t("invalidDate");
      return formatDate(dateObj);
    } catch (e) {
      console.log(e);
      return t("invalidDate");
    }
  };

  return (
    <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-indigo-100 dark:border-slate-800 shadow-xl transition-all duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-indigo-800 dark:text-slate-300 flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-600 dark:text-slate-400" />
          {t("statusHistory")}
        </CardTitle>
        <CardDescription className="text-indigo-600 dark:text-slate-400">
          {t("changesInPatientStatus")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Current Status */}
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-3 text-indigo-700 dark:text-slate-300">
            {t("currentStatus")}
          </h3>
          <div className="p-4 border border-indigo-100 dark:border-slate-800 rounded-lg bg-indigo-50/50 dark:bg-slate-800/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Badge
                style={{
                  backgroundColor: (patient?.status as any)?.color || "#3498db",
                }}
                className="text-white text-xs px-3 py-1"
              >
                {(patient?.status as any)?.label || t("unknown")}
              </Badge>
              <span className="text-sm text-gray-500 dark:text-slate-400">
                {t("since")}:{" "}
                {formatDateCleaner(
                  (patient?.status as any)?.date || new Date()
                )}
              </span>
            </div>
            {(patient?.status as any)?.notes && (
              <p className="text-sm text-gray-600 dark:text-slate-300 p-3 bg-white/80 dark:bg-slate-900/80 rounded-md border border-indigo-100 dark:border-slate-700">
                {(patient.status as any).notes}
              </p>
            )}
          </div>
        </div>

        {/* Status History */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-indigo-700 dark:text-slate-300 flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600 dark:text-slate-400" />
            {t("historyLabel")}
          </h3>

          {patient?.statusHistory && patient.statusHistory.length > 0 ? (
            <div className="space-y-4">
              {patient.statusHistory.map((statusItem: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border border-indigo-100 dark:border-slate-800 rounded-lg bg-indigo-50/30 dark:bg-slate-800/30 hover:bg-indigo-50/70 dark:hover:bg-slate-800/70 transition-colors duration-200 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Badge
                      variant="outline"
                      className="bg-white dark:bg-slate-900 text-xs border-indigo-200 dark:border-slate-700"
                    >
                      {statusItem.label}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-slate-400 flex items-center">
                      <Clock className="h-3.5 w-3.5 mx-1" />
                      {formatDateCleaner(statusItem.date)}
                    </span>
                  </div>
                  {statusItem.notes && (
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 p-2 bg-white/80 dark:bg-slate-900/80 rounded-md border border-indigo-50 dark:border-slate-700/50">
                      {statusItem.notes}
                    </p>
                  )}
                  <div className="text-xs text-gray-400 dark:text-slate-500 mt-2 flex items-center">
                    <Info className="h-3 w-3 mx-1" />
                    {t("updatedBy")}: {statusItem.updatedBy}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-indigo-50/50 dark:bg-slate-800/50 rounded-lg">
              <Shield className="h-12 w-12 mx-auto text-indigo-300 dark:text-slate-600 mb-3" />
              <p className="text-indigo-600 dark:text-slate-400 font-medium">
                {t("noStatusHistoryAvailable")}
              </p>
              <p className="text-indigo-500 dark:text-slate-500 text-sm mt-1">
                {t("statusChangesWillAppear")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

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
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
        <CardTitle className="text-lg sm:text-xl text-indigo-800 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-slate-400" />
          {t("statusHistory")}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-indigo-600 dark:text-slate-400">
          {t("changesInPatientStatus")}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-3 sm:px-6 py-2 sm:py-4">
        {/* Current Status */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-indigo-700 dark:text-slate-300">
            {t("currentStatus")}
          </h3>
          <div className="p-3 sm:p-4 border border-indigo-100 dark:border-slate-800 rounded-lg bg-indigo-50/50 dark:bg-slate-800/50 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Badge
                style={{
                  backgroundColor: (patient?.status as any)?.color || "#3498db",
                }}
                className="text-white text-xs px-2 sm:px-3 py-0.5 sm:py-1"
              >
                {(patient?.status as any)?.label || t("unknown")}
              </Badge>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                {t("since")}:{" "}
                {formatDateCleaner(
                  (patient?.status as any)?.date || new Date()
                )}
              </span>
            </div>
            {(patient?.status as any)?.notes && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 p-2 sm:p-3 bg-white/80 dark:bg-slate-900/80 rounded-md border border-indigo-100 dark:border-slate-700">
                {(patient.status as any).notes}
              </p>
            )}
          </div>
        </div>

        {/* Status History */}
        <div>
          <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-indigo-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 dark:text-slate-400" />
            {t("historyLabel")}
          </h3>

          {patient?.statusHistory && patient.statusHistory.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {patient.statusHistory.map((statusItem: any, index: number) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 border border-indigo-100 dark:border-slate-800 rounded-lg bg-indigo-50/30 dark:bg-slate-800/30 hover:bg-indigo-50/70 dark:hover:bg-slate-800/70 transition-colors duration-200 shadow-sm"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <Badge
                      variant="outline"
                      className="bg-white dark:bg-slate-900 text-xs border-indigo-200 dark:border-slate-700"
                    >
                      {statusItem.label}
                    </Badge>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 flex items-center">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mx-1" />
                      {formatDateCleaner(statusItem.date)}
                    </span>
                  </div>
                  {statusItem.notes && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-1 sm:mt-2 p-1.5 sm:p-2 bg-white/80 dark:bg-slate-900/80 rounded-md border border-indigo-50 dark:border-slate-700/50">
                      {statusItem.notes}
                    </p>
                  )}
                  <div className="text-xs text-gray-400 dark:text-slate-500 mt-1.5 sm:mt-2 flex items-center">
                    <Info className="h-2.5 w-2.5 sm:h-3 sm:w-3 mx-1" />
                    {t("updatedBy")}: {statusItem.updatedBy}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 sm:p-8 bg-indigo-50/50 dark:bg-slate-800/50 rounded-lg">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-indigo-300 dark:text-slate-600 mb-2 sm:mb-3" />
              <p className="text-indigo-600 dark:text-slate-400 font-medium text-sm sm:text-base">
                {t("noStatusHistoryAvailable")}
              </p>
              <p className="text-indigo-500 dark:text-slate-500 text-xs sm:text-sm mt-1">
                {t("statusChangesWillAppear")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

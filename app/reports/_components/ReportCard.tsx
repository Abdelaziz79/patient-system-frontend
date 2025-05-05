import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IReport } from "@/app/_hooks/report/reportApi";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  Calendar,
  CalendarDays,
  ChartPieIcon,
  Clock,
  FileBarChart,
  ListFilter,
  User,
} from "lucide-react";
import { useMemo } from "react";

interface ReportCardProps {
  report: IReport;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export const ReportCard = ({
  report,
  isSelected,
  onClick,
  index,
}: ReportCardProps) => {
  const { t, isRTL, language } = useLanguage();

  // Get the appropriate locale for date formatting
  const dateLocale = useMemo(() => (language === "ar" ? ar : enUS), [language]);

  const formatDate = (dateValue: any) => {
    // Handle various date formats including MongoDB ISODate
    try {
      let date;

      // Handle string date
      if (typeof dateValue === "string") {
        date = parseISO(dateValue);
      }
      // Handle MongoDB ISODate format
      else if (dateValue && dateValue.$date) {
        date = new Date(dateValue.$date);
      }
      // Handle Date object
      else if (dateValue instanceof Date) {
        date = dateValue;
      }
      // Default to current date if missing
      else {
        date = new Date();
      }

      return {
        full: format(date, "MMM dd, yyyy", { locale: dateLocale }),
        relative: formatDistanceToNow(date, {
          addSuffix: true,
          locale: dateLocale,
        }),
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { full: "", relative: "" };
    }
  };

  // Get formatted date for the report
  const formattedDate = useMemo(() => {
    return formatDate(report.createdAt || new Date());
  }, [report.createdAt]);

  // Helper function to get report type labels
  const getReportTypeLabel = () => {
    const type = report.type?.toLowerCase() || "custom";
    switch (type) {
      case "patient":
        return "Patient Reports";
      case "visit":
        return "Visit Reports";
      case "status":
        return "Status Reports";
      case "custom":
        return "Custom Reports";
      case "event":
        return "Event Reports";
      default:
        return "Reports";
    }
  };

  const getReportTypeIcon = () => {
    switch (report.type?.toLowerCase() || "custom") {
      case "patient":
        return <User className="h-3.5 w-3.5" />;
      case "visit":
        return <CalendarDays className="h-3.5 w-3.5" />;
      case "status":
        return <ListFilter className="h-3.5 w-3.5" />;
      case "custom":
        return <ChartPieIcon className="h-3.5 w-3.5" />;
      case "event":
        return <Calendar className="h-3.5 w-3.5" />;
      default:
        return <FileBarChart className="h-3.5 w-3.5" />;
    }
  };

  const getCardStyles = () => {
    if (isSelected) {
      return "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow";
    }
    return "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10";
  };

  // Calculate the number of charts
  const chartCount = report.charts?.length || 0;

  // Get the list of included fields for display
  const includeFieldCount = report.includeFields?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${getCardStyles()}`}
      onClick={onClick}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0 p-1.5 bg-blue-100 dark:bg-blue-800/30 rounded-full">
          {getReportTypeIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
            <h3
              className={`font-medium text-sm sm:text-base truncate ${
                isSelected
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {report.name || "Untitled Report"}
            </h3>
            <Badge
              variant="outline"
              className={`text-xs whitespace-nowrap self-start ${
                isSelected
                  ? "border-blue-300 dark:border-blue-700"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {getReportTypeLabel()}
            </Badge>
          </div>

          <p className="mt-1 text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
            {report.description || "No description provided"}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar
                className={`h-3 w-3 ${
                  isRTL ? "mx-1" : "mx-1"
                } text-blue-500 dark:text-blue-400`}
              />
              {formattedDate.full}
            </div>

            <div className="flex items-center">
              <Clock
                className={`h-3 w-3 ${
                  isRTL ? "mx-1" : "mx-1"
                } text-blue-500 dark:text-blue-400`}
              />
              {formattedDate.relative}
            </div>

            {chartCount > 0 && (
              <Badge variant="outline" className="text-xs px-2">
                {chartCount} charts
              </Badge>
            )}

            {includeFieldCount > 0 && (
              <Badge
                variant="outline"
                className="text-xs px-2 bg-gray-50 dark:bg-gray-800"
              >
                {includeFieldCount} fields
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

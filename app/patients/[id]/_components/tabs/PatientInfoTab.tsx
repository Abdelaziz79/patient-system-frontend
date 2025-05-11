import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { isValid } from "date-fns";
import { ClipboardList, FileText, Info, Calendar } from "lucide-react";
import { PatientInfoTabProps } from "./types";
import { useLanguage } from "@/app/_contexts/LanguageContext";

// Helper component for section data display
const InfoItem = ({
  icon: Icon,
  label,
  value,
  fullWidth = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
  fullWidth?: boolean;
}) => {
  const { t } = useLanguage();

  return (
    <div
      className={`p-2 sm:p-3 md:p-4 rounded-lg transition-colors duration-200
        bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700
        ${fullWidth ? "md:col-span-2" : ""}`}
    >
      <div className="flex items-center mb-1 sm:mb-2">
        <Icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-indigo-600 dark:text-slate-400 mx-1 sm:mx-1.5 md:mx-2" />
        <span className="font-semibold text-indigo-800 dark:text-slate-200 text-xs sm:text-sm md:text-base">
          {label}
        </span>
      </div>
      <p className="text-xs sm:text-sm md:text-base text-gray-800 dark:text-slate-300 break-words">
        {value || t("notProvided")}
      </p>
    </div>
  );
};

export function PatientInfoTab({ patient, formatDate }: PatientInfoTabProps) {
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

  // Check if a value is likely a date
  const isLikelyDate = (value: any, fieldName: string): boolean => {
    // If field name contains date, it's likely a date
    if (
      fieldName.toLowerCase().includes("date") ||
      fieldName.toLowerCase().includes("birth") ||
      fieldName.toLowerCase().includes("_at")
    ) {
      return true;
    }

    // Try to check if it's an ISO date string format
    if (typeof value === "string") {
      // Check for ISO date pattern or other common date formats
      const datePatterns = [
        /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, // ISO date pattern
        /^\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY or DD/MM/YYYY
      ];

      if (datePatterns.some((pattern) => pattern.test(value))) {
        try {
          const dateObj = new Date(value);
          return isValid(dateObj);
        } catch {
          return false;
        }
      }
    }

    return false;
  };

  // Helper function to format field value based on type
  const formatFieldValue = (value: any, fieldKey: string) => {
    if (value === null || value === undefined) return t("notProvided");

    // Handle boolean values
    if (typeof value === "boolean") {
      return value ? t("active") : t("inactive");
    }

    // Handle date values
    if (isLikelyDate(value, fieldKey)) {
      return formatDateCleaner(value);
    }

    // Handle other types
    return String(value);
  };

  return (
    <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-indigo-100 dark:border-slate-800 shadow-xl transition-all duration-200">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
        <CardTitle className="text-lg sm:text-xl text-indigo-800 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
          <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-slate-400" />
          {t("patientInformation")}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-indigo-600 dark:text-slate-400">
          {t("allSectionsFrom")} {patient?.templateId?.name || t("template")}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-3 sm:px-6 py-2 sm:py-4">
        {Object.entries(patient?.sectionData || {}).map(
          ([sectionKey, sectionValue]) => (
            <div key={sectionKey} className="mb-4 sm:mb-8">
              <div className="bg-indigo-50/50 dark:bg-slate-800/50 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold capitalize flex items-center gap-1 sm:gap-2 text-indigo-700 dark:text-slate-300">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-slate-400" />
                  {sectionKey.replace(/([A-Z])/g, " $1").trim()}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                {Object.entries(sectionValue as Record<string, any>).map(
                  ([fieldKey, fieldValue]) => {
                    // Determine the icon based on the field
                    let FieldIcon = Info;
                    if (
                      fieldKey.toLowerCase().includes("date") ||
                      fieldKey.toLowerCase().includes("birth")
                    ) {
                      FieldIcon = Calendar;
                    }

                    return (
                      <InfoItem
                        key={fieldKey}
                        icon={FieldIcon}
                        label={fieldKey
                          .replace(/_/g, " ")
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                        value={formatFieldValue(fieldValue, fieldKey)}
                      />
                    );
                  }
                )}
              </div>

              <Separator className="my-4 sm:my-6 bg-indigo-100 dark:bg-slate-700" />
            </div>
          )
        )}

        {/* If there are no sections */}
        {(!patient?.sectionData ||
          Object.keys(patient?.sectionData).length === 0) && (
          <div className="text-center p-4 sm:p-8 bg-indigo-50/50 dark:bg-slate-800/50 rounded-lg">
            <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-indigo-300 dark:text-slate-600 mb-2 sm:mb-3" />
            <p className="text-indigo-600 dark:text-slate-400 font-medium text-sm sm:text-base">
              {t("noPatientInformationAvailable")}
            </p>
            <p className="text-indigo-500 dark:text-slate-500 text-xs sm:text-sm mt-1">
              {t("patientNoSectionsRecorded")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

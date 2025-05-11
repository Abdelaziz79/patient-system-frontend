import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IStatus } from "@/app/_types/Patient";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { differenceInYears, format } from "date-fns";
import { Info, Phone, Star, User } from "lucide-react";
import { PatientInfoCardProps } from "./types";

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  const { t } = useLanguage();

  // Calculate patient age if birthdate is available
  const calculateAge = (birthdate: string | Date): number | null => {
    if (!birthdate) return null;
    try {
      const birthdateObj = new Date(birthdate);
      return differenceInYears(new Date(), birthdateObj);
    } catch (e) {
      console.error("Error calculating age:", e);
      return null;
    }
  };

  // Format date for better display
  const formatDateCleaner = (date: string | Date): string => {
    if (!date) return t("notAvailable");
    try {
      return format(new Date(date), "PP");
    } catch (e) {
      console.log("error", e);
      return t("invalidDate");
    }
  };

  // Get age from personalInfo.dateOfBirth
  const age = patient?.personalInfo?.dateOfBirth
    ? calculateAge(patient.personalInfo.dateOfBirth)
    : null;

  // Get full name from personalInfo
  const fullName = patient?.personalInfo
    ? `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`
    : t("unnamedPatient");

  return (
    <Card className="mb-3 sm:mb-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-indigo-100 dark:border-indigo-900 shadow-md sm:shadow-xl hover:shadow-indigo-100/40 dark:hover:shadow-indigo-900/20 transition-all duration-300">
      <CardHeader className="pb-1 sm:pb-3 px-2 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-3">
          <div className="space-y-0.5 sm:space-y-1">
            <CardTitle className="text-lg sm:text-2xl font-bold text-indigo-800 dark:text-indigo-300 flex flex-wrap items-center gap-1 sm:gap-2">
              <span className="truncate max-w-[180px] xs:max-w-[220px] sm:max-w-none">
                {fullName}
              </span>
              {age !== null && (
                <span className="mx-0.5 sm:mx-2 text-xs sm:text-base font-normal text-gray-500 dark:text-gray-400">
                  ({age} {t("yearsOld")})
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-indigo-600 dark:text-indigo-400 text-xs sm:text-base">
              <span className="block sm:inline">ID: {patient.id}</span>
              {patient.personalInfo?.medicalRecordNumber && (
                <span className="block sm:inline sm:mx-2">
                  <span className="hidden sm:inline">|</span>{" "}
                  <span className="text-xs sm:text-sm">
                    {t("medicalRecordNumber")}:{" "}
                  </span>
                  {patient.personalInfo.medicalRecordNumber}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 sm:mt-0">
            {patient?.status && (
              <Badge
                style={{
                  backgroundColor:
                    (patient.status as IStatus).color || "#3498db",
                }}
                className="text-white text-xs sm:text-sm px-1.5 sm:px-3 py-0.5 sm:py-1.5 h-auto font-medium shadow-sm"
              >
                {(patient.status as IStatus).label || t("unknownStatus")}
              </Badge>
            )}
            <Badge
              variant={patient?.isActive ? "default" : "outline"}
              className={`text-xs sm:text-sm px-1.5 sm:px-3 py-0.5 sm:py-1 h-auto ${
                patient?.isActive
                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {patient?.isActive ? t("active") : t("inactive")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-6 py-2 sm:py-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
          {/* Basic Information */}
          <div className="col-span-1 bg-indigo-50/50 dark:bg-slate-700/30 rounded-lg p-2 sm:p-4 hover:bg-indigo-50/80 dark:hover:bg-slate-700/50 transition-colors duration-200">
            <h3 className="text-sm sm:text-lg font-semibold mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2 text-indigo-700 dark:text-indigo-300">
              <User className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
              {t("basicInformation")}
            </h3>
            <div className="space-y-1.5 sm:space-y-3">
              {patient?.personalInfo?.gender && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-16 sm:w-28 text-xs sm:text-sm">
                    {t("gender")}:
                  </span>
                  <span className="font-medium text-xs sm:text-base truncate">
                    {patient.personalInfo.gender}
                  </span>
                </div>
              )}
              {patient?.personalInfo?.dateOfBirth && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-16 sm:w-28 text-xs sm:text-sm">
                    {t("birthdate")}:
                  </span>
                  <span className="font-medium text-xs sm:text-base truncate">
                    {formatDateCleaner(patient.personalInfo.dateOfBirth)}
                  </span>
                </div>
              )}
              {patient?.templateId && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-16 sm:w-28 text-xs sm:text-sm">
                    {t("template")}:
                  </span>
                  <span className="font-medium text-xs sm:text-base truncate">
                    {patient.templateId.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-span-1 bg-indigo-50/50 dark:bg-slate-700/30 rounded-lg p-2 sm:p-4 hover:bg-indigo-50/80 dark:hover:bg-slate-700/50 transition-colors duration-200">
            <h3 className="text-sm sm:text-lg font-semibold mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2 text-indigo-700 dark:text-indigo-300">
              <Phone className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
              {t("contactInformation")}
            </h3>
            <div className="space-y-1.5 sm:space-y-3">
              {patient?.personalInfo?.contactNumber && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-16 sm:w-28 text-xs sm:text-sm">
                    {t("phoneTranslate")}:
                  </span>
                  <span className="font-medium text-xs sm:text-base truncate">
                    {patient.personalInfo.contactNumber}
                  </span>
                </div>
              )}
              {patient?.personalInfo?.email && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-16 sm:w-28 text-xs sm:text-sm">
                    {t("emailAddress")}:
                  </span>
                  <span className="font-medium text-xs sm:text-base truncate max-w-[120px] xs:max-w-[140px] sm:max-w-none">
                    {patient.personalInfo.email}
                  </span>
                </div>
              )}
              {patient?.personalInfo?.address && (
                <div className="flex items-start">
                  <span className="text-gray-500 dark:text-gray-400 w-16 sm:w-28 text-xs sm:text-sm">
                    {t("addressName")}:
                  </span>
                  <span className="font-medium text-xs sm:text-base truncate max-w-[120px] xs:max-w-[140px] sm:max-w-none">
                    {patient.personalInfo.address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Creation Information */}
          <div className="col-span-1 bg-indigo-50/50 dark:bg-slate-700/30 rounded-lg p-2 sm:p-4 hover:bg-indigo-50/80 dark:hover:bg-slate-700/50 transition-colors duration-200">
            <h3 className="text-sm sm:text-lg font-semibold mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2 text-indigo-700 dark:text-indigo-300">
              <Info className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
              {t("recordInformation")}
            </h3>
            <div className="space-y-1.5 sm:space-y-3">
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-16 sm:w-28 text-xs sm:text-sm">
                  {t("created")}:
                </span>
                <span className="font-medium text-xs sm:text-base truncate">
                  {formatDateCleaner(patient?.createdAt || new Date())}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-16 sm:w-28 text-xs sm:text-sm">
                  {t("lastUpdated")}:
                </span>
                <span className="font-medium text-xs sm:text-base truncate">
                  {formatDateCleaner(patient?.updatedAt || new Date())}
                </span>
              </div>
              {patient?.createdBy && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-16 sm:w-28 text-xs sm:text-sm">
                    {t("createdBy")}:
                  </span>
                  <span className="font-medium text-xs sm:text-base truncate">
                    {patient.createdBy.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional sections with collapsible design */}
        {patient?.personalInfo?.emergencyContact && (
          <div className="mt-2 sm:mt-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-2 sm:p-4 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 transition-colors duration-200">
            <h3 className="text-sm sm:text-lg font-semibold mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2 text-blue-700 dark:text-blue-300">
              <Phone className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              {t("emergencyContact")}
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-6">
              {patient.personalInfo.emergencyContact.name && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-16 sm:w-28 text-xs sm:text-sm">
                    {t("name")}:
                  </span>
                  <span className="font-medium text-xs sm:text-base truncate">
                    {patient.personalInfo.emergencyContact.name}
                  </span>
                </div>
              )}
              {patient.personalInfo.emergencyContact.relationship && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-16 sm:w-28 text-xs sm:text-sm">
                    {t("relation")}:
                  </span>
                  <span className="font-medium text-xs sm:text-base truncate">
                    {patient.personalInfo.emergencyContact.relationship}
                  </span>
                </div>
              )}
              {patient.personalInfo.emergencyContact.phone && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-16 sm:w-28 text-xs sm:text-sm">
                    {t("phoneTranslate")}:
                  </span>
                  <span className="font-medium text-xs sm:text-base truncate">
                    {patient.personalInfo.emergencyContact.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

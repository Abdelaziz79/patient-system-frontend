import { IStatus } from "@/app/_types/Patient";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { differenceInYears, format } from "date-fns";
import { Cake, Info, Mail, MapPin, Phone, Star, User } from "lucide-react";
import { PatientInfoCardProps } from "./types";

export function PatientInfoCard({ patient, formatDate }: PatientInfoCardProps) {
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
    <Card className="mb-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-indigo-100 dark:border-indigo-900 shadow-xl hover:shadow-indigo-100/40 dark:hover:shadow-indigo-900/20 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
              {fullName}
              {age !== null && (
                <span className="mx-2 text-base font-normal text-gray-500 dark:text-gray-400">
                  ({age} {t("yearsOld")})
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-indigo-600 dark:text-indigo-400 text-base">
              ID: {patient.id}
              {patient.personalInfo?.medicalRecordNumber && (
                <span className="mx-2">
                  | {t("medicalRecordNumber")}:{" "}
                  {patient.personalInfo.medicalRecordNumber}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {patient?.status && (
              <Badge
                style={{
                  backgroundColor:
                    (patient.status as IStatus).color || "#3498db",
                }}
                className="text-white text-sm px-3 py-1.5 h-auto font-medium shadow-sm"
              >
                {(patient.status as IStatus).label || t("unknownStatus")}
              </Badge>
            )}
            <Badge
              variant={patient?.isActive ? "default" : "outline"}
              className={`text-sm px-3 py-1 h-auto ${
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

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="col-span-1 bg-indigo-50/50 dark:bg-slate-700/30 rounded-lg p-4 hover:bg-indigo-50/80 dark:hover:bg-slate-700/50 transition-colors duration-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              {t("basicInformation")}
            </h3>
            <div className="space-y-3">
              {patient?.personalInfo?.gender && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("gender")}:
                  </span>
                  <span className="font-medium">
                    {patient.personalInfo.gender}
                  </span>
                </div>
              )}
              {patient?.personalInfo?.dateOfBirth && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("birthdate")}:
                  </span>
                  <span className="font-medium">
                    {formatDateCleaner(patient.personalInfo.dateOfBirth)}
                  </span>
                </div>
              )}
              {patient?.templateId && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("template")}:
                  </span>
                  <span className="font-medium">{patient.templateId.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-span-1 bg-indigo-50/50 dark:bg-slate-700/30 rounded-lg p-4 hover:bg-indigo-50/80 dark:hover:bg-slate-700/50 transition-colors duration-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              {t("contactInformation")}
            </h3>
            <div className="space-y-3">
              {patient?.personalInfo?.contactNumber && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("phoneTranslate")}:
                  </span>
                  <span className="font-medium">
                    {patient.personalInfo.contactNumber}
                  </span>
                </div>
              )}
              {patient?.personalInfo?.email && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("emailAddress")}:
                  </span>
                  <span className="font-medium">
                    {patient.personalInfo.email}
                  </span>
                </div>
              )}
              {patient?.personalInfo?.address && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("addressName")}:
                  </span>
                  <span className="font-medium">
                    {patient.personalInfo.address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Creation Information */}
          <div className="col-span-1 bg-indigo-50/50 dark:bg-slate-700/30 rounded-lg p-4 hover:bg-indigo-50/80 dark:hover:bg-slate-700/50 transition-colors duration-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              {t("recordInformation")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                  {t("created")}:
                </span>
                <span className="font-medium">
                  {formatDateCleaner(patient?.createdAt || new Date())}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                  {t("lastUpdated")}:
                </span>
                <span className="font-medium">
                  {formatDateCleaner(patient?.updatedAt || new Date())}
                </span>
              </div>
              {patient?.createdBy && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("createdBy")}:
                  </span>
                  <span className="font-medium">{patient.createdBy.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional sections with collapsible design */}
        {patient?.personalInfo?.emergencyContact && (
          <div className="mt-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-4 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 transition-colors duration-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {t("emergencyContact")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {patient.personalInfo.emergencyContact.name && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("name")}:
                  </span>
                  <span className="font-medium">
                    {patient.personalInfo.emergencyContact.name}
                  </span>
                </div>
              )}
              {patient.personalInfo.emergencyContact.relationship && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("relation")}:
                  </span>
                  <span className="font-medium">
                    {patient.personalInfo.emergencyContact.relationship}
                  </span>
                </div>
              )}
              {patient.personalInfo.emergencyContact.phone && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("phoneTranslate")}:
                  </span>
                  <span className="font-medium">
                    {patient.personalInfo.emergencyContact.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Insurance Information */}
        {patient?.personalInfo?.insuranceInfo && (
          <div className="mt-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg p-4 hover:bg-purple-50/80 dark:hover:bg-purple-900/30 transition-colors duration-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              {t("insuranceInformation")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {patient.personalInfo.insuranceInfo.provider && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("provider")}:
                  </span>
                  <span className="font-medium">
                    {patient.personalInfo.insuranceInfo.provider}
                  </span>
                </div>
              )}
              {patient.personalInfo.insuranceInfo.policyNumber && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("policyNumber")}:
                  </span>
                  <span className="font-medium">
                    {patient.personalInfo.insuranceInfo.policyNumber}
                  </span>
                </div>
              )}
              {patient.personalInfo.insuranceInfo.groupNumber && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-28 text-sm">
                    {t("groupNumber")}:
                  </span>
                  <span className="font-medium">
                    {patient.personalInfo.insuranceInfo.groupNumber}
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

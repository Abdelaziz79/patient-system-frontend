import { IStatus } from "@/app/_types/Patient";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { differenceInYears } from "date-fns";
import { Info, Phone, User } from "lucide-react";
import { PatientInfoCardProps } from "./types";

export function PatientInfoCard({ patient, formatDate }: PatientInfoCardProps) {
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
  const age = patient?.sectionData?.personalinfo?.birthdate
    ? calculateAge(patient.sectionData.personalinfo.birthdate)
    : null;

  return (
    <Card className="mb-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-green-100 dark:border-green-900 shadow-xl">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">
              {patient?.sectionData?.personalinfo?.full_name ||
                "Unnamed Patient"}
              {age !== null && (
                <span className="ml-2 text-base font-normal text-gray-500 dark:text-gray-400">
                  ({age} years old)
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              ID: {patient.id}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {patient?.status && (
              <Badge
                style={{
                  backgroundColor:
                    (patient.status as IStatus).color || "#3498db",
                }}
                className="text-white"
              >
                {(patient.status as IStatus).label || "Unknown Status"}
              </Badge>
            )}
            <Badge variant={patient?.isActive ? "default" : "outline"}>
              {patient?.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-green-600 dark:text-green-400" />
              Basic Information
            </h3>
            <div className="space-y-2">
              {patient?.sectionData?.personalinfo?.gender && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-24">
                    Gender:
                  </span>
                  <span>{patient.sectionData.personalinfo.gender}</span>
                </div>
              )}
              {patient?.sectionData?.personalinfo?.birthdate && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-24">
                    Birthdate:
                  </span>
                  <span>
                    {formatDate(patient.sectionData.personalinfo.birthdate)}
                    {age !== null && (
                      <span className="ml-2 text-gray-500 dark:text-gray-400">
                        (Age: {age})
                      </span>
                    )}
                  </span>
                </div>
              )}
              {patient?.templateId && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-24">
                    Template:
                  </span>
                  <span>{patient.templateId.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
              Contact Information
            </h3>
            <div className="space-y-2">
              {patient?.sectionData?.personalinfo?.phone_number && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-24">
                    Phone:
                  </span>
                  <span>{patient.sectionData.personalinfo.phone_number}</span>
                </div>
              )}
              {patient?.sectionData?.personalinfo?.address && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-24">
                    Address:
                  </span>
                  <span>{patient.sectionData.personalinfo.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Creation Information */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
              Record Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-24">
                  Created:
                </span>
                <span>{formatDate(patient?.createdAt || new Date())}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-24">
                  Updated:
                </span>
                <span>{formatDate(patient?.updatedAt || new Date())}</span>
              </div>
              {patient?.createdBy && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-24">
                    Created by:
                  </span>
                  <span>{patient.createdBy.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

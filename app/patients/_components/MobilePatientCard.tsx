"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "../../_utils/utils";
import {
  CalendarIcon,
  Eye,
  FileText,
  Phone,
  UserCheck,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PatientDisplayItem } from "./PatientTable";
import { motion } from "framer-motion";

// Define patient interface for list view
interface Props {
  patient: PatientDisplayItem;
  index: number;
  onView?: (id: string) => void;
}

const MobilePatientCard = ({ patient, index, onView }: Props) => {
  const { t } = useLanguage();
  const router = useRouter();

  const handleViewPatient = () => {
    router.push(`/patients/${patient.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`bg-white/90 dark:bg-slate-800/90 border-l-4 rounded-md shadow-md mb-3 overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
        !patient.isActive ? "opacity-60" : ""
      }`}
      style={{ borderLeftColor: patient.statusColor || "#10b981" }}
      onClick={handleViewPatient}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-md bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
              {patient.name}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
              <Phone className="h-3 w-3 mx-1" />
              {patient.phone}
            </div>
          </div>
          <div>
            {patient.statusLabel && (
              <Badge
                style={{
                  backgroundColor: patient.statusColor || "#10b981",
                  color: "white",
                }}
                className="text-xs font-semibold"
              >
                {patient.statusLabel}
              </Badge>
            )}
            {!patient.isActive && (
              <Badge
                variant="outline"
                className="mx-1 text-xs border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400"
              >
                Inactive
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Users className="h-3 w-3 mx-1 text-green-600 dark:text-green-400" />
            <span>{t("age")}: </span>
            <span className="font-medium mx-1">{patient.age}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <UserCheck className="h-3 w-3 mx-1 text-green-600 dark:text-green-400" />
            <span>{t("gender")}: </span>
            <span className="font-medium mx-1">{patient.gender}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <CalendarIcon className="h-3 w-3 mx-1 text-green-600 dark:text-green-400" />
            <span>{t("added")}: </span>
            <span className="font-medium mx-1">
              {formatDate(patient.createdAt)}
            </span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FileText className="h-3 w-3 mx-1 text-green-600 dark:text-green-400" />
            <span>{t("fileNumber")}: </span>
            <span className="font-medium mx-1">
              {patient.fileNumber || "-"}
            </span>
          </div>
        </div>

        {patient.tags && patient.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {patient.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              if (onView) {
                onView(patient.id);
              } else {
                handleViewPatient();
              }
            }}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MobilePatientCard;

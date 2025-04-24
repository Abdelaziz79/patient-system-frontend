"use client";

import { CalendarIcon, PhoneIcon, UserIcon, Eye, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { PatientDisplayItem } from "./PatientTable";
import { formatDate } from "../_utils/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Define patient interface for list view
interface Props {
  patient: PatientDisplayItem;
  index: number;
  onView?: (id: string) => void;
}

const MobilePatientCard = ({ patient, index, onView }: Props) => {
  return (
    <div
      className="bg-white dark:bg-slate-800 border-l-4 rounded-md shadow-sm mb-2 overflow-hidden hover:shadow-md transition-shadow relative"
      style={{ borderLeftColor: patient.statusColor || "#3498db" }}
      onClick={() => onView && onView(patient.id)}
    >
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-md">{patient.name}</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
              <Phone className="h-3 w-3 mr-1" />
              {patient.phone}
            </div>
          </div>
          <div>
            {patient.statusLabel && (
              <Badge
                style={{
                  backgroundColor: patient.statusColor || "#3498db",
                  color: "white",
                }}
                className="text-xs"
              >
                {patient.statusLabel}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 mt-2 text-sm">
          <div className="text-gray-600 dark:text-gray-300">
            Age: <span className="font-medium">{patient.age}</span>
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Gender: <span className="font-medium">{patient.gender}</span>
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Added:{" "}
            <span className="font-medium">{formatDate(patient.createdAt)}</span>
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            By: <span className="font-medium">{patient.createdByName}</span>
          </div>
        </div>

        {patient.tags && patient.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {patient.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
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
              onView && onView(patient.id);
            }}
            className="h-7 w-7 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobilePatientCard;

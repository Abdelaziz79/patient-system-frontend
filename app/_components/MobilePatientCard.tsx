"use client";

import { CalendarIcon, PhoneIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { PatientListItem } from "../patients/page";

// Define patient interface for list view
type Props = {
  patient: PatientListItem;
  index: number;
};

function MobilePatientCard({ patient, index }: Props) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };

  const handlePatientClick = (id: string) => {
    router.push(`/patients/${id}`);
  };

  return (
    <div
      onClick={() => handlePatientClick(patient.id)}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-3 cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700 transition-colors border border-green-100 dark:border-slate-700"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
          {patient.fileNumber}
        </span>
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
          {index + 1}
        </span>
      </div>

      <h3 className="text-lg font-bold mb-2 text-green-800 dark:text-green-300">
        {patient.name}
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center text-sm">
          <UserIcon className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span>
            {patient.age} yrs - {patient.gender}
          </span>
        </div>

        <div className="flex items-center text-sm">
          <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-2 py-0.5 rounded-full text-xs font-medium">
            {patient.bloodType}
          </span>
        </div>

        <div className="flex items-center text-sm">
          <CalendarIcon className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span>{formatDate(patient.lastVisit)}</span>
        </div>

        <div className="flex items-center justify-end text-sm">
          <PhoneIcon className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="font-mono">{patient.phone}</span>
        </div>
      </div>

      {patient.diagnosis && (
        <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded text-sm">
          <span className="font-medium">Diagnosis:</span> {patient.diagnosis}
        </div>
      )}

      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Insurance: {patient.insuranceProvider}
        </div>
      </div>
    </div>
  );
}

export default MobilePatientCard;

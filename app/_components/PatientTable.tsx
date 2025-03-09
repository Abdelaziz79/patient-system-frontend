"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "../_utils/utils";
import { PatientListItem } from "../patients/page";

type Props = {
  filteredPatients: PatientListItem[];
  sortField: keyof PatientListItem;
  sortDirection: "asc" | "desc";
  setSortField: (field: keyof PatientListItem) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
};

function PatientTable({
  filteredPatients,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
}: Props) {
  const router = useRouter();

  const handleSort = (field: keyof PatientListItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  const handlePatientClick = (id: string) => {
    router.push(`/patients/${id}`);
  };

  return (
    <div className="rounded-md border dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-green-50 dark:bg-slate-700">
            <TableRow>
              <TableHead className="font-bold text-green-800 dark:text-green-300 w-12">
                #
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 w-24">
                File No.
              </TableHead>
              <TableHead
                className="font-bold text-green-800 dark:text-green-300 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Patient Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                  {sortField === "name" && (
                    <span className="ml-1 text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300">
                Age
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell">
                Gender
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell">
                Blood Type
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell">
                Diagnosis
              </TableHead>
              <TableHead
                className="font-bold text-green-800 dark:text-green-300 cursor-pointer"
                onClick={() => handleSort("lastVisit")}
              >
                <div className="flex items-center">
                  Last Visit
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                  {sortField === "lastVisit" && (
                    <span className="ml-1 text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300">
                Phone
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <TableRow
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
                  className="cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                      {patient.fileNumber}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {patient.gender}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                      {patient.bloodType}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">
                    {patient.diagnosis || "—"}
                  </TableCell>
                  <TableCell>{formatDate(patient.lastVisit)}</TableCell>
                  <TableCell className="font-mono">{patient.phone}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <SearchIcon className="h-12 w-12 mb-2 opacity-20" />
                    <p className="text-lg font-medium">No patients found</p>
                    <p className="text-sm">
                      Try changing your search criteria or add new patients
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default PatientTable;

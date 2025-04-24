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

// Updated Patient interface to match the provided data structure
export interface PatientDisplayItem {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  age: string;
  gender: string;
  templateName: string;
  createdByName: string;
  fileNumber?: string;
}

type Props = {
  filteredPatients: PatientDisplayItem[];
  sortField: keyof PatientDisplayItem;
  sortDirection: "asc" | "desc";
  setSortField: (field: keyof PatientDisplayItem) => void;
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

  const handleSort = (field: keyof PatientDisplayItem) => {
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
                Phone
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300">
                Age
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell">
                Gender
              </TableHead>
              <TableHead
                className="font-bold text-green-800 dark:text-green-300 cursor-pointer hidden md:table-cell"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Created At
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                  {sortField === "createdAt" && (
                    <span className="ml-1 text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell">
                Template
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell">
                Added By
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <TableRow
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
                  className="dark:border-gray-700 cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell className="font-mono">{patient.phone}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {patient.gender}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(patient.createdAt)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                      {patient.templateName}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {patient.createdByName}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
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

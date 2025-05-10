"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Eye, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "../../_utils/utils";

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
  statusColor?: string;
  statusLabel?: string;
  tags?: string[];
  adminId?: string;
  isActive: boolean;
}

// Update the Props type definition to make sort-related props optional
export interface Props {
  filteredPatients: PatientDisplayItem[];
  sortField?: keyof PatientDisplayItem;
  sortDirection?: "asc" | "desc";
  setSortField?: (field: keyof PatientDisplayItem) => void;
  setSortDirection?: (direction: "asc" | "desc") => void;
}

export default function PatientTable({
  filteredPatients,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
}: Props) {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  // Only render sort buttons if sort functionality is present
  const handleSort = (field: keyof PatientDisplayItem) => {
    if (!setSortField || !setSortDirection) return; // Early return if sort functions are not provided

    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Modify the rendering of table headers to conditionally show sort buttons
  const renderSortableHeader = (
    label: string,
    field: keyof PatientDisplayItem
  ) => {
    if (!setSortField || !setSortDirection) {
      // Just render the header text if sort functionality is disabled
      return <div className="font-semibold">{label}</div>;
    }

    // Render sortable header with buttons if sort functionality is enabled
    return (
      <div
        className="flex items-center cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        onClick={() => handleSort(field)}
      >
        <span className="font-semibold">{label}</span>
        <div className="flex flex-col mx-1">
          <ChevronUp
            className={`h-3 w-3 ${
              sortField === field && sortDirection === "asc"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-400 dark:text-gray-600"
            }`}
          />
          <ChevronDown
            className={`h-3 w-3 ${
              sortField === field && sortDirection === "desc"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-400 dark:text-gray-600"
            }`}
          />
        </div>
      </div>
    );
  };

  const handlePatientClick = (id: string) => {
    router.push(`/patients/${id}`);
  };

  return (
    <div
      className="rounded-md border border-green-100 dark:border-green-800 overflow-hidden shadow-md"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ textAlign: isRTL ? "right" : "left" }}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-slate-700 dark:to-slate-700/80">
            <TableRow className="hover:bg-green-100/50 dark:hover:bg-slate-700/90">
              <TableHead className="font-bold text-green-800 dark:text-green-300 w-12 text-start">
                #
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 text-start">
                {renderSortableHeader(t("name"), "name")}
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 text-start">
                {renderSortableHeader(t("phoneTranslate"), "phone")}
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 text-start">
                {renderSortableHeader(t("age"), "age")}
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell text-start">
                {renderSortableHeader(t("gender"), "gender")}
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell text-start">
                {renderSortableHeader(t("patientStatus"), "statusLabel")}
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell text-start">
                {renderSortableHeader(t("added"), "createdAt")}
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell text-start">
                {renderSortableHeader(t("template"), "templateName")}
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 w-12 hidden md:table-cell">
                <span className="sr-only">{t("actions")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
                  className={` cursor-pointer hover:bg-green-50/70 dark:hover:bg-slate-700/70 transition-all border-b border-green-50 dark:border-slate-700 ${
                    !patient.isActive ? "opacity-60" : ""
                  }`}
                >
                  <TableCell className="font-medium text-gray-700 dark:text-gray-300 text-start">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-green-800 dark:text-green-400 text-start">
                    {patient.name}
                  </TableCell>
                  <TableCell className="font-mono text-gray-600 dark:text-gray-400 text-start">
                    {patient.phone}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300 text-start">
                    {patient.age}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700 dark:text-gray-300 text-start">
                    {patient.gender}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-start">
                    {patient.statusLabel && (
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{
                          backgroundColor: patient.statusColor || "#10b981",
                        }}
                      >
                        {patient.statusLabel}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700 dark:text-gray-300 text-start">
                    {formatDate(patient.createdAt)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-start">
                    <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                      {patient.templateName}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex justify-center">
                      <button className="rounded-full p-1.5 text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20 transition-all">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                  >
                    <SearchIcon className="h-12 w-12 mb-2 opacity-20" />
                    <p className="text-lg font-medium">{t("noPatients")}</p>
                    <p className="text-sm">{t("tryChangingSearch")}</p>
                  </motion.div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

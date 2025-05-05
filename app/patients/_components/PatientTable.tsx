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
import { formatDate } from "../../_utils/utils";
import { ArrowUpDown, Eye, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
  const { t, isRTL } = useLanguage();

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
              <TableHead
                className="font-bold text-green-800 dark:text-green-300 cursor-pointer text-start"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  {t("name")}
                  <ArrowUpDown className="mx-2 h-4 w-4" />
                  {sortField === "name" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 text-start">
                {t("phoneTranslate")}
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 text-start">
                {t("age")}
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell text-start">
                {t("gender")}
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell text-start">
                {t("patientStatus")}
              </TableHead>
              <TableHead
                className="font-bold text-green-800 dark:text-green-300 cursor-pointer hidden md:table-cell text-start"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  {t("added")}
                  <ArrowUpDown className="mx-2 h-4 w-4" />
                  {sortField === "createdAt" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell text-start">
                {t("template")}
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

export default PatientTable;

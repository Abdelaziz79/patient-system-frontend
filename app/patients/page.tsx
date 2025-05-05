"use client";

import MobilePatientCard from "@/app/patients/_components/MobilePatientCard";
import PatientTable, {
  PatientDisplayItem,
} from "@/app/patients/_components/PatientTable";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import useMobileView from "@/app/_hooks/useMobileView";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import { IPatient } from "@/app/_types/Patient";
import { calculateAge } from "@/app/_utils/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FilterIcon,
  Loader2,
  SearchIcon,
  UserPlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PatientsPage() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<
    PatientDisplayItem[]
  >([]);
  const [sortField, setSortField] = useState<keyof PatientDisplayItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { isMobileView } = useMobileView();

  const {
    patients,
    isLoading,
    total,
    pages,
    page,
    setPage,
    limit,
    setLimit,
    performSearch,
    refetch,
  } = usePatient({
    initialPage: currentPage,
    initialLimit: itemsPerPage,
    initialSortBy: sortField,
    initialSortDir: sortDirection,
  });
  console.log(patients);
  // Transform patients data into the format needed for the PatientTable
  useEffect(() => {
    if (patients && patients.length > 0) {
      const transformedPatients = patients.map((patient: IPatient) => {
        // Get name from personalInfo instead of sectionData.personalinfo
        const fullName = patient.personalInfo
          ? `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`
          : t("unknown");

        // Calculate age from date string safely
        let ageValue = t("notAvailable");
        if (patient.personalInfo?.dateOfBirth) {
          try {
            ageValue = calculateAge(String(patient.personalInfo.dateOfBirth));
          } catch (error) {
            console.error("Error calculating age:", error);
          }
        }

        return {
          id: patient.id,
          name: fullName,
          phone: patient.personalInfo?.contactNumber || t("notAvailable"),
          createdAt: patient.createdAt,
          age: ageValue,
          gender: patient.personalInfo?.gender || t("notAvailable"),
          templateName: patient.templateId?.name || t("default"),
          createdByName: patient.createdBy?.name || t("notAvailable"),
          fileNumber: patient.personalInfo?.medicalRecordNumber || "",
          statusColor: patient.status?.color,
          statusLabel: patient.status?.label,
          tags: patient.tags,
          adminId: patient.adminId,
          isActive: patient.isActive,
        };
      });
      setFilteredPatients(transformedPatients);
    } else {
      setFilteredPatients([]);
    }
  }, [patients, t]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      refetch();
    } else {
      const fetchSearchResults = async () => {
        const results = await performSearch({ query: searchQuery });
        if (results && results.data) {
          const transformedResults = results.data.map((patient: IPatient) => {
            // Get name from personalInfo instead of sectionData.personalinfo
            const fullName = patient.personalInfo
              ? `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`
              : t("unknown");

            // Calculate age from date string safely
            let ageValue = t("notAvailable");
            if (patient.personalInfo?.dateOfBirth) {
              try {
                ageValue = calculateAge(
                  String(patient.personalInfo.dateOfBirth)
                );
              } catch (error) {
                console.error("Error calculating age:", error);
              }
            }

            return {
              id: patient.id,
              name: fullName,
              phone: patient.personalInfo?.contactNumber || t("notAvailable"),
              createdAt: patient.createdAt,
              age: ageValue,
              gender: patient.personalInfo?.gender || t("notAvailable"),
              templateName: patient.templateId?.name || t("default"),
              createdByName: patient.createdBy?.name || t("notAvailable"),
              fileNumber: patient.personalInfo?.medicalRecordNumber || "",
              statusColor: patient.status?.color,
              statusLabel: patient.status?.label,
              tags: patient.tags,
              adminId: patient.adminId,
              isActive: patient.isActive,
            };
          });
          setFilteredPatients(transformedResults);
        }
      };

      // Debounce search requests
      const timer = setTimeout(() => {
        fetchSearchResults();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchQuery, refetch, performSearch, t]);

  // Update pagination
  useEffect(() => {
    setPage(currentPage);
    setLimit(itemsPerPage);
  }, [currentPage, itemsPerPage, setPage, setLimit]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddPatient = () => {
    router.push("/patients/add-patient");
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-green-100 dark:border-green-900 shadow-xl">
            <CardHeader className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                    {t("patientsList")}
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400 mt-1 text-sm">
                    {t("managePatientRecords")}
                  </CardDescription>
                </div>
                <Button
                  onClick={handleAddPatient}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-700 dark:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <UserPlusIcon className="mx-2 h-4 w-4" />
                  <span>{t("addPatient")}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                  <Input
                    placeholder={t("searchForPatient")}
                    className="px-10 focus:ring-green-500 focus:border-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="relative sm:w-1/4">
                  <div className="relative">
                    <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                    <select
                      className="w-full rounded-md border px-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none"
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      value={itemsPerPage}
                    >
                      <option value={5}>5 {t("perPage")}</option>
                      <option value={10}>10 {t("perPage")}</option>
                      <option value={25}>25 {t("perPage")}</option>
                      <option value={50}>50 {t("perPage")}</option>
                    </select>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <>
                  {/* Mobile View - Card Layout */}
                  {isMobileView ? (
                    <div className="space-y-1">
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient, index) => (
                          <MobilePatientCard
                            key={patient.id}
                            patient={patient}
                            index={index}
                          />
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center"
                        >
                          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <SearchIcon className="h-12 w-12 mb-2 opacity-20" />
                            <p className="text-lg font-medium">
                              {t("noPatients")}
                            </p>
                            <p className="text-sm">{t("tryChangingSearch")}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    /* Desktop View - Table Layout */
                    <PatientTable
                      filteredPatients={filteredPatients}
                      setSortDirection={setSortDirection}
                      setSortField={setSortField}
                      sortDirection={sortDirection}
                      sortField={sortField}
                    />
                  )}

                  {/* Pagination */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t("showing")}{" "}
                      {filteredPatients.length > 0
                        ? (currentPage - 1) * itemsPerPage + 1
                        : 0}{" "}
                      - {Math.min(currentPage * itemsPerPage, total)} {t("of")}{" "}
                      {total} {t("patientsLabel")}
                    </div>

                    <div
                      className={`flex items-center ${
                        isRTL ? "gap-x-reverse" : "gap-x-2"
                      }`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevPage}
                        disabled={currentPage <= 1}
                        className="h-8 w-8 p-0 border-green-100 dark:border-green-900 focus:ring-green-500 dark:focus:ring-green-700"
                      >
                        {isRTL ? (
                          <ChevronRight className="h-4 w-4" />
                        ) : (
                          <ChevronLeft className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="text-sm">
                        {t("page")} {currentPage} {t("of")} {pages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage >= pages}
                        className="h-8 w-8 p-0 border-green-100 dark:border-green-900 focus:ring-green-500 dark:focus:ring-green-700"
                      >
                        {isRTL ? (
                          <ChevronLeft className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

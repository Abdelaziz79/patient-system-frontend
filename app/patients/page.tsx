"use client";

import MobilePatientCard from "@/app/_components/MobilePatientCard";
import PatientTable from "@/app/_components/PatientTable";
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
  FilterIcon,
  Loader2,
  SearchIcon,
  UserPlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mockPatients } from "./mock-data";

// Define patient interface for list view
export interface PatientListItem {
  id: string;
  name: string;
  age: string;
  gender: string;
  bloodType: string;
  phone: string;
  insuranceProvider: string;
  lastVisit: string;
  fileNumber: string;
  diagnosis?: string;
}

export default function PatientsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientListItem[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [insuranceFilter, setInsuranceFilter] = useState("");
  const [sortField, setSortField] = useState<keyof PatientListItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Check for mobile view
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    checkMobileView();

    // Add resize listener
    window.addEventListener("resize", checkMobileView);

    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  useEffect(() => {
    // Simulate API call to fetch patients
    setIsLoading(true);
    setTimeout(() => {
      setPatients(mockPatients);
      setFilteredPatients(mockPatients);
      setIsLoading(false);
    }, 0);
  }, []);

  // Filter and sort patients
  useEffect(() => {
    let result = [...patients];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.phone.includes(searchQuery) ||
          patient.fileNumber.includes(searchQuery)
      );
    }

    // Apply insurance filter
    if (insuranceFilter) {
      result = result.filter(
        (patient) => patient.insuranceProvider === insuranceFilter
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const valueA = a[sortField]?.toString().toLowerCase() || "";
      const valueB = b[sortField]?.toString().toLowerCase() || "";

      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

    setFilteredPatients(result);
  }, [searchQuery, insuranceFilter, patients, sortField, sortDirection]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInsuranceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInsuranceFilter(e.target.value);
  };

  const handleAddPatient = () => {
    router.push("/patients/add-patient");
  };

  // Get unique insurance providers for filter dropdown
  const insuranceProviders = Array.from(
    new Set(patients.map((patient) => patient.insuranceProvider))
  ).sort();

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
                  <CardTitle className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">
                    Patients List
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400 mt-1 text-sm">
                    Manage patient records in your medical facility
                  </CardDescription>
                </div>
                <Button
                  onClick={handleAddPatient}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all duration-200"
                >
                  <UserPlusIcon className="mr-2 h-4 w-4" />
                  <span>Add Patient</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                  <Input
                    placeholder="Search for a patient..."
                    className="pl-10 focus:ring-green-500 focus:border-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="relative sm:w-1/4">
                  <div className="relative">
                    <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                    <select
                      className="w-full rounded-md border pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none"
                      value={insuranceFilter}
                      onChange={handleInsuranceChange}
                    >
                      <option value="">All Insurance Providers</option>
                      {insuranceProviders.map((provider) => (
                        <option key={provider} value={provider}>
                          {provider}
                        </option>
                      ))}
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
                            key={index}
                            patient={patient}
                            index={index}
                          />
                        ))
                      ) : (
                        <div className="rounded-lg border dark:border-gray-700 p-8 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <SearchIcon className="h-12 w-12 mb-2 opacity-20" />
                            <p className="text-lg font-medium">
                              No patients found
                            </p>
                            <p className="text-sm">
                              Try changing your search criteria or add new
                              patients
                            </p>
                          </div>
                        </div>
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
                  <div className="mt-4 text-right text-sm text-gray-500 dark:text-gray-400">
                    Total patients:{" "}
                    <span className="font-medium">
                      {filteredPatients.length}
                    </span>{" "}
                    of <span className="font-medium">{patients.length}</span>
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

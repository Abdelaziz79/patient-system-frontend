"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  FilterIcon,
  Loader2,
  SearchIcon,
  UserPlusIcon,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define patient interface
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  phone: string;
  insuranceProvider: string;
  lastVisit: string;
  fileNumber: string;
}

export default function PatientsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [insuranceFilter, setInsuranceFilter] = useState("");
  const [sortField, setSortField] = useState<keyof Patient>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    // Simulate API call to fetch patients
    setIsLoading(true);
    setTimeout(() => {
      // Mock data - in a real application, you would fetch this from your API
      const mockPatients: Patient[] = [
        {
          id: "1",
          name: "خالد محمد ",
          age: 45,
          gender: "ذكر",
          bloodType: "A+",
          phone: "0501234567",
          insuranceProvider: "التعاونية للتأمين",
          lastVisit: "2025-02-15",
          fileNumber: "P-10045",
        },
        {
          id: "2",
          name: "فاطمة أحمد ",
          age: 32,
          gender: "أنثى",
          bloodType: "O-",
          phone: "0507654321",
          insuranceProvider: "بوبا العربية",
          lastVisit: "2025-02-28",
          fileNumber: "P-10046",
        },
        {
          id: "3",
          name: "عبدالله سعيد ",
          age: 68,
          gender: "ذكر",
          bloodType: "B+",
          phone: "0553219876",
          insuranceProvider: "ميدغلف",
          lastVisit: "2025-01-20",
          fileNumber: "P-10047",
        },
        {
          id: "4",
          name: "نورة خالد ",
          age: 29,
          gender: "أنثى",
          bloodType: "AB+",
          phone: "0568765432",
          insuranceProvider: "تكافل الراجحي",
          lastVisit: "2025-03-01",
          fileNumber: "P-10048",
        },
        {
          id: "5",
          name: "سلطان ناصر ",
          age: 52,
          gender: "ذكر",
          bloodType: "O+",
          phone: "0512345678",
          insuranceProvider: "التعاونية للتأمين",
          lastVisit: "2025-02-05",
          fileNumber: "P-10049",
        },
        {
          id: "6",
          name: "ليلى محمد ",
          age: 41,
          gender: "أنثى",
          bloodType: "A-",
          phone: "0523456789",
          insuranceProvider: "بوبا العربية",
          lastVisit: "2025-02-10",
          fileNumber: "P-10050",
        },
        {
          id: "7",
          name: "خالد عبدالرحمن ",
          age: 35,
          gender: "ذكر",
          bloodType: "B-",
          phone: "0534567890",
          insuranceProvider: "ميدغلف",
          lastVisit: "2025-01-15",
          fileNumber: "P-10051",
        },
        {
          id: "8",
          name: "سارة أحمد ",
          age: 27,
          gender: "أنثى",
          bloodType: "AB-",
          phone: "0545678901",
          insuranceProvider: "تكافل الراجحي",
          lastVisit: "2025-02-22",
          fileNumber: "P-10052",
        },
      ];

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
          patient.name.includes(searchQuery) ||
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
        return valueA.localeCompare(valueB, "ar");
      } else {
        return valueB.localeCompare(valueA, "ar");
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

  const handlePatientClick = (id: string) => {
    router.push(`/patients/${id}`);
  };

  const handleSort = (field: keyof Patient) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get unique insurance providers for filter dropdown
  const insuranceProviders = Array.from(
    new Set(patients.map((patient) => patient.insuranceProvider))
  ).sort((a, b) => a.localeCompare(b, "ar"));

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA");
  };

  return (
    <div
      className="min-h-screen  dark:from-slate-900 dark:to-slate-800"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-green-100 dark:border-green-900 shadow-xl">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-300">
                    قائمة المرضى
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400 mt-1">
                    إدارة ملفات المرضى في المنشأة الطبية
                  </CardDescription>
                </div>
                <Button
                  onClick={handleAddPatient}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all duration-200"
                >
                  <UserPlusIcon className="ml-2 h-4 w-4" />
                  <span>إضافة مريض</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                  <Input
                    placeholder="البحث عن مريض (الاسم، رقم الهاتف، رقم الملف)..."
                    className="text-right pr-10 focus:ring-green-500 focus:border-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="relative md:w-1/4">
                  <div className="relative">
                    <FilterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                    <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                    <select
                      className="w-full rounded-md border text-right pr-10 pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none"
                      value={insuranceFilter}
                      onChange={handleInsuranceChange}
                    >
                      <option value="">جميع شركات التأمين</option>
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
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <>
                  <div className="rounded-md border dark:border-gray-700 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-green-50 dark:bg-slate-700">
                        <TableRow>
                          <TableHead className="text-right font-bold text-green-800 dark:text-green-300 w-12">
                            #
                          </TableHead>
                          <TableHead className="text-right font-bold text-green-800 dark:text-green-300 w-24">
                            رقم الملف
                          </TableHead>
                          <TableHead
                            className="text-right font-bold text-green-800 dark:text-green-300 cursor-pointer"
                            onClick={() => handleSort("name")}
                          >
                            <div className="flex items-center justify-end">
                              اسم المريض
                              <ArrowUpDown className="mr-2 h-4 w-4" />
                              {sortField === "name" && (
                                <span className="mr-1 text-xs">
                                  {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </TableHead>
                          <TableHead className="text-right font-bold text-green-800 dark:text-green-300">
                            العمر
                          </TableHead>
                          <TableHead className="text-right font-bold text-green-800 dark:text-green-300 hidden md:table-cell">
                            الجنس
                          </TableHead>
                          <TableHead className="text-right font-bold text-green-800 dark:text-green-300 hidden md:table-cell">
                            فصيلة الدم
                          </TableHead>
                          <TableHead
                            className="text-right font-bold text-green-800 dark:text-green-300 hidden md:table-cell cursor-pointer"
                            onClick={() => handleSort("insuranceProvider")}
                          >
                            <div className="flex items-center justify-end">
                              شركة التأمين
                              <ArrowUpDown className="mr-2 h-4 w-4" />
                              {sortField === "insuranceProvider" && (
                                <span className="mr-1 text-xs">
                                  {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </TableHead>
                          <TableHead
                            className="text-right font-bold text-green-800 dark:text-green-300 cursor-pointer"
                            onClick={() => handleSort("lastVisit")}
                          >
                            <div className="flex items-center justify-end">
                              آخر زيارة
                              <ArrowUpDown className="mr-2 h-4 w-4" />
                              {sortField === "lastVisit" && (
                                <span className="mr-1 text-xs">
                                  {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </TableHead>
                          <TableHead className="text-right font-bold text-green-800 dark:text-green-300">
                            رقم الهاتف
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
                              <TableCell className="font-medium text-right">
                                {index + 1}
                              </TableCell>
                              <TableCell className="font-medium text-right">
                                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                                  {patient.fileNumber}
                                </span>
                              </TableCell>
                              <TableCell className="font-medium text-right">
                                {patient.name}
                              </TableCell>
                              <TableCell className="text-right">
                                {patient.age}
                              </TableCell>
                              <TableCell className="text-right hidden md:table-cell">
                                {patient.gender}
                              </TableCell>
                              <TableCell className="text-right hidden md:table-cell">
                                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                                  {patient.bloodType}
                                </span>
                              </TableCell>
                              <TableCell className="text-right hidden md:table-cell">
                                {patient.insuranceProvider}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatDate(patient.lastVisit)}
                              </TableCell>
                              <TableCell className="text-left ltr:text-left rtl:text-right font-mono">
                                {patient.phone}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={9} className="h-32 text-center">
                              <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                <SearchIcon className="h-12 w-12 mb-2 opacity-20" />
                                <p className="text-lg font-medium">
                                  لم يتم العثور على أي مرضى
                                </p>
                                <p className="text-sm">
                                  حاول تغيير معايير البحث أو إضافة مرضى جدد
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 text-right text-sm text-gray-500 dark:text-gray-400">
                    إجمالي المرضى:{" "}
                    <span className="font-medium">
                      {filteredPatients.length}
                    </span>{" "}
                    من أصل{" "}
                    <span className="font-medium">{patients.length}</span>
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

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
  Bookmark,
  ChevronDown,
  FilterIcon,
  Loader2,
  Menu,
  Phone,
  SearchIcon,
  UserPlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define doctor interface
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  position: string;
  phone: string;
}

export default function DoctorsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [sortField, setSortField] = useState<keyof Doctor>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Check for mobile view on mount and window resize
    const checkForMobileView = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    // Initial check
    checkForMobileView();

    // Add resize listener
    window.addEventListener("resize", checkForMobileView);

    // Clean up
    return () => window.removeEventListener("resize", checkForMobileView);
  }, []);

  useEffect(() => {
    // Simulate API call to fetch doctors
    setIsLoading(true);
    setTimeout(() => {
      // Mock data - in a real application, you would fetch this from your API
      const mockDoctors: Doctor[] = [
        {
          id: "1",
          name: "د. محمد مرضي الحضري",
          specialty: "أمراض القلب",
          department: "قسم أمراض القلب",
          position: "استشاري",
          phone: "0501234567",
        },
        {
          id: "2",
          name: "د. فاطمة علي العتيبي",
          specialty: "طب الأطفال",
          department: "قسم الأطفال",
          position: "أخصائي",
          phone: "0507654321",
        },
        {
          id: "3",
          name: "د. عبدالله خالد الحربي",
          specialty: "الأعصاب",
          department: "قسم الأعصاب",
          position: "استشاري",
          phone: "0553219876",
        },
        {
          id: "4",
          name: "د. نورة سعيد القحطاني",
          specialty: "النساء والتوليد",
          department: "قسم النساء والتوليد",
          position: "استشاري",
          phone: "0568765432",
        },
        {
          id: "5",
          name: "د. سلطان ناصر الدوسري",
          specialty: "العظام",
          department: "قسم العظام",
          position: "أخصائي",
          phone: "0512345678",
        },
        {
          id: "6",
          name: "د. ليلى محمد العنزي",
          specialty: "الجلدية",
          department: "قسم الجلدية",
          position: "طبيب مقيم",
          phone: "0523456789",
        },
        {
          id: "7",
          name: "د. خالد عبدالرحمن الغامدي",
          specialty: "العيون",
          department: "قسم العيون",
          position: "استشاري",
          phone: "0534567890",
        },
        {
          id: "8",
          name: "د. سارة أحمد المالكي",
          specialty: "الأنف والأذن والحنجرة",
          department: "قسم الأنف والأذن والحنجرة",
          position: "أخصائي",
          phone: "0545678901",
        },
      ];

      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors);
      setIsLoading(false);
    }, 0);
  }, []);

  // Filter and sort doctors
  useEffect(() => {
    let result = [...doctors];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (doctor) =>
          doctor.name.includes(searchQuery) ||
          doctor.department.includes(searchQuery) ||
          doctor.specialty.includes(searchQuery) ||
          doctor.phone.includes(searchQuery)
      );
    }

    // Apply specialty filter
    if (specialty) {
      result = result.filter((doctor) => doctor.specialty === specialty);
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

    setFilteredDoctors(result);
  }, [searchQuery, specialty, doctors, sortField, sortDirection]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpecialty(e.target.value);
  };

  const handleAddDoctor = () => {
    router.push("/doctors/add-doctor");
  };

  const handleDoctorClick = (id: string) => {
    router.push(`/doctors/${id}`);
  };

  const handleSort = (field: keyof Doctor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get unique specialties for filter dropdown
  const specialties = Array.from(
    new Set(doctors.map((doctor) => doctor.specialty))
  ).sort((a, b) => a.localeCompare(b, "ar"));

  // Render card view for mobile
  const renderMobileCards = () => {
    if (filteredDoctors.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-12">
          <SearchIcon className="h-12 w-12 mb-2 opacity-20" />
          <p className="text-lg font-medium">لم يتم العثور على أي أطباء</p>
          <p className="text-sm">حاول تغيير معايير البحث أو إضافة أطباء جدد</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {filteredDoctors.map((doctor, index) => (
          <Card
            key={doctor.id}
            className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors dark:border-gray-700 dark:bg-slate-800"
            onClick={() => handleDoctorClick(doctor.id)}
          >
            <CardContent className="p-4  ">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <p className="font-bold text-blue-800 dark:text-blue-300 text-lg">
                      {doctor.name}
                    </p>
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium mt-1 w-fit">
                      {doctor.specialty}
                    </span>
                  </div>
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    {index + 1}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Menu className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {doctor.department}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-blue-500" />
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doctor.position === "استشاري"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                          : doctor.position === "أخصائي"
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {doctor.position}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {doctor.phone}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-300">
                    قائمة الأطباء
                  </CardTitle>
                  <CardDescription className="text-blue-600 dark:text-blue-400 mt-1 text-sm">
                    إدارة بيانات الأطباء في المنشأة الطبية
                  </CardDescription>
                </div>
                <Button
                  onClick={handleAddDoctor}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-all duration-200 w-full sm:w-auto"
                >
                  <UserPlusIcon className="ml-2 h-4 w-4" />
                  <span>إضافة طبيب</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                  <Input
                    placeholder="البحث عن طبيب..."
                    className="text-right pr-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="relative w-full sm:w-1/4">
                  <div className="relative">
                    <FilterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <select
                      className="w-full rounded-md border text-right pr-10 pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none"
                      value={specialty}
                      onChange={handleSpecialtyChange}
                    >
                      <option value="">جميع التخصصات</option>
                      {specialties.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  {isMobileView && renderMobileCards()}

                  {/* Table View for larger screens */}
                  {!isMobileView && (
                    <div className="rounded-md border dark:border-gray-700 overflow-hidden overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-blue-50 dark:bg-slate-700">
                          <TableRow>
                            <TableHead className="text-right font-bold text-blue-800 dark:text-blue-300 w-12">
                              #
                            </TableHead>
                            <TableHead
                              className="text-right font-bold text-blue-800 dark:text-blue-300 cursor-pointer"
                              onClick={() => handleSort("name")}
                            >
                              <div className="flex items-center justify-end">
                                اسم الطبيب
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                {sortField === "name" && (
                                  <span className="mr-1 text-xs">
                                    {sortDirection === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </div>
                            </TableHead>
                            <TableHead
                              className="text-right font-bold text-blue-800 dark:text-blue-300 cursor-pointer"
                              onClick={() => handleSort("specialty")}
                            >
                              <div className="flex items-center justify-end">
                                التخصص
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                {sortField === "specialty" && (
                                  <span className="mr-1 text-xs">
                                    {sortDirection === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </div>
                            </TableHead>
                            <TableHead
                              className="text-right font-bold text-blue-800 dark:text-blue-300 hidden md:table-cell cursor-pointer"
                              onClick={() => handleSort("department")}
                            >
                              <div className="flex items-center justify-end">
                                القسم
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                {sortField === "department" && (
                                  <span className="mr-1 text-xs">
                                    {sortDirection === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </div>
                            </TableHead>
                            <TableHead
                              className="text-right font-bold text-blue-800 dark:text-blue-300 hidden md:table-cell cursor-pointer"
                              onClick={() => handleSort("position")}
                            >
                              <div className="flex items-center justify-end">
                                المنصب
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                {sortField === "position" && (
                                  <span className="mr-1 text-xs">
                                    {sortDirection === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-blue-800 dark:text-blue-300">
                              رقم الهاتف
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor, index) => (
                              <TableRow
                                key={doctor.id}
                                onClick={() => handleDoctorClick(doctor.id)}
                                className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                              >
                                <TableCell className="font-medium text-right">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="font-medium text-right">
                                  {doctor.name}
                                </TableCell>
                                <TableCell className="text-right">
                                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                                    {doctor.specialty}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right hidden md:table-cell">
                                  {doctor.department}
                                </TableCell>
                                <TableCell className="text-right hidden md:table-cell">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      doctor.position === "استشاري"
                                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                        : doctor.position === "أخصائي"
                                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                    }`}
                                  >
                                    {doctor.position}
                                  </span>
                                </TableCell>
                                <TableCell className="text-left ltr:text-left rtl:text-right font-mono">
                                  {doctor.phone}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="h-32 text-center"
                              >
                                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                  <SearchIcon className="h-12 w-12 mb-2 opacity-20" />
                                  <p className="text-lg font-medium">
                                    لم يتم العثور على أي أطباء
                                  </p>
                                  <p className="text-sm">
                                    حاول تغيير معايير البحث أو إضافة أطباء جدد
                                  </p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  <div className="mt-4 text-right text-sm text-gray-500 dark:text-gray-400">
                    إجمالي الأطباء:{" "}
                    <span className="font-medium">
                      {filteredDoctors.length}
                    </span>{" "}
                    من أصل <span className="font-medium">{doctors.length}</span>
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

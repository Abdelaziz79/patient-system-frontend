"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ActivityIcon,
  CalendarIcon,
  ChartBarIcon,
  ChartPieIcon,
  ListIcon,
  UserPlusIcon,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define doctor count interface
interface SpecialtyCount {
  specialty: string;
  count: number;
  color: string;
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [specialtyCounts, setSpecialtyCounts] = useState<SpecialtyCount[]>([]);
  const [totalDoctors, setTotalDoctors] = useState(0);

  useEffect(() => {
    // Simulate API call to fetch doctors count by specialty
    setIsLoading(true);
    setTimeout(() => {
      // Mock data - in a real application, you would fetch this from your API
      const mockSpecialtyCounts: SpecialtyCount[] = [
        { specialty: "أمراض القلب", count: 12, color: "bg-red-500" },
        { specialty: "طب الأطفال", count: 8, color: "bg-blue-500" },
        { specialty: "الأعصاب", count: 6, color: "bg-purple-500" },
        { specialty: "النساء والتوليد", count: 10, color: "bg-pink-500" },
        { specialty: "العظام", count: 7, color: "bg-yellow-500" },
        { specialty: "الجلدية", count: 5, color: "bg-green-500" },
        { specialty: "العيون", count: 9, color: "bg-indigo-500" },
        {
          specialty: "الأنف والأذن والحنجرة",
          count: 4,
          color: "bg-orange-500",
        },
      ];

      setSpecialtyCounts(mockSpecialtyCounts);
      setTotalDoctors(
        mockSpecialtyCounts.reduce((sum, item) => sum + item.count, 0)
      );
      setIsLoading(false);
    }, 0);
  }, []);

  const handleAddDoctor = () => {
    router.push("/add-doctor");
  };

  const handleViewDoctors = () => {
    router.push("/doctors");
  };

  return (
    <div className="flex items-center justify-center p-4 py-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-6xl"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">
            لوحة التحكم
          </h1>
          <p className="text-blue-600 dark:text-blue-400">
            إدارة الأطباء والمنشأة الطبية
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                إجمالي الأطباء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-800 dark:text-blue-300">
                  {isLoading ? "-" : totalDoctors}
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                التخصصات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-800 dark:text-blue-300">
                  {isLoading ? "-" : specialtyCounts.length}
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                  <ChartPieIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                المواعيد اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-800 dark:text-blue-300">
                  42
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                  <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Actions */}
          <div className="space-y-4">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-800 dark:text-blue-300">
                  الإجراءات السريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-all duration-200"
                  onClick={handleAddDoctor}
                >
                  <UserPlusIcon className="ml-2 h-5 w-5" />
                  <span>إضافة طبيب جديد</span>
                </Button>
                <Button
                  className="w-full justify-start bg-blue-50 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-blue-800 dark:text-blue-300 transition-all duration-200"
                  variant="outline"
                  onClick={handleViewDoctors}
                >
                  <ListIcon className="ml-2 h-5 w-5" />
                  <span>عرض قائمة الأطباء</span>
                </Button>
                <Button
                  className="w-full justify-start bg-blue-50 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-blue-800 dark:text-blue-300 transition-all duration-200"
                  variant="outline"
                >
                  <CalendarIcon className="ml-2 h-5 w-5" />
                  <span>جدولة المواعيد</span>
                </Button>
                <Button
                  className="w-full justify-start bg-blue-50 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-blue-800 dark:text-blue-300 transition-all duration-200"
                  variant="outline"
                >
                  <ChartBarIcon className="ml-2 h-5 w-5" />
                  <span>التقارير والإحصائيات</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-800 dark:text-blue-300">
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <UserPlusIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">تمت إضافة طبيب جديد</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      د. خالد عبدالرحمن - قبل 35 دقيقة
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <ActivityIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">تحديث بيانات طبيب</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      د. محمد أحمد - قبل ساعتين
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                    <CalendarIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      تم تحديد 8 مواعيد جديدة
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      قسم أمراض القلب - اليوم
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="link"
                  className="w-full text-blue-600 dark:text-blue-400"
                >
                  عرض كل الأنشطة
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Specialty Distribution */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-lg md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-800 dark:text-blue-300">
                توزيع الأطباء حسب التخصص
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {specialtyCounts.map((item) => (
                    <div key={item.specialty} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium dark:text-gray-200">
                          {item.specialty}
                        </span>
                        <span className="text-sm font-medium dark:text-gray-300">
                          {item.count} طبيب
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`${item.color} h-2.5 rounded-full`}
                          style={{
                            width: `${(item.count / totalDoctors) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-all duration-200"
                onClick={handleViewDoctors}
              >
                <ListIcon className="ml-2 h-4 w-4" />
                <span>عرض جميع الأطباء</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

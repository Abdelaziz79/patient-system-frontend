// app/doctor/[id]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BadgeIcon,
  BookIcon,
  CalendarIcon,
  ClipboardEditIcon,
  ClockIcon,
  GraduationCapIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  ArrowLeftIcon,
  BuildingIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

// Define doctor data interface
interface DoctorData {
  id: string;
  name: string;
  employeeId: string;
  specialty: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  qualification: string;
  graduationYear: string;
  university: string;
  licenseNumber: string;
  licenseExpiry: string;
  department: string;
  position: string;
  yearsOfExperience: string;
  biography: string;
  specialInterests: string;
  workDays: string[];
  clinicLocation: string;
  morningShiftStart: string;
  morningShiftEnd: string;
  eveningShiftStart: string;
  eveningShiftEnd: string;
  appointmentDuration: string;
  maxAppointmentsPerDay: string;
  scheduleNotes: string;
}

export default function DoctorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [doctor, setDoctor] = useState<DoctorData | null>(null);

  useEffect(() => {
    // Simulate API call to fetch doctor data
    setIsLoading(true);
    setTimeout(() => {
      // Mock data - in a real application, you would fetch this from your API
      const mockDoctor: DoctorData = {
        id,
        name: "د. محمد مرضي الحضري",
        employeeId: "DR-" + id,
        specialty: "أمراض القلب",
        gender: "ذكر",
        phone: "0501234567",
        email: "dr.mohammed@hospital.com",
        address: "الرياض - حي الملز - شارع الملك عبد العزيز",
        qualification: "بورد",
        graduationYear: "2010",
        university: "جامعة الملك سعود",
        licenseNumber: "LIC-" + id + "589",
        licenseExpiry: "2026-12-31",
        department: "قسم أمراض القلب",
        position: "استشاري",
        yearsOfExperience: "15",
        biography:
          "طبيب جراح قلوب الناس اداويها ,استشاري أمراض القلب مع خبرة تزيد عن 15 عامًا في مجال طب القلب التداخلي وعلاج أمراض الشرايين التاجية. حاصل على البورد الأمريكي والعربي في أمراض القلب.",
        specialInterests:
          "القسطرة القلبية، الدعامات القلبية، تخطيط صدى القلب المتقدم، علاج هبوط عضلة القلب",
        workDays: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء"],
        clinicLocation: "المبنى الرئيسي",
        morningShiftStart: "09:00",
        morningShiftEnd: "13:00",
        eveningShiftStart: "16:00",
        eveningShiftEnd: "20:00",
        appointmentDuration: "15",
        maxAppointmentsPerDay: "20",
        scheduleNotes:
          "لا يعمل خلال فترة الإجازات الرسمية. المواعيد الطارئة متاحة يوم الأحد صباحًا فقط.",
      };

      setDoctor(mockDoctor);
      setIsLoading(false);
    }, 0);
  }, [id]);

  const handleEdit = () => {
    // Navigate to edit page
    router.push(`/edit-doctor/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">
              لم يتم العثور على الطبيب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              الطبيب المطلوب غير موجود أو تم حذفه
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBack} className="w-full">
              <ArrowLeftIcon className="ml-2 h-4 w-4" />
              العودة
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Helper function to render information item with RTL support
  const InfoItem = ({
    icon: Icon,
    label,
    value,
    fullWidth = false,
  }: {
    icon: React.ElementType;
    label: string;
    value: string;
    fullWidth?: boolean;
  }) => (
    <div
      className={`p-4 bg-blue-50 dark:bg-slate-700 rounded-lg ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-center mb-2">
        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400 ml-2" />
        <span className="font-semibold dark:text-gray-200">{label}</span>
      </div>
      <p className="text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  );

  return (
    <div className="flex items-center justify-center p-4 py-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-5xl"
      >
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                  {doctor.name}
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  {doctor.specialty} - {doctor.position}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center"
              >
                <ArrowLeftIcon className="ml-2 h-4 w-4" />
                <span>العودة</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Profile Summary Section */}
            <div className="p-4 bg-blue-100/50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center mb-4">
                <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 ml-2" />
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">
                  نبذة عن الطبيب
                </h3>
              </div>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {doctor.biography}
              </p>
            </div>

            {/* Basic Information Section */}
            <div>
              <div className="flex items-center mb-4">
                <BadgeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 ml-2" />
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">
                  المعلومات الأساسية
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={UserIcon}
                  label="اسم الطبيب"
                  value={doctor.name}
                />
                <InfoItem
                  icon={BadgeIcon}
                  label="الرقم الوظيفي"
                  value={doctor.employeeId}
                />
                <InfoItem
                  icon={BookIcon}
                  label="التخصص"
                  value={doctor.specialty}
                />
                <InfoItem icon={UserIcon} label="الجنس" value={doctor.gender} />
                <InfoItem
                  icon={PhoneIcon}
                  label="رقم الهاتف"
                  value={doctor.phone}
                />
                <InfoItem
                  icon={MailIcon}
                  label="البريد الإلكتروني"
                  value={doctor.email}
                />
                <InfoItem
                  icon={MapPinIcon}
                  label="العنوان"
                  value={doctor.address}
                  fullWidth={true}
                />
              </div>
            </div>

            {/* Professional Information Section */}
            <div>
              <div className="flex items-center mb-4">
                <GraduationCapIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 ml-2" />
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">
                  المعلومات المهنية
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={GraduationCapIcon}
                  label="المؤهل العلمي"
                  value={doctor.qualification}
                />
                <InfoItem
                  icon={CalendarIcon}
                  label="سنة التخرج"
                  value={doctor.graduationYear}
                />
                <InfoItem
                  icon={BuildingIcon}
                  label="الجامعة"
                  value={doctor.university}
                />
                <InfoItem
                  icon={BadgeIcon}
                  label="رقم الترخيص المهني"
                  value={doctor.licenseNumber}
                />
                <InfoItem
                  icon={CalendarIcon}
                  label="تاريخ انتهاء الترخيص"
                  value={doctor.licenseExpiry}
                />
                <InfoItem
                  icon={UsersIcon}
                  label="القسم"
                  value={doctor.department}
                />
                <InfoItem
                  icon={BadgeIcon}
                  label="المنصب"
                  value={doctor.position}
                />
                <InfoItem
                  icon={CalendarIcon}
                  label="سنوات الخبرة"
                  value={`${doctor.yearsOfExperience} سنة`}
                />
                <InfoItem
                  icon={BookIcon}
                  label="الاهتمامات الخاصة"
                  value={doctor.specialInterests}
                  fullWidth={true}
                />
              </div>
            </div>

            {/* Schedule Section */}
            <div>
              <div className="flex items-center mb-4">
                <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 ml-2" />
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">
                  جدول المواعيد
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={CalendarIcon}
                  label="أيام العمل"
                  value={doctor.workDays.join(" - ")}
                />
                <InfoItem
                  icon={MapPinIcon}
                  label="موقع العيادة"
                  value={doctor.clinicLocation}
                />
                <InfoItem
                  icon={ClockIcon}
                  label="الفترة الصباحية"
                  value={`${doctor.morningShiftStart} - ${doctor.morningShiftEnd}`}
                />
                <InfoItem
                  icon={ClockIcon}
                  label="الفترة المسائية"
                  value={`${doctor.eveningShiftStart} - ${doctor.eveningShiftEnd}`}
                />
                <InfoItem
                  icon={ClockIcon}
                  label="مدة الموعد"
                  value={`${doctor.appointmentDuration} دقيقة`}
                />
                <InfoItem
                  icon={UsersIcon}
                  label="الحد الأقصى للمواعيد اليومية"
                  value={`${doctor.maxAppointmentsPerDay} موعد`}
                />
                <InfoItem
                  icon={ClipboardEditIcon}
                  label="ملاحظات على الجدول"
                  value={doctor.scheduleNotes}
                  fullWidth={true}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-4">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-all duration-200 font-bold"
              onClick={handleEdit}
            >
              <ClipboardEditIcon className="ml-2 h-4 w-4" />
              <span>تعديل بيانات الطبيب</span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

// app/patient/[id]/page.tsx
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
  ArrowLeftIcon,
  BadgeIcon,
  BookIcon,
  CalendarIcon,
  ClipboardEditIcon,
  FileTextIcon,
  HeartIcon,
  HeartPulseIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PillIcon,
  UserIcon,
  UserPlusIcon,
  AlertTriangleIcon,
  ActivityIcon,
  ClockIcon,
  HeartHandshakeIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

// Define patient data interface
interface PatientData {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  maritalStatus: string;
  occupation: string;
  nationalId: string;
  emergencyContact: string;
  emergencyPhone: string;
  insuranceProvider: string;
  insuranceNumber: string;
  primaryDoctor: string;
  // Vital signs
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  bmi: number;
  // Medical history
  currentMedications: string[];
  allergies: string[];
  chronicDiseases: string[];
  surgicalHistory: string;
  familyHistory: string;
  // Recent visit
  lastVisitDate: string;
  lastVisitReason: string;
  diagnosis: string;
  treatmentPlan: string;
  labResults: string;
  nextAppointment: string;
  followUpNotes: string;
}

export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<PatientData | null>(null);

  useEffect(() => {
    // Simulate API call to fetch patient data
    setIsLoading(true);
    setTimeout(() => {
      // Mock data - in a real application, you would fetch this from your API
      const mockPatient: PatientData = {
        id,
        patientId: "P-" + id,
        name: "سعد سعد ",
        age: 52,
        gender: "ذكر",
        phone: "0555123456",
        email: "saad.saad@example.com",
        address: "زفتي - الغربية",
        bloodType: "O+",
        maritalStatus: "متزوج",
        occupation: "مهندس",
        nationalId: "1040xxxxxxxx",
        emergencyContact: "عبدالله  (ابن)",
        emergencyPhone: "0555987654",
        insuranceProvider: "شركة التعاونية للتأمين",
        insuranceNumber: "INS-" + id + "7520",
        primaryDoctor: "د. محمد أحمد ",
        // Vital signs
        bloodPressure: "130/85",
        heartRate: 78,
        temperature: 37.2,
        respiratoryRate: 18,
        oxygenSaturation: 97,
        weight: 84.5,
        height: 174,
        bmi: 27.9,
        // Medical history
        currentMedications: [
          "ليسينوبريل 10 مجم - مرة واحدة يومياً صباحاً",
          "أسبرين 81 مجم - مرة واحدة يومياً",
          "أتورفاستاتين 20 مجم - مرة واحدة يومياً مساءً",
        ],
        allergies: ["البنسلين", "المأكولات البحرية"],
        chronicDiseases: [
          "قلبة بيوجعه عاوز حد يدلعة",
          "ارتفاع ضغط الدم",
          "ارتفاع الكوليسترول",
          "السكري من النوع الثاني",
        ],
        surgicalHistory:
          "استئصال الزائدة الدودية (2005)، جراحة تغيير مفصل الركبة اليمنى (2018)",
        familyHistory:
          "والده توفي بسبب نوبة قلبية في سن 60، أخوه مصاب بالسكري من النوع الثاني",
        // Recent visit
        lastVisitDate: "2025-02-15",
        lastVisitReason: "مراجعة دورية لمتابعة ضغط الدم والسكري",
        diagnosis:
          "ضغط دم مرتفع تحت السيطرة - سكري من النوع الثاني تحت السيطرة الجزئية",
        treatmentPlan:
          "الاستمرار على نفس الأدوية مع زيادة جرعة السكري (ميتفورمين 1000 مجم مرتين يومياً)، الحد من تناول السكريات والنشويات، ممارسة المشي لمدة 30 دقيقة يومياً",
        labResults:
          "مستوى السكر التراكمي HbA1c: 7.2%، الكوليسترول الكلي: 185 مجم/ديسيلتر، LDL: 110 مجم/ديسيلتر",
        nextAppointment: "2025-05-08",
        followUpNotes:
          "يجب إجراء تحليل دم شامل قبل الزيارة القادمة. مراقبة مستوى السكر بالدم أسبوعياً. في حال ارتفاع ضغط الدم فوق 140/90 مراجعة العيادة فوراً.",
      };

      setPatient(mockPatient);
      setIsLoading(false);
    }, 0);
  }, [id]);

  const handleEdit = () => {
    // Navigate to edit page
    router.push(`/edit-patient/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddVisit = () => {
    // Navigate to add new visit page
    router.push(`/add-visit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">
              لم يتم العثور على المريض
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              المريض المطلوب غير موجود أو تم حذفه
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
    value: string | number | string[];
    fullWidth?: boolean;
  }) => (
    <div
      className={`p-4 bg-green-50 dark:bg-slate-700 rounded-lg ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-center mb-2">
        <Icon className="h-5 w-5 text-green-600 dark:text-green-400 ml-2" />
        <span className="font-semibold dark:text-gray-200">{label}</span>
      </div>
      {Array.isArray(value) ? (
        <ul className="list-disc list-inside text-gray-800 dark:text-gray-200 mr-2">
          {value.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-800 dark:text-gray-200">{value}</p>
      )}
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
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-300">
                  {patient.name}
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  رقم الملف: {patient.patientId} - {patient.age} سنة -{" "}
                  {patient.gender}
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
            {/* Alert for critical info */}
            {(patient.allergies.length > 0 ||
              patient.chronicDiseases.length > 0) && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center mb-2">
                  <AlertTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400 ml-2" />
                  <h3 className="text-xl font-bold text-red-800 dark:text-red-300">
                    معلومات هامة
                  </h3>
                </div>
                {patient.allergies.length > 0 && (
                  <div className="mb-2">
                    <span className="font-semibold text-red-700 dark:text-red-300">
                      الحساسية:{" "}
                    </span>
                    <span className="text-red-800 dark:text-red-200">
                      {patient.allergies.join("، ")}
                    </span>
                  </div>
                )}
                {patient.chronicDiseases.length > 0 && (
                  <div>
                    <span className="font-semibold text-red-700 dark:text-red-300">
                      الأمراض المزمنة:{" "}
                    </span>
                    <span className="text-red-800 dark:text-red-200">
                      {patient.chronicDiseases.join("، ")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Basic Information Section */}
            <div>
              <div className="flex items-center mb-4">
                <UserIcon className="h-6 w-6 text-green-600 dark:text-green-400 ml-2" />
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                  المعلومات الأساسية
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={UserIcon}
                  label="اسم المريض"
                  value={patient.name}
                />
                <InfoItem
                  icon={BadgeIcon}
                  label="رقم الملف"
                  value={patient.patientId}
                />
                <InfoItem
                  icon={BadgeIcon}
                  label="رقم الهوية الوطنية"
                  value={patient.nationalId}
                />
                <InfoItem
                  icon={PhoneIcon}
                  label="رقم الهاتف"
                  value={patient.phone}
                />
                <InfoItem
                  icon={MailIcon}
                  label="البريد الإلكتروني"
                  value={patient.email}
                />
                <InfoItem
                  icon={HeartIcon}
                  label="فصيلة الدم"
                  value={patient.bloodType}
                />
                <InfoItem
                  icon={UserPlusIcon}
                  label="الحالة الاجتماعية"
                  value={patient.maritalStatus}
                />
                <InfoItem
                  icon={BookIcon}
                  label="المهنة"
                  value={patient.occupation}
                />
                <InfoItem
                  icon={MapPinIcon}
                  label="العنوان"
                  value={patient.address}
                  fullWidth={true}
                />
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div>
              <div className="flex items-center mb-4">
                <HeartHandshakeIcon className="h-6 w-6 text-green-600 dark:text-green-400 ml-2" />
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                  جهات الاتصال في حالات الطوارئ
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={UserPlusIcon}
                  label="الاسم"
                  value={patient.emergencyContact}
                />
                <InfoItem
                  icon={PhoneIcon}
                  label="رقم الهاتف"
                  value={patient.emergencyPhone}
                />
                <InfoItem
                  icon={BadgeIcon}
                  label="شركة التأمين"
                  value={patient.insuranceProvider}
                />
                <InfoItem
                  icon={BadgeIcon}
                  label="رقم التأمين"
                  value={patient.insuranceNumber}
                />
                <InfoItem
                  icon={UserIcon}
                  label="الطبيب المعالج"
                  value={patient.primaryDoctor}
                  fullWidth={true}
                />
              </div>
            </div>

            {/* Vital Signs Section */}
            <div>
              <div className="flex items-center mb-4">
                <ActivityIcon className="h-6 w-6 text-green-600 dark:text-green-400 ml-2" />
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                  العلامات الحيوية
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoItem
                  icon={HeartPulseIcon}
                  label="ضغط الدم"
                  value={patient.bloodPressure}
                />
                <InfoItem
                  icon={ActivityIcon}
                  label="معدل ضربات القلب"
                  value={`${patient.heartRate} نبضة/دقيقة`}
                />
                <InfoItem
                  icon={ActivityIcon}
                  label="درجة الحرارة"
                  value={`${patient.temperature} °م`}
                />
                <InfoItem
                  icon={ActivityIcon}
                  label="معدل التنفس"
                  value={`${patient.respiratoryRate} نفس/دقيقة`}
                />
                <InfoItem
                  icon={ActivityIcon}
                  label="تشبع الأكسجين"
                  value={`${patient.oxygenSaturation}%`}
                />
                <InfoItem
                  icon={ActivityIcon}
                  label="مؤشر كتلة الجسم"
                  value={patient.bmi}
                />
                <InfoItem
                  icon={ActivityIcon}
                  label="الوزن"
                  value={`${patient.weight} كجم`}
                />
                <InfoItem
                  icon={ActivityIcon}
                  label="الطول"
                  value={`${patient.height} سم`}
                />
              </div>
            </div>

            {/* Medical History Section */}
            <div>
              <div className="flex items-center mb-4">
                <FileTextIcon className="h-6 w-6 text-green-600 dark:text-green-400 ml-2" />
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                  التاريخ الطبي
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={PillIcon}
                  label="الأدوية الحالية"
                  value={patient.currentMedications}
                  fullWidth={true}
                />
                <InfoItem
                  icon={AlertTriangleIcon}
                  label="الحساسية"
                  value={
                    patient.allergies.length
                      ? patient.allergies
                      : "لا توجد حساسية"
                  }
                />
                <InfoItem
                  icon={HeartPulseIcon}
                  label="الأمراض المزمنة"
                  value={
                    patient.chronicDiseases.length
                      ? patient.chronicDiseases
                      : "لا توجد أمراض مزمنة"
                  }
                />
                <InfoItem
                  icon={FileTextIcon}
                  label="التاريخ الجراحي"
                  value={patient.surgicalHistory || "لا يوجد"}
                  fullWidth={true}
                />
                <InfoItem
                  icon={FileTextIcon}
                  label="التاريخ العائلي"
                  value={patient.familyHistory || "لا يوجد"}
                  fullWidth={true}
                />
              </div>
            </div>

            {/* Recent Visit Section */}
            <div>
              <div className="flex items-center mb-4">
                <CalendarIcon className="h-6 w-6 text-green-600 dark:text-green-400 ml-2" />
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                  آخر زيارة
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={CalendarIcon}
                  label="تاريخ الزيارة"
                  value={patient.lastVisitDate}
                />
                <InfoItem
                  icon={FileTextIcon}
                  label="سبب الزيارة"
                  value={patient.lastVisitReason}
                />
                <InfoItem
                  icon={FileTextIcon}
                  label="التشخيص"
                  value={patient.diagnosis}
                  fullWidth={true}
                />
                <InfoItem
                  icon={FileTextIcon}
                  label="خطة العلاج"
                  value={patient.treatmentPlan}
                  fullWidth={true}
                />
                <InfoItem
                  icon={FileTextIcon}
                  label="نتائج التحاليل"
                  value={patient.labResults}
                  fullWidth={true}
                />
                <InfoItem
                  icon={CalendarIcon}
                  label="الموعد القادم"
                  value={patient.nextAppointment || "لم يتم تحديد موعد"}
                />
                <InfoItem
                  icon={ClockIcon}
                  label="متابعة بعد"
                  value={
                    patient.nextAppointment
                      ? `${Math.round(
                          (new Date(patient.nextAppointment).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} يوم`
                      : "لم يتم تحديد موعد"
                  }
                />
                <InfoItem
                  icon={FileTextIcon}
                  label="ملاحظات المتابعة"
                  value={patient.followUpNotes || "لا توجد ملاحظات"}
                  fullWidth={true}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 space-x-reverse">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all duration-200 font-bold"
              onClick={handleEdit}
            >
              <ClipboardEditIcon className="ml-2 h-4 w-4" />
              <span>تعديل بيانات المريض</span>
            </Button>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-all duration-200 font-bold"
              onClick={handleAddVisit}
            >
              <UserPlusIcon className="ml-2 h-4 w-4" />
              <span>إضافة زيارة جديدة</span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

// app/add-doctor/page.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  BadgeIcon,
  BookIcon,
  Loader2,
  MailIcon,
  PhoneIcon,
  SaveIcon,
  UserPlusIcon,
} from "lucide-react";
import { useState } from "react";

export default function AddDoctorPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-5xl"
      >
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl">
          <CardHeader className="text-right">
            <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-300">
              إضافة طبيب جديد
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-400">
              أدخل بيانات الطبيب وتخصصه والمعلومات المهنية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" dir="rtl">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
                  <TabsTrigger value="professional">
                    المعلومات المهنية
                  </TabsTrigger>
                  <TabsTrigger value="schedule">جدول المواعيد</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                    <div className="space-y-2">
                      <Label
                        htmlFor="doctorName"
                        className="text-right block dark:text-gray-200"
                      >
                        اسم الطبيب
                      </Label>
                      <div className="relative">
                        <Input
                          id="doctorName"
                          placeholder="أدخل اسم الطبيب الكامل"
                          className="text-right pr-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                          required
                          dir="rtl"
                        />
                        <UserPlusIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="doctorId"
                        className="text-right block dark:text-gray-200"
                      >
                        الرقم الوظيفي
                      </Label>
                      <div className="relative">
                        <Input
                          id="doctorId"
                          placeholder="أدخل الرقم الوظيفي للطبيب"
                          className="text-right pr-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                          required
                          dir="rtl"
                        />
                        <BadgeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="specialty"
                        className="text-right block dark:text-gray-200"
                      >
                        التخصص
                      </Label>
                      <select
                        id="specialty"
                        className="w-full rounded-md border text-right px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                        required
                      >
                        <option value="">اختر التخصص</option>
                        <option value="cardiology">أمراض القلب</option>
                        <option value="neurology">الأعصاب</option>
                        <option value="orthopedics">العظام</option>
                        <option value="pediatrics">طب الأطفال</option>
                        <option value="gynecology">النساء والتوليد</option>
                        <option value="dermatology">الجلدية</option>
                        <option value="ophthalmology">العيون</option>
                        <option value="ent">الأنف والأذن والحنجرة</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="gender"
                        className="text-right block dark:text-gray-200"
                      >
                        الجنس
                      </Label>
                      <select
                        id="gender"
                        className="w-full rounded-md border text-right px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      >
                        <option value="">اختر الجنس</option>
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-right block dark:text-gray-200"
                      >
                        رقم الهاتف
                      </Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          placeholder="أدخل رقم هاتف الطبيب"
                          className="text-right pr-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                          dir="rtl"
                        />
                        <PhoneIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-right block dark:text-gray-200"
                      >
                        البريد الإلكتروني
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="أدخل البريد الإلكتروني للطبيب"
                          className="text-right pr-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                          dir="rtl"
                        />
                        <MailIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="address"
                        className="text-right block dark:text-gray-200"
                      >
                        العنوان
                      </Label>
                      <Input
                        id="address"
                        placeholder="أدخل عنوان الطبيب"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Professional Information Tab */}
                <TabsContent value="professional" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                    <div className="space-y-2">
                      <Label
                        htmlFor="qualification"
                        className="text-right block dark:text-gray-200"
                      >
                        المؤهل العلمي
                      </Label>
                      <select
                        id="qualification"
                        className="w-full rounded-md border text-right px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      >
                        <option value="">اختر المؤهل</option>
                        <option value="md">بكالوريوس طب وجراحة</option>
                        <option value="msc">ماجستير</option>
                        <option value="phd">دكتوراه</option>
                        <option value="fellowship">زمالة</option>
                        <option value="board">بورد</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="graduationYear"
                        className="text-right block dark:text-gray-200"
                      >
                        سنة التخرج
                      </Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        placeholder="أدخل سنة التخرج"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="university"
                        className="text-right block dark:text-gray-200"
                      >
                        الجامعة
                      </Label>
                      <Input
                        id="university"
                        placeholder="أدخل اسم الجامعة"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="licenseNumber"
                        className="text-right block dark:text-gray-200"
                      >
                        رقم الترخيص المهني
                      </Label>
                      <Input
                        id="licenseNumber"
                        placeholder="أدخل رقم الترخيص المهني"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="licenseExpiry"
                        className="text-right block dark:text-gray-200"
                      >
                        تاريخ انتهاء الترخيص
                      </Label>
                      <Input
                        id="licenseExpiry"
                        type="date"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="department"
                        className="text-right block dark:text-gray-200"
                      >
                        القسم
                      </Label>
                      <Input
                        id="department"
                        placeholder="أدخل اسم القسم"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="position"
                        className="text-right block dark:text-gray-200"
                      >
                        المنصب
                      </Label>
                      <select
                        id="position"
                        className="w-full rounded-md border text-right px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      >
                        <option value="">اختر المنصب</option>
                        <option value="resident">طبيب مقيم</option>
                        <option value="specialist">أخصائي</option>
                        <option value="consultant">استشاري</option>
                        <option value="professor">أستاذ</option>
                        <option value="headOfDepartment">رئيس قسم</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="yearsOfExperience"
                        className="text-right block dark:text-gray-200"
                      >
                        سنوات الخبرة
                      </Label>
                      <Input
                        id="yearsOfExperience"
                        type="number"
                        placeholder="أدخل عدد سنوات الخبرة"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label
                      htmlFor="biography"
                      className="text-right block dark:text-gray-200"
                    >
                      السيرة الذاتية
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="biography"
                        placeholder="أدخل نبذة عن السيرة الذاتية للطبيب"
                        className="text-right h-24 pr-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                      <BookIcon className="absolute right-3 top-3 h-4 w-4 text-blue-500 dark:text-blue-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="specialInterests"
                      className="text-right block dark:text-gray-200"
                    >
                      الاهتمامات الخاصة
                    </Label>
                    <Textarea
                      id="specialInterests"
                      placeholder="أدخل الاهتمامات المهنية الخاصة للطبيب"
                      className="text-right h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      dir="rtl"
                    />
                  </div>
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                    <div className="space-y-2">
                      <Label
                        htmlFor="workDays"
                        className="text-right block dark:text-gray-200"
                      >
                        أيام العمل
                      </Label>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {[
                          "الأحد",
                          "الإثنين",
                          "الثلاثاء",
                          "الأربعاء",
                          "الخميس",
                          "الجمعة",
                          "السبت",
                        ].map((day) => (
                          <div
                            key={day}
                            className="flex items-center space-x-2 space-x-reverse"
                          >
                            <input
                              type="checkbox"
                              id={`day-${day}`}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <label
                              htmlFor={`day-${day}`}
                              className="text-sm dark:text-gray-200"
                            >
                              {day}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="clinicLocation"
                        className="text-right block dark:text-gray-200"
                      >
                        موقع العيادة
                      </Label>
                      <select
                        id="clinicLocation"
                        className="w-full rounded-md border text-right px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      >
                        <option value="">اختر الموقع</option>
                        <option value="mainBuilding">المبنى الرئيسي</option>
                        <option value="branchA">الفرع أ</option>
                        <option value="branchB">الفرع ب</option>
                        <option value="specialtyClinic">عيادات التخصصات</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="morningShiftStart"
                        className="text-right block dark:text-gray-200"
                      >
                        بداية الفترة الصباحية
                      </Label>
                      <Input
                        id="morningShiftStart"
                        type="time"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="morningShiftEnd"
                        className="text-right block dark:text-gray-200"
                      >
                        نهاية الفترة الصباحية
                      </Label>
                      <Input
                        id="morningShiftEnd"
                        type="time"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="eveningShiftStart"
                        className="text-right block dark:text-gray-200"
                      >
                        بداية الفترة المسائية
                      </Label>
                      <Input
                        id="eveningShiftStart"
                        type="time"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="eveningShiftEnd"
                        className="text-right block dark:text-gray-200"
                      >
                        نهاية الفترة المسائية
                      </Label>
                      <Input
                        id="eveningShiftEnd"
                        type="time"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="appointmentDuration"
                        className="text-right block dark:text-gray-200"
                      >
                        مدة الموعد (دقائق)
                      </Label>
                      <Input
                        id="appointmentDuration"
                        type="number"
                        placeholder="مثال: 15"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="maxAppointmentsPerDay"
                        className="text-right block dark:text-gray-200"
                      >
                        الحد الأقصى للمواعيد اليومية
                      </Label>
                      <Input
                        id="maxAppointmentsPerDay"
                        type="number"
                        placeholder="مثال: 20"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label
                      htmlFor="scheduleNotes"
                      className="text-right block dark:text-gray-200"
                    >
                      ملاحظات على الجدول
                    </Label>
                    <Textarea
                      id="scheduleNotes"
                      placeholder="أدخل أي ملاحظات خاصة بجدول الطبيب"
                      className="text-right h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      dir="rtl"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-all duration-200 font-bold"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>جاري الحفظ...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <SaveIcon className="mr-2 h-4 w-4" />
                  <span>حفظ بيانات الطبيب</span>
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

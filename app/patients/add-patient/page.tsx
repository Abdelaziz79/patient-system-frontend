// app/add-patient/page.tsx
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
import { KeyIcon, Loader2, SaveIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";

export default function AddPatientPage() {
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
    <div className="flex items-center justify-center p-2 sm:p-4 py-6 sm:py-12">
      {/* Background animation for the entire site */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-5xl"
      >
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl">
          <CardHeader className="text-right px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-300">
              إضافة مريض جديد
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-400 text-sm sm:text-base">
              أدخل بيانات المريض الأساسية والفحوصات الطبية
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <Tabs defaultValue="basic" dir="rtl" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-2">
                  <TabsTrigger value="basic" className="text-xs sm:text-sm">
                    المعلومات الأساسية
                  </TabsTrigger>
                  <TabsTrigger value="vitals" className="text-xs sm:text-sm">
                    العلامات الحيوية
                  </TabsTrigger>
                  <TabsTrigger value="labs" className="text-xs sm:text-sm">
                    التحاليل المخبرية
                  </TabsTrigger>
                  <TabsTrigger value="treatment" className="text-xs sm:text-sm">
                    التشخيص والعلاج
                  </TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent
                  value="basic"
                  className="space-y-3 sm:space-y-4 mt-2 sm:mt-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-right">
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="patientName"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        اسم المريض
                      </Label>
                      <div className="relative">
                        <Input
                          id="patientName"
                          placeholder="أدخل اسم المريض الكامل"
                          className="text-right pr-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                          required
                          dir="rtl"
                        />
                        <UserPlusIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="patientId"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        رقم الملف
                      </Label>
                      <div className="relative">
                        <Input
                          id="patientId"
                          placeholder="أدخل رقم ملف المريض"
                          className="text-right pr-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                          required
                          dir="rtl"
                        />
                        <KeyIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="age"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        العمر
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="أدخل عمر المريض"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        required
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="gender"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        الجنس
                      </Label>
                      <select
                        id="gender"
                        className="w-full rounded-md border text-right px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      >
                        <option value="">اختر الجنس</option>
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:space-y-2 sm:col-span-2">
                      <Label
                        htmlFor="address"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        العنوان
                      </Label>
                      <Input
                        id="address"
                        placeholder="أدخل عنوان المريض"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        رقم الهاتف
                      </Label>
                      <Input
                        id="phone"
                        placeholder="أدخل رقم هاتف المريض"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="date"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        تاريخ الزيارة
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Vitals Tab */}
                <TabsContent
                  value="vitals"
                  className="space-y-3 sm:space-y-4 mt-2 sm:mt-4"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-right">
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="bp"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        ضغط الدم (BP)
                      </Label>
                      <Input
                        id="bp"
                        placeholder="مثال: 120/80"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="hr"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        معدل ضربات القلب (HR)
                      </Label>
                      <Input
                        id="hr"
                        placeholder="مثال: 72"
                        type="number"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="temp"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        درجة الحرارة (Temp)
                      </Label>
                      <Input
                        id="temp"
                        placeholder="مثال: 37.0"
                        type="number"
                        step="0.1"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="rr"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        معدل التنفس (RR)
                      </Label>
                      <Input
                        id="rr"
                        placeholder="مثال: 16"
                        type="number"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="o2sat"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        تشبع الأكسجين (O2 sat)
                      </Label>
                      <Input
                        id="o2sat"
                        placeholder="مثال: 98"
                        type="number"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="gcs"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        مقياس غلاسكو (GCS)
                      </Label>
                      <Input
                        id="gcs"
                        placeholder="مثال: 15"
                        type="number"
                        min="3"
                        max="15"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-4">
                    <Label
                      htmlFor="examination"
                      className="text-right block dark:text-gray-200 text-sm sm:text-base"
                    >
                      الفحص السريري
                    </Label>
                    <Textarea
                      id="examination"
                      placeholder="أدخل نتائج الفحص السريري"
                      className="text-right h-20 sm:h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                      dir="rtl"
                    />
                  </div>
                </TabsContent>

                {/* Labs Tab */}
                <TabsContent
                  value="labs"
                  className="space-y-3 sm:space-y-4 mt-2 sm:mt-4"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-right">
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="hb"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        الهيموغلوبين (HB)
                      </Label>
                      <Input
                        id="hb"
                        placeholder="مثال: 14.5"
                        type="number"
                        step="0.1"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="wbc"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        خلايا الدم البيضاء (WBC)
                      </Label>
                      <Input
                        id="wbc"
                        placeholder="مثال: 7.5"
                        type="number"
                        step="0.1"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="plt"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        الصفائح الدموية (PLT)
                      </Label>
                      <Input
                        id="plt"
                        placeholder="مثال: 250"
                        type="number"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="crp"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        بروتين سي التفاعلي (CRP)
                      </Label>
                      <Input
                        id="crp"
                        placeholder="مثال: 0.5"
                        type="number"
                        step="0.1"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="urea"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        اليوريا (Urea)
                      </Label>
                      <Input
                        id="urea"
                        placeholder="مثال: 25"
                        type="number"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="creat"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        الكرياتينين (Creat)
                      </Label>
                      <Input
                        id="creat"
                        placeholder="مثال: 0.9"
                        type="number"
                        step="0.1"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="ast"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        AST
                      </Label>
                      <Input
                        id="ast"
                        placeholder="مثال: 32"
                        type="number"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="alt"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        ALT
                      </Label>
                      <Input
                        id="alt"
                        placeholder="مثال: 28"
                        type="number"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="na"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        الصوديوم (Na)
                      </Label>
                      <Input
                        id="na"
                        placeholder="مثال: 138"
                        type="number"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="k"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        البوتاسيوم (K)
                      </Label>
                      <Input
                        id="k"
                        placeholder="مثال: 4.2"
                        type="number"
                        step="0.1"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="troponin"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        التروبونين (Troponin)
                      </Label>
                      <Input
                        id="troponin"
                        placeholder="مثال: 0.01"
                        type="number"
                        step="0.01"
                        className="text-right focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-4">
                    <Label
                      htmlFor="otherLabs"
                      className="text-right block dark:text-gray-200 text-sm sm:text-base"
                    >
                      تحاليل أخرى
                    </Label>
                    <Textarea
                      id="otherLabs"
                      placeholder="أدخل نتائج التحاليل الأخرى"
                      className="text-right h-20 sm:h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                      dir="rtl"
                    />
                  </div>
                </TabsContent>

                {/* Treatment Tab */}
                <TabsContent
                  value="treatment"
                  className="space-y-3 sm:space-y-4 mt-2 sm:mt-4"
                >
                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="diagnosis"
                      className="text-right block dark:text-gray-200 text-sm sm:text-base"
                    >
                      التشخيص
                    </Label>
                    <Textarea
                      id="diagnosis"
                      placeholder="أدخل التشخيص"
                      className="text-right h-20 sm:h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                      dir="rtl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-right">
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="cardiacDiagnosis"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        التشخيص القلبي
                      </Label>
                      <select
                        id="cardiacDiagnosis"
                        className="w-full rounded-md border text-right px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                      >
                        <option value="">اختر التشخيص</option>
                        <option value="arrhythmia">اضطراب نظم القلب</option>
                        <option value="hf">قصور القلب</option>
                        <option value="ihd">مرض الشريان التاجي</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="investigations"
                        className="text-right block dark:text-gray-200 text-sm sm:text-base"
                      >
                        الفحوص المطلوبة
                      </Label>
                      <select
                        id="investigations"
                        className="w-full rounded-md border text-right px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                        dir="rtl"
                        multiple
                        size={3}
                      >
                        <option value="ecg">تخطيط القلب (ECG)</option>
                        <option value="echo">ايكو القلب (ECHO)</option>
                        <option value="ct">أشعة مقطعية (CT)</option>
                        <option value="xray">أشعة سينية (X-Ray)</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="treatment"
                      className="text-right block dark:text-gray-200 text-sm sm:text-base"
                    >
                      خطة العلاج
                    </Label>
                    <Textarea
                      id="treatment"
                      placeholder="أدخل خطة العلاج التفصيلية"
                      className="text-right h-24 sm:h-32 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="notes"
                      className="text-right block dark:text-gray-200 text-sm sm:text-base"
                    >
                      ملاحظات
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="أدخل أي ملاحظات إضافية"
                      className="text-right h-20 sm:h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm sm:text-base"
                      dir="rtl"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter className="px-4 sm:px-6 pt-2 sm:pt-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-all duration-200 font-bold text-sm sm:text-base py-2 sm:py-3"
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
                  <span>حفظ بيانات المريض</span>
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

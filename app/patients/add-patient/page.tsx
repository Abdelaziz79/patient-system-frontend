"use client";

import BasicInfoTab from "@/app/_components/patient/BasicInfoTap";
import DiagnosisTreatmentTab from "@/app/_components/patient/DiagnosisTreatmentTab";
import LabImagingTab from "@/app/_components/patient/LabImagingTab";
import PathologicalHistoryTab from "@/app/_components/patient/PathologicalHistoryTab";
import VitalSignsExaminationTab from "@/app/_components/patient/VitalSignsExaminationTab";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  FileText,
  Loader2,
  SaveIcon,
  User,
} from "lucide-react";
import { useState } from "react";

export default function AddPatientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const tabIcons = {
    basic: <User className="h-4 w-4 mr-1" />,
    pathological: <FileText className="h-4 w-4 mr-1" />,
    vitalsigns: <ClipboardCheck className="h-4 w-4 mr-1" />,
    labimaging: <FileText className="h-4 w-4 mr-1" />,
    diagnosistreatment: <ClipboardCheck className="h-4 w-4 mr-1" />,
  };

  return (
    <div className="flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-5xl"
      >
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white px-6 py-5">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">
                  New Patient Registration
                </CardTitle>
                <CardDescription className="text-blue-100 mt-1">
                  Complete patient information and medical examination details
                </CardDescription>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <User className="h-10 w-10 text-white/80" />
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs
                defaultValue="basic"
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className=" grid w-full grid-cols-3 lg:grid-cols-5 mb-6 bg-blue-50 dark:bg-slate-700 rounded-lg pb-10">
                  {[
                    { value: "basic", label: "Basic Information" },
                    { value: "pathological", label: "Medical History" },
                    { value: "vitalsigns", label: "Vital Signs" },
                    { value: "labimaging", label: "Lab & Imaging" },
                    { value: "diagnosistreatment", label: "Treatment Plan" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className=" text-sm py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:text-blue-700 dark:data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center">
                        {tabIcons[tab.value as keyof typeof tabIcons]}
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">
                          {tab.label.split(" ")[0]}
                        </span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Tab Contents */}
                <div className="transition-all duration-300 ease-in-out">
                  <BasicInfoTab />
                  <PathologicalHistoryTab />
                  <VitalSignsExaminationTab />
                  <LabImagingTab />
                  <DiagnosisTreatmentTab />
                </div>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter className="px-6 py-5 bg-gray-50 dark:bg-slate-700/30">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-1/2 border-gray-300 hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-all duration-200 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white transition-all duration-200 font-semibold"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <SaveIcon className="mr-2 h-4 w-4" />
                    <span>Save Patient Data</span>
                  </div>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

"use client";

import BasicInfoTab from "@/app/_components/patientAddForm/BasicInfoTabs";
import DiagnosisTreatmentTab from "@/app/_components/patientAddForm/DiagnosisTreatmentTab";
import LabImagingTab from "@/app/_components/patientAddForm/LabImagingTab";
import { MedicalRecordTabs } from "@/app/_components/patientAddForm/MedicalRecordTabs";
import PathologicalHistoryTab from "@/app/_components/patientAddForm/PathologicalHistoryTab";
import VitalSignsExaminationTab from "@/app/_components/patientAddForm/VitalSignsExaminationTab";
import { usePatientData } from "@/app/_contexts/PatientContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Loader2, SaveIcon, User } from "lucide-react";
import { useState } from "react";

export default function AddPatientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const patientData = usePatientData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(patientData);
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center p-2 py-8">
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
            <div className="space-y-6">
              <Tabs
                defaultValue="basic"
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <MedicalRecordTabs />

                {/* Tab Contents */}
                <div className="transition-all duration-300 ease-in-out">
                  <BasicInfoTab />
                  <PathologicalHistoryTab />
                  <VitalSignsExaminationTab />
                  <LabImagingTab />
                  <DiagnosisTreatmentTab />
                </div>
              </Tabs>
            </div>
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

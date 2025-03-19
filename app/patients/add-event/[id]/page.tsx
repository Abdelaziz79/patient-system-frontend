"use client";

import { motion } from "framer-motion";
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Loading from "@/app/_components/Loading";
import BasicEventInfo from "@/app/_components/patientEvent/BasicEventInfo";
import ImagingTab from "@/app/_components/patientEvent/ImagingTab";
import LabsTap from "@/app/_components/patientEvent/LabsTab";
import PatientNewEventTabs from "@/app/_components/patientEvent/PatientNewEventTabs";
import TreatMentTab from "@/app/_components/patientEvent/TreatmentTab";
import VitalsTab from "@/app/_components/patientEvent/VitalsTab";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";

export default function AddEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [patientName, setPatientName] = useState("");
  const [activeTab, setActiveTab] = useState("vitals");
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // General event fields

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // This would be replaced with your actual API call
      setPatientName("Abdo"); // Replace with actual patient name
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6 max-w-6xl"
    >
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                Add New Event
              </CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Patient: {patientName} | ID: {id}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center"
              type="button"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              <span>Go Back</span>
            </Button>
          </div>

          {/* Basic Event Information */}
          <BasicEventInfo />

          {/* Tabs for different event types */}
          <Tabs
            defaultValue="vitals"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <PatientNewEventTabs />

            {/* Vitals Tab */}
            <VitalsTab />
            {/* Labs Tab */}
            <LabsTap />

            {/* Imaging Tab */}
            <ImagingTab />

            {/* Treatment Tab */}
            <TreatMentTab />
          </Tabs>
        </CardHeader>

        <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={handleBack}
            // disabled={isSubmitting}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            // disabled={isSubmitting}
            className="flex items-center"
          >
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <CheckCircleIcon className="mr-2 h-4 w-4" />
                Save Event
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

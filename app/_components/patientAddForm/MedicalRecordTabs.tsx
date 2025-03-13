"use client";
import {
  BeakerIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  FileTextIcon,
  HeartPulseIcon,
} from "lucide-react";
import TabsNav from "../TabsNav";

export const MedicalRecordTabs = () => {
  const tabs = [
    { value: "basic", label: "Basic Information" },
    { value: "pathological", label: "Medical History" },
    { value: "vitalsigns", label: "Vital Signs" },
    { value: "labimaging", label: "Lab & Imaging" },
    { value: "diagnosistreatment", label: "Treatment Plan" },
  ];

  const icons = {
    basic: <ClipboardListIcon className="h-4 w-4" />,
    pathological: <FileTextIcon className="h-4 w-4" />,
    vitalsigns: <HeartPulseIcon className="h-4 w-4" />,
    labimaging: <BeakerIcon className="h-4 w-4" />,
    diagnosistreatment: <ClipboardCheckIcon className="h-4 w-4" />,
  };

  return (
    <TabsNav
      tabs={tabs}
      icons={icons}
      activeTriggerClassName="bg-white dark:bg-slate-600 text-blue-700 dark:text-white shadow-md"
      containerClassName="grid grid-cols-5 md:grid-cols-5 gap-1 p-1 bg-blue-50 dark:bg-slate-700 rounded-lg"
      triggerClassName="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200"
      showLabels="responsive"
    />
  );
};

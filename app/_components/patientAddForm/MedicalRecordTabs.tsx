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
      containerClassName="grid grid-cols-3 lg:grid-cols-5 mb-6 bg-blue-50 dark:bg-slate-700 rounded-lg pb-10"
      triggerClassName="text-sm py-2"
      activeTriggerClassName="bg-white dark:bg-slate-600 text-blue-700 dark:text-white shadow-md"
      showLabels="responsive"
    />
  );
};

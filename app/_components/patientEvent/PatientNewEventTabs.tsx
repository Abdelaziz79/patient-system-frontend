import TabsNav from "@/app/_components/TabsNav";
import {
  HeartPulseIcon,
  ImageIcon,
  StethoscopeIcon,
  TestTubeIcon,
} from "lucide-react";

const PatientNewEventTabs = () => {
  const tabs = [
    { value: "vitals", label: "Vitals" },
    { value: "labs", label: "Labs" },
    { value: "imaging", label: "Imaging" },
    { value: "treatment", label: "Treatment" },
  ];

  const icons = {
    vitals: <HeartPulseIcon className="h-4 w-4" />,
    labs: <TestTubeIcon className="h-4 w-4" />,
    imaging: <ImageIcon className="h-4 w-4" />,
    treatment: <StethoscopeIcon className="h-4 w-4" />,
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <TabsNav
        tabs={tabs}
        icons={icons}
        containerClassName="grid grid-cols-4 md:grid-cols-4 gap-1 p-1 bg-blue-50 dark:bg-slate-700 rounded-lg"
        triggerClassName="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200"
        showLabels="responsive"
      />
    </div>
  );
};

export default PatientNewEventTabs;

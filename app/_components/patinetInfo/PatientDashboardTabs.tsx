import TabsNav from "@/app/_components/TabsNav";
import {
  ActivityIcon,
  FileTextIcon,
  FlaskConicalIcon,
  ImageIcon,
  StethoscopeIcon,
  UserIcon,
} from "lucide-react";

export const PatientDashboardTabs = () => {
  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "vitals", label: "Vitals" },
    { value: "conditions", label: "Conditions" },
    { value: "labs", label: "Labs" },
    { value: "imaging", label: "Imaging" },
    { value: "treatment", label: "Treatment" },
  ];

  const icons = {
    overview: <UserIcon className="h-4 w-4" />,
    vitals: <ActivityIcon className="h-4 w-4" />,
    conditions: <FileTextIcon className="h-4 w-4" />,
    labs: <FlaskConicalIcon className="h-4 w-4" />,
    imaging: <ImageIcon className="h-4 w-4" />,
    treatment: <StethoscopeIcon className="h-4 w-4" />,
  };

  return (
    <TabsNav
      tabs={tabs}
      icons={icons}
      containerClassName="flex flex-row justify-between gap-0.5 p-1 bg-blue-50 dark:bg-slate-700 rounded-lg"
      triggerClassName="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200"
      showLabels="responsive"
    />
  );
};

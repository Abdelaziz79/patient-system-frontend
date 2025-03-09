import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for class names
import React from "react";

// TabsNav component that can be reused across the application
const TabsNav = ({
  tabs,
  icons,
  containerClassName,
  triggerClassName,
  showLabels = "responsive", // 'always', 'responsive', or 'never'
}: {
  tabs: { value: string; label: string }[];
  icons?: { [key: string]: React.ReactNode };
  containerClassName?: string;
  triggerClassName?: string;
  activeTriggerClassName?: string;
  showLabels?: "always" | "responsive" | "never";
}) => {
  return (
    <TabsList className={cn("w-full", containerClassName)}>
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className={cn("transition-all duration-200", triggerClassName)}
        >
          <div className="flex items-center">
            {icons && icons[tab.value] && (
              <span className="mr-1 md:mr-2">{icons[tab.value]}</span>
            )}

            {showLabels === "always" && <span>{tab.label}</span>}

            {showLabels === "responsive" && (
              <>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </>
            )}

            {showLabels === "never" && null}
          </div>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TabsNav;

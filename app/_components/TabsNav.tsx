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
          className={cn(
            "transition-all duration-200 flex-1 min-w-0 px-1",
            triggerClassName
          )}
        >
          <div className="flex items-center justify-center w-full">
            {icons && icons[tab.value] && (
              <span className="mx-1 md:mx-2 flex-shrink-0">
                {icons[tab.value]}
              </span>
            )}

            {showLabels === "always" && (
              <span className="truncate">{tab.label}</span>
            )}

            {showLabels === "responsive" && (
              <>
                <span className="hidden sm:inline truncate">{tab.label}</span>
                <span className="sm:hidden truncate">
                  {tab.label.split(" ")[0]}
                </span>
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

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

// Define default statuses to use now that they're not part of the template
const DEFAULT_STATUSES = [
  {
    name: "active",
    label: "Active",
    color: "#28a745",
    description: "Patient is currently active and receiving regular care",
    isDefault: true,
    order: 0,
  },
  {
    name: "on_treatment",
    label: "On Treatment",
    color: "#007bff",
    description: "Patient is currently undergoing treatment",
    isDefault: false,
    order: 1,
  },
  {
    name: "in_remission",
    label: "In Remission",
    color: "#17a2b8",
    description: "Patient is in remission and requires follow-up care",
    isDefault: false,
    order: 2,
  },
  {
    name: "discharged",
    label: "Discharged",
    color: "#6c757d",
    description: "Patient has been discharged from active care",
    isDefault: false,
    order: 3,
  },
  {
    name: "deceased",
    label: "Deceased",
    color: "#dc3545",
    description: "Patient is deceased",
    isDefault: false,
    order: 4,
  },
];

interface PatientStatusProps {
  form?: UseFormReturn<any>;
  statusOptions?: Array<{
    name: string;
    label: string;
    color: string;
    isDefault: boolean;
  }>;
}

export const PatientStatus = ({
  form,
  statusOptions = [],
}: PatientStatusProps) => {
  const { t, isRTL } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Use the provided status options or fall back to defaults
  const availableStatusOptions =
    statusOptions.length > 0 ? statusOptions : DEFAULT_STATUSES;

  // Set default status when component mounts
  useEffect(() => {
    // Check if form already has a selected status
    const currentStatus = form?.getValues("patientStatus");

    if (currentStatus) {
      setSelectedStatus(currentStatus);
      return;
    }

    // Otherwise set the default status
    const defaultStatus = availableStatusOptions.find((s) => s.isDefault);
    if (defaultStatus) {
      setSelectedStatus(defaultStatus.name);

      // Update form if available
      if (form) {
        form.setValue("patientStatus", defaultStatus.name);
        form.setValue("patientStatusData", defaultStatus);
      }
    }
  }, [form, availableStatusOptions]); // Run when either form or availableStatusOptions changes

  const handleStatusSelect = (statusName: string) => {
    if (selectedStatus === statusName) return; // Prevent unnecessary updates

    setSelectedStatus(statusName);

    // Get the full status object
    const statusObj = availableStatusOptions.find((s) => s.name === statusName);

    // Update form if available
    if (form && statusObj) {
      form.setValue("patientStatus", statusName);
      form.setValue("patientStatusData", statusObj);
    }
  };

  // Helper to get translated status label
  const getStatusLabel = (statusName: string): string => {
    const defaultLabel =
      availableStatusOptions.find((s) => s.name === statusName)?.label ||
      statusName;
    return t(statusName as any) !== statusName
      ? t(statusName as any)
      : defaultLabel;
  };

  return (
    <div className="border-t dark:border-slate-700 pt-6 mt-8">
      <div className="space-y-3">
        <h3
          className={cn(
            "text-md font-medium flex items-center text-slate-800 dark:text-slate-200",
            isRTL && "flex-row-reverse"
          )}
        >
          <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 mx-2" />
          {t("patientStatus")}
        </h3>

        <div
          className={cn("flex flex-wrap gap-3", isRTL && "flex-row-reverse")}
        >
          {availableStatusOptions.map((status) => {
            const isSelected = selectedStatus === status.name;

            return (
              <div
                key={status.name}
                role="button"
                tabIndex={0}
                onClick={() => handleStatusSelect(status.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleStatusSelect(status.name);
                    e.preventDefault();
                  }
                }}
                className={cn(
                  "flex items-center gap-x-2 rounded-lg border px-3 py-2.5 transition-colors duration-200 cursor-pointer",
                  isSelected
                    ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:border-slate-700",
                  isRTL && "flex-row-reverse"
                )}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span className="font-medium dark:text-slate-300">
                  {getStatusLabel(status.name)}
                </span>
                <div className="mx-2">
                  {/* Use visual indicator instead of actual checkbox component */}
                  <div
                    className={cn(
                      "h-4 w-4 rounded-sm border transition-colors",
                      isSelected
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300 dark:border-slate-600"
                    )}
                  >
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-white"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

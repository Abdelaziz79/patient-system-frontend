import { PatientTemplate } from "@/app/_types/Template";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface PatientStatusProps {
  selectedTemplate: PatientTemplate;
  form?: UseFormReturn<any>;
}

export const PatientStatus = ({
  selectedTemplate,
  form,
}: PatientStatusProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Set default status when component mounts or template changes
  useEffect(() => {
    const defaultStatus = selectedTemplate.statusOptions.find(
      (s) => s.isDefault
    );
    if (defaultStatus) {
      setSelectedStatus(defaultStatus.name);

      // Update form if available
      if (form) {
        form.setValue("patientStatus", defaultStatus.name);
        form.setValue("patientStatusData", defaultStatus);
      }
    }
  }, [selectedTemplate.id]); // Only run when template ID changes

  const handleStatusSelect = (statusName: string) => {
    if (selectedStatus === statusName) return; // Prevent unnecessary updates

    setSelectedStatus(statusName);

    // Get the full status object
    const statusObj = selectedTemplate.statusOptions.find(
      (s) => s.name === statusName
    );

    // Update form if available
    if (form && statusObj) {
      form.setValue("patientStatus", statusName);
      form.setValue("patientStatusData", statusObj);
    }
  };

  return (
    <div className="border-t dark:border-slate-700 pt-6 mt-8">
      <div className="space-y-3">
        <h3 className="text-md font-medium flex items-center text-slate-800 dark:text-slate-200">
          <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
          Patient Status
        </h3>

        <div className="flex flex-wrap gap-3">
          {selectedTemplate.statusOptions.map((status) => {
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
                  "flex items-center space-x-2 rounded-lg border px-3 py-2.5 transition-colors duration-200 cursor-pointer",
                  isSelected
                    ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:border-slate-700"
                )}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span className="font-medium dark:text-slate-300">
                  {status.label}
                </span>
                <div className="ml-2">
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

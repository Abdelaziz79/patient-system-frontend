import { PatientTemplate } from "@/app/_types/Template";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
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

  // Set default status when component mounts
  useEffect(() => {
    const defaultStatus = selectedTemplate.statusOptions.find(
      (s) => s.isDefault
    );
    if (defaultStatus) {
      setSelectedStatus(defaultStatus.name);

      // Update form if available
      if (form) {
        form.setValue("patientStatus", defaultStatus.name);
      }
    }
  }, [selectedTemplate, form]);

  const handleStatusChange = (statusName: string) => {
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
          {selectedTemplate.statusOptions.map((status) => (
            <motion.div
              key={status.name}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex items-center space-x-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors duration-200",
                selectedStatus === status.name
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:border-slate-700"
              )}
              onClick={() => handleStatusChange(status.name)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              <Label
                htmlFor={status.name}
                className="cursor-pointer font-medium dark:text-slate-300"
              >
                {status.label}
              </Label>
              <Checkbox
                id={status.name}
                checked={selectedStatus === status.name}
                onCheckedChange={() => handleStatusChange(status.name)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:border-slate-600"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

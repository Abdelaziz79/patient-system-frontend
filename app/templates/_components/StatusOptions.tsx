import { PatientTemplate } from "@/app/_types/Template";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircleIcon, InfoIcon } from "lucide-react";

interface StatusOptionsProps {
  template: PatientTemplate;
  isViewMode: boolean;
}

export function StatusOptions({ template, isViewMode }: StatusOptionsProps) {
  return (
    <Card className="bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-green-100 dark:border-green-900 shadow-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900 pb-4">
        <div>
          <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center">
            <InfoIcon className="h-5 w-5 mx-2 text-green-600 dark:text-green-400" />
            Patient Status Options
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400">
            Status options for patients
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center py-10 border border-dashed border-green-200 dark:border-green-900 rounded-lg bg-green-50/50 dark:bg-green-900/10">
          <div className="bg-white dark:bg-slate-700 shadow-sm rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 border border-green-100 dark:border-green-900">
            <AlertCircleIcon className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-green-800 dark:text-green-300 font-medium text-lg mb-2">
            Status Options Updated
          </h3>
          <p className="text-green-600 dark:text-green-400 text-sm max-w-md mx-auto">
            Patient status options are now managed globally across the system
            instead of per template. This ensures consistency in status tracking
            across all patients.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

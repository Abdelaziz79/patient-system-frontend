import { StatusOptionItem } from "@/app/_components/template/StatusOptionItem";
import { PatientStatusOption, PatientTemplate } from "@/app/_types/Template";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircleIcon, PlusIcon, TagIcon } from "lucide-react";

interface StatusOptionsProps {
  template: PatientTemplate;
  isViewMode: boolean;
  onAddStatus: () => void;
  onEditStatus: (status: PatientStatusOption) => void;
  setStatusToDelete: (statusId: string | null) => void;
}

export function StatusOptions({
  template,
  isViewMode,
  onAddStatus,
  onEditStatus,
  setStatusToDelete,
}: StatusOptionsProps) {
  return (
    <Card className="bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-green-100 dark:border-green-900 shadow-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900 pb-4">
        <div>
          <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center">
            <TagIcon className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
            Patient Status Options
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400">
            Define possible status values for patients using this template
          </CardDescription>
        </div>
        {!isViewMode && (
          <Button
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white shadow-sm"
            onClick={onAddStatus}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Status
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {template.statusOptions.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-green-200 dark:border-green-900 rounded-lg bg-green-50/50 dark:bg-green-900/10">
            <div className="bg-white dark:bg-slate-700 shadow-sm rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 border border-green-100 dark:border-green-900">
              <AlertCircleIcon className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-green-800 dark:text-green-300 font-medium text-lg mb-2">
              No Status Options Found
            </h3>
            <p className="text-green-600 dark:text-green-400 text-sm max-w-md mx-auto">
              Status options define the possible states for patients using this
              template. Add at least one status to get started.
            </p>
            {!isViewMode && (
              <Button
                className="mt-6 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white shadow-sm transition-all duration-200 hover:scale-105"
                onClick={onAddStatus}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add First Status
              </Button>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-green-600 dark:text-green-400">
                <span className="font-medium text-green-800 dark:text-green-300">
                  {template.statusOptions.length}
                </span>{" "}
                status{" "}
                {template.statusOptions.length === 1 ? "option" : "options"}{" "}
                defined
              </p>
              {!isViewMode && template.statusOptions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-900 hover:bg-green-50 dark:hover:bg-green-900/20"
                  onClick={onAddStatus}
                >
                  <PlusIcon className="mr-1 h-3 w-3" />
                  Add Another Status
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {template.statusOptions.map((status, index) => (
                <StatusOptionItem
                  key={index}
                  status={status}
                  isViewMode={isViewMode}
                  onEditStatus={() => onEditStatus(status)}
                  onDeleteStatus={() => setStatusToDelete(status._id || "")}
                  isOnlyStatus={template.statusOptions.length <= 1}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

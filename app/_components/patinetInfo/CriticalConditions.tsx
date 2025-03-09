import { AlertTriangleIcon } from "lucide-react";
import React from "react";

type Props = {
  isSmoker: boolean;
  smokingDetails: string;
  criticalConditions: string[];
};

function CriticalConditionsComponent({
  isSmoker,
  smokingDetails,
  criticalConditions,
}: Props) {
  return (
    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
      <div className="flex items-center">
        <AlertTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
            Critical Information:
          </h3>
          <p className="text-sm text-red-700 dark:text-red-200">
            <span className="font-medium">Medical Conditions:</span>{" "}
            {criticalConditions.join(", ")}
            {isSmoker && (
              <>
                {" "}
                | <span className="font-medium">Smoker:</span> {smokingDetails}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CriticalConditionsComponent;

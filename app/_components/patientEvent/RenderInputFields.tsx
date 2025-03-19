import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

function RenderInputFields({
  tests,
}: {
  tests: {
    id: string;
    label: string;
    unit: string;
    value: string;
    onChange: (value: string) => void;
    units?: string;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tests.map((test) => (
        <div
          key={test.id}
          className="flex flex-col space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80"
        >
          <div className="space-y-2">
            <Label
              htmlFor={test.id}
              className="font-medium text-sm dark:text-gray-300"
            >
              {test.label}
            </Label>
            <div className="flex">
              <Input
                id={test.id}
                value={test.value}
                onChange={(e) => test.onChange(e.target.value)}
                placeholder={`Enter ${test.label}`}
                className="focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
              />
              {test.unit && (
                <span className="ml-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  {test.unit}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RenderInputFields;

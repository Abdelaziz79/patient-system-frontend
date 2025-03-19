// LabHistoryTable.tsx
"use client";

import { format } from "date-fns";
import { LabTest, LabTestRecord } from "./LabsTab";

// Component for rendering lab test history table
function LabHistoryTable({
  tests,
  history,
}: {
  tests: LabTest[];
  history: LabTestRecord[];
}) {
  return (
    <div className="overflow-x-auto mt-4 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-600 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
        <thead className="bg-gray-50 dark:bg-slate-700">
          <tr>
            <th
              scope="col"
              className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Date
            </th>
            {tests.map((test) => (
              <th
                key={test.id}
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {test.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
          {history.map((record, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
            >
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                {format(new Date(record.date), "MMM dd, yyyy")}
              </td>
              {tests.map((test) => (
                <td
                  key={test.id}
                  className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                >
                  {record[test.id]
                    ? `${record[test.id]} ${test.unit || ""}`
                    : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LabHistoryTable;

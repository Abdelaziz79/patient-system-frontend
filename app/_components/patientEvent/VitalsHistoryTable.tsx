"use client";

import { format } from "date-fns";
import { FluidBalanceRecord, VitalSignRecord } from "./VitalsTab";

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "MMM dd, yyyy");
};

function VitalsHistoryTable({
  headers,
  data,
  recordKeys,
  units,
}: {
  headers: string[];
  data: VitalSignRecord[] | FluidBalanceRecord[];
  recordKeys: string[];
  units: Record<string, string>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-md">
        <thead className="bg-gray-50 dark:bg-slate-700 text-xs uppercase">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-medium border-b"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0 ? "bg-gray-50 dark:bg-slate-700/50" : ""
              }
            >
              {recordKeys.map((key) => (
                <td
                  key={key}
                  className="px-4 py-2 text-sm border-b border-gray-100 dark:border-slate-600"
                >
                  {key === "date"
                    ? formatDate(record[key])
                    : `${record[key as keyof typeof record]}${
                        units[key] ? " " + units[key] : ""
                      }`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VitalsHistoryTable;

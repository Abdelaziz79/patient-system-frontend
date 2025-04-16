// src/app/admin/users/stats/components/StatCard.tsx
import React from "react";

type ColorType = "green" | "blue" | "red" | "yellow" | "purple" | "gray";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: ColorType;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  const colorClasses = {
    green:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    purple:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    gray: "bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400",
  };

  return (
    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md transition-shadow hover:shadow-lg rounded-lg">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-green-800 dark:text-green-300 mt-1">
              {value}
            </h3>
          </div>
          <div
            className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

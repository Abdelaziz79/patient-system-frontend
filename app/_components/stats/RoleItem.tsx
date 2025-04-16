// src/app/admin/users/stats/components/RoleItem.tsx
import React from "react";

type ColorType = "red" | "blue" | "green" | "yellow";

interface RoleItemProps {
  title: string;
  count: number;
  icon: React.ElementType;
  color: ColorType;
}

export default function RoleItem({
  title,
  count,
  icon: Icon,
  color,
}: RoleItemProps) {
  const colorClasses = {
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-all">
      <div className="flex items-center">
        <div
          className={`h-8 w-8 rounded-md flex items-center justify-center mr-4 ${colorClasses[color]}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span className="font-medium">{title}</span>
      </div>
      <span className="font-bold">{count}</span>
    </div>
  );
}

// src/app/admin/users/stats/components/RoleItem.tsx
import React from "react";
import { motion } from "framer-motion";

type ColorType = "red" | "blue" | "green" | "yellow";

interface RoleItemProps {
  title: string;
  count: number;
  icon: React.ElementType;
  color: ColorType;
  isRTL?: boolean;
}

export default function RoleItem({
  title,
  count,
  icon: Icon,
  color,
  isRTL = false,
}: RoleItemProps) {
  const colorClasses = {
    red: {
      bg: "bg-red-100/80 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-900/30",
      hover: "hover:bg-red-100 dark:hover:bg-red-900/40",
    },
    blue: {
      bg: "bg-blue-100/80 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-900/30",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-900/40",
    },
    green: {
      bg: "bg-green-100/80 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-900/30",
      hover: "hover:bg-green-100 dark:hover:bg-green-900/40",
    },
    yellow: {
      bg: "bg-yellow-100/80 dark:bg-yellow-900/30",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-900/30",
      hover: "hover:bg-yellow-100 dark:hover:bg-yellow-900/40",
    },
  };

  return (
    <motion.div
      className={`flex items-center justify-between p-3 rounded-xl border ${
        colorClasses[color].border
      } ${
        colorClasses[color].hover
      } transition-all duration-300 shadow-sm hover:shadow-md group ${
        isRTL ? "flex-row-reverse" : ""
      }`}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
        <div
          className={`h-10 w-10 rounded-lg flex items-center justify-center ${
            isRTL ? "mx-4" : "mx-4"
          } ${colorClasses[color].bg} ${
            colorClasses[color].text
          } shadow-sm group-hover:scale-110 transition-all duration-300`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {title}
        </span>
      </div>
      <span className="font-bold text-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
        {count.toLocaleString()}
      </span>
    </motion.div>
  );
}

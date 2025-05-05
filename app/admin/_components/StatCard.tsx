import React from "react";

type ColorType = "green" | "blue" | "red" | "yellow" | "purple" | "gray";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: ColorType;
  isRTL?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  isRTL = false,
}: StatCardProps) {
  const colorClasses = {
    green: {
      bg: "bg-green-100/80 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
      gradient:
        "from-green-600 to-green-800 dark:from-green-400 dark:to-green-600",
    },
    blue: {
      bg: "bg-blue-100/80 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      gradient: "from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600",
    },
    red: {
      bg: "bg-red-100/80 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
      gradient: "from-red-600 to-red-800 dark:from-red-400 dark:to-red-600",
    },
    yellow: {
      bg: "bg-yellow-100/80 dark:bg-yellow-900/30",
      text: "text-yellow-600 dark:text-yellow-400",
      gradient:
        "from-yellow-600 to-yellow-800 dark:from-yellow-400 dark:to-yellow-600",
    },
    purple: {
      bg: "bg-purple-100/80 dark:bg-purple-900/30",
      text: "text-purple-600 dark:text-purple-400",
      gradient:
        "from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600",
    },
    gray: {
      bg: "bg-gray-100/80 dark:bg-gray-700/30",
      text: "text-gray-600 dark:text-gray-400",
      gradient: "from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-600",
    },
  };

  return (
    <div
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <p
              className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${
                isRTL ? "text-right" : ""
              }`}
            >
              {title}
            </p>
            <h3
              className={`text-3xl font-bold bg-gradient-to-r ${
                colorClasses[color].gradient
              } bg-clip-text text-transparent ${isRTL ? "text-right" : ""}`}
            >
              {value.toLocaleString()}
            </h3>
          </div>
          <div
            className={`h-14 w-14 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-300 ${colorClasses[color].bg} ${colorClasses[color].text}`}
          >
            <Icon className="h-7 w-7" />
          </div>
        </div>
      </div>
    </div>
  );
}

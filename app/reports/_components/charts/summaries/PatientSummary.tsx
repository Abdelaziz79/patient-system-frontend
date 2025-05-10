"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface PatientSummaryProps {
  title: string;
  total: number;
  active: number;
  inactive: number;
  avgAge?: number;
  genderDistribution?: Array<{
    gender: string;
    count: number;
    percentage: number;
  }>;
  statusDistribution?: Array<{
    status?: string;
    name?: string;
    count: number;
    percentage: number;
  }>;
}

export const PatientSummaryComponent = ({
  title,
  total,
  active,
  inactive,
  avgAge,
  genderDistribution,
  statusDistribution,
}: PatientSummaryProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Style variables for consistent theming
  const backgroundColor = isDark ? "bg-slate-900/90" : "bg-white/90";
  const headerBackground = isDark
    ? "from-blue-950/40 to-slate-900/95"
    : "from-blue-50/80 to-white/80";
  const borderColor = isDark ? "border-blue-950/30" : "border-blue-100/60";
  const tileBg = isDark ? "bg-blue-950/30" : "bg-blue-50/40";
  const tileBorder = isDark ? "border-blue-900/30" : "border-blue-100/80";
  const progressBg = isDark ? "bg-blue-900/30" : "bg-blue-100/50";
  const progressFill = isDark ? "bg-blue-600" : "bg-blue-500";

  // Animation variants for smooth entrance
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      <Card
        className={`w-full md:col-span-2 overflow-hidden hover:shadow-lg transition-all duration-300 ${borderColor} ${backgroundColor} backdrop-blur-lg`}
      >
        <CardHeader
          className={`pb-2 bg-gradient-to-r ${headerBackground} border-b border-blue-100/50 dark:border-blue-950/20`}
        >
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-6">
            <motion.div
              variants={item}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4"
            >
              <div
                className={`border ${tileBorder} p-4 rounded-lg shadow-sm ${tileBg}`}
              >
                <h3 className="font-medium text-blue-700/90 dark:text-blue-300/90">
                  Total Patients
                </h3>
                <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-400 bg-clip-text text-transparent">
                  {total}
                </p>
              </div>

              <div
                className={`border ${tileBorder} p-4 rounded-lg shadow-sm ${tileBg}`}
              >
                <h3 className="font-medium text-blue-700/90 dark:text-blue-300/90">
                  Active
                </h3>
                <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-400 bg-clip-text text-transparent">
                  {active}
                </p>
              </div>

              <div
                className={`border ${tileBorder} p-4 rounded-lg shadow-sm ${tileBg}`}
              >
                <h3 className="font-medium text-blue-700/90 dark:text-blue-300/90">
                  Inactive
                </h3>
                <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-400 bg-clip-text text-transparent">
                  {inactive}
                </p>
              </div>

              <div
                className={`border ${tileBorder} p-4 rounded-lg shadow-sm ${tileBg}`}
              >
                <h3 className="font-medium text-blue-700/90 dark:text-blue-300/90">
                  Average Age
                </h3>
                <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-400 bg-clip-text text-transparent">
                  {avgAge || "Unknown"}
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {genderDistribution && genderDistribution.length > 0 && (
                <div
                  className={`border ${tileBorder} p-4 rounded-lg shadow-sm`}
                >
                  <h3 className="font-medium mb-3 text-blue-700/90 dark:text-blue-300/90">
                    Gender Distribution
                  </h3>
                  <div className="flex flex-col gap-3">
                    {genderDistribution.map((item) => (
                      <div key={item.gender} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-600/80 dark:text-blue-400/80">
                            {item.gender || "Unknown"}
                          </span>
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            {item.count} ({item.percentage}%)
                          </span>
                        </div>
                        <div
                          className={`w-full ${progressBg} h-2 rounded-full overflow-hidden`}
                        >
                          <div
                            className={`${progressFill} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {statusDistribution && statusDistribution.length > 0 && (
                <div
                  className={`border ${tileBorder} p-4 rounded-lg shadow-sm`}
                >
                  <h3 className="font-medium mb-3 text-blue-700/90 dark:text-blue-300/90">
                    Status Distribution
                  </h3>
                  <div className="flex flex-col gap-3">
                    {statusDistribution.map((item) => (
                      <div key={item.status || item.name} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-600/80 dark:text-blue-400/80">
                            {item.status || item.name}
                          </span>
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            {item.count} ({item.percentage}%)
                          </span>
                        </div>
                        <div
                          className={`w-full ${progressBg} h-2 rounded-full overflow-hidden`}
                        >
                          <div
                            className={`${progressFill} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

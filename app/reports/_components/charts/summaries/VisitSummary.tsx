"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface VisitSummaryProps {
  title: string;
  field: string;
  totalVisits: number;
  totalPatients: number;
  avgVisitsPerPatient: string | number;
  visitsByDayOfWeek?: Array<{ day: string; count: number; percentage: number }>;
  mostRecentVisit?: Record<string, any>;
  oldestVisit?: Record<string, any>;
}

export const VisitSummaryComponent = ({
  title,
  field,
  totalVisits,
  totalPatients,
  avgVisitsPerPatient,
  visitsByDayOfWeek,
  mostRecentVisit,
  oldestVisit,
}: VisitSummaryProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Style variables for consistent theming
  const backgroundColor = isDark ? "bg-slate-900/90" : "bg-white/90";
  const headerBackground = isDark
    ? "from-blue-950/40 to-slate-900/95"
    : "from-blue-50/80 to-white/80";
  const borderColor = isDark ? "border-blue-950/30" : "border-blue-100/60";
  const tileBg = isDark ? "bg-blue-950/30" : "bg-blue-50/40";
  const tileColor = isDark ? "text-blue-300" : "text-blue-700";
  const tileBorder = isDark ? "border-blue-900/30" : "border-blue-100/80";
  const barEmptyBg = isDark ? "bg-blue-900/20" : "bg-blue-100/30";
  const barFillBg = isDark ? "bg-blue-600" : "bg-blue-500";
  const textLabel = isDark ? "text-blue-300/90" : "text-blue-700/90";
  const textValue = isDark ? "text-blue-400/90" : "text-blue-600/90";

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
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div
                className={`border ${tileBorder} p-4 rounded-lg shadow-sm ${tileBg}`}
              >
                <h3 className="font-medium text-blue-700/90 dark:text-blue-300/90">
                  Total Visits
                </h3>
                <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-400 bg-clip-text text-transparent">
                  {totalVisits}
                </p>
              </div>

              <div
                className={`border ${tileBorder} p-4 rounded-lg shadow-sm ${tileBg}`}
              >
                <h3 className="font-medium text-blue-700/90 dark:text-blue-300/90">
                  Total Patients
                </h3>
                <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-400 bg-clip-text text-transparent">
                  {totalPatients}
                </p>
              </div>

              <div
                className={`border ${tileBorder} p-4 rounded-lg shadow-sm ${tileBg}`}
              >
                <h3 className="font-medium text-blue-700/90 dark:text-blue-300/90">
                  Avg Visits/Patient
                </h3>
                <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-400 bg-clip-text text-transparent">
                  {avgVisitsPerPatient}
                </p>
              </div>
            </motion.div>

            {visitsByDayOfWeek && visitsByDayOfWeek.length > 0 && (
              <motion.div
                variants={item}
                className={`border ${tileBorder} p-4 rounded-lg shadow-sm`}
              >
                <h3 className="font-medium mb-3 text-blue-700/90 dark:text-blue-300/90">
                  Visits by Day of Week
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {visitsByDayOfWeek.map((day) => (
                    <div key={day.day} className="text-center">
                      <div className={`text-xs ${textLabel}`}>
                        {day.day.substring(0, 3)}
                      </div>
                      <div
                        className={`h-16 relative mt-1 rounded-t-sm ${barEmptyBg}`}
                      >
                        <div
                          className={`absolute bottom-0 left-0 right-0 ${barFillBg} rounded-t-sm transition-all duration-500`}
                          style={{
                            height: `${Math.max(day.percentage, 5)}%`,
                          }}
                        ></div>
                      </div>
                      <div className={`text-xs mt-1 font-medium ${textLabel}`}>
                        {day.count}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              variants={item}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {mostRecentVisit && (
                <div
                  className={`border ${tileBorder} p-4 rounded-lg shadow-sm`}
                >
                  <h3 className="font-medium mb-2 text-blue-700/90 dark:text-blue-300/90">
                    Most Recent Visit
                  </h3>
                  <p className="text-sm">
                    <span className={`font-medium ${textLabel}`}>Patient:</span>{" "}
                    <span className={textValue}>
                      {mostRecentVisit.patientName}
                    </span>
                  </p>
                  <p className="text-sm mt-1">
                    <span className={`font-medium ${textLabel}`}>Title:</span>{" "}
                    <span className={textValue}>{mostRecentVisit.title}</span>
                  </p>
                  <p className="text-sm mt-1">
                    <span className={`font-medium ${textLabel}`}>Date:</span>{" "}
                    <span className={textValue}>
                      {new Date(mostRecentVisit.date).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              )}

              {oldestVisit && (
                <div
                  className={`border ${tileBorder} p-4 rounded-lg shadow-sm`}
                >
                  <h3 className="font-medium mb-2 text-blue-700/90 dark:text-blue-300/90">
                    Oldest Visit
                  </h3>
                  <p className="text-sm">
                    <span className={`font-medium ${textLabel}`}>Patient:</span>{" "}
                    <span className={textValue}>{oldestVisit.patientName}</span>
                  </p>
                  <p className="text-sm mt-1">
                    <span className={`font-medium ${textLabel}`}>Title:</span>{" "}
                    <span className={textValue}>{oldestVisit.title}</span>
                  </p>
                  <p className="text-sm mt-1">
                    <span className={`font-medium ${textLabel}`}>Date:</span>{" "}
                    <span className={textValue}>
                      {new Date(oldestVisit.date).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface StatusSummaryProps {
  title: string;
  field: string;
  statusDistribution?: Array<{
    status?: string;
    name?: string;
    count: number;
    percentage: number;
  }>;
  avgDaysInCurrentStatus?: number;
  statusTransitions?: Array<{ from: string; to: string; count: number }>;
}

export const StatusSummaryComponent = ({
  title,
  field,
  statusDistribution,
  avgDaysInCurrentStatus,
  statusTransitions,
}: StatusSummaryProps) => {
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
  const progressBg = isDark ? "bg-blue-900/30" : "bg-blue-100/50";
  const progressFill = isDark ? "bg-blue-600" : "bg-blue-500";
  const metricBg = isDark ? "bg-blue-900/20" : "bg-blue-50/70";
  const textMuted = isDark ? "text-blue-400/70" : "text-blue-600/70";
  const tableBg = isDark ? "bg-blue-900/20" : "bg-blue-50/50";
  const cellHighlight = isDark ? "rgba(94, 138, 230, " : "rgba(99, 102, 241, ";

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
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className={`border ${tileBorder} p-4 rounded-lg shadow-sm`}>
                <h3 className="font-medium mb-3 text-blue-700/90 dark:text-blue-300/90">
                  Status Distribution
                </h3>
                <div className="flex flex-col gap-3">
                  {statusDistribution &&
                    statusDistribution.map((item) => (
                      <div key={item.name || item.status} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm capitalize text-blue-600/80 dark:text-blue-400/80">
                            {(item.name || item.status || "").replace("_", " ")}
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

              <div className={`border ${tileBorder} p-4 rounded-lg shadow-sm`}>
                <h3 className="font-medium mb-2 text-blue-700/90 dark:text-blue-300/90">
                  Status Metrics
                </h3>
                <div className="space-y-4">
                  <div
                    className={`${metricBg} p-3 rounded-lg border ${tileBorder}`}
                  >
                    <p className={`text-sm ${textMuted}`}>
                      Average Days in Current Status
                    </p>
                    <p className="text-xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-400 bg-clip-text text-transparent">
                      {avgDaysInCurrentStatus}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 text-blue-700/90 dark:text-blue-300/90">
                      Top Status Transitions
                    </h4>
                    <div className="space-y-2">
                      {statusTransitions &&
                        [...statusTransitions]
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 4)
                          .map((transition, idx) => (
                            <div
                              key={idx}
                              className={`flex justify-between text-sm border-b pb-1 ${tileBorder}`}
                            >
                              <span className="capitalize text-blue-600/80 dark:text-blue-400/80">
                                {transition.from.replace("_", " ")} →{" "}
                                {transition.to.replace("_", " ")}
                              </span>
                              <span className="font-medium text-blue-700 dark:text-blue-300">
                                {transition.count}
                              </span>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {statusTransitions && statusTransitions.length > 0 && (
              <motion.div
                variants={item}
                className={`border ${tileBorder} p-4 rounded-lg shadow-sm`}
              >
                <h3 className="font-medium mb-3 text-blue-700/90 dark:text-blue-300/90">
                  Status Transition Matrix
                </h3>
                <div className="overflow-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th
                          className={`p-2 border ${tileBorder} text-left ${tableBg} ${tileColor}`}
                        >
                          From → To
                        </th>
                        {(() => {
                          // Create a properly typed array of toStatuses
                          const toStatuses: string[] = Array.from(
                            new Set(
                              statusTransitions.map((t) => t.to as string)
                            )
                          );
                          return toStatuses.map((toStatus) => (
                            <th
                              key={toStatus}
                              className={`p-2 border ${tileBorder} text-center capitalize ${tableBg} ${tileColor}`}
                            >
                              {toStatus.replace("_", " ")}
                            </th>
                          ));
                        })()}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Create a properly typed array of fromStatuses
                        const fromStatuses: string[] = Array.from(
                          new Set(
                            statusTransitions.map((t) => t.from as string)
                          )
                        );
                        return fromStatuses.map((fromStatus) => (
                          <tr key={fromStatus}>
                            <th
                              className={`p-2 border ${tileBorder} text-left capitalize ${metricBg} ${tileColor}`}
                            >
                              {fromStatus.replace("_", " ")}
                            </th>
                            {(() => {
                              // Create another properly typed array of toStatuses for each row
                              const toStatuses: string[] = Array.from(
                                new Set(
                                  statusTransitions.map((t) => t.to as string)
                                )
                              );
                              return toStatuses.map((toStatus) => {
                                const transition = statusTransitions.find(
                                  (t) =>
                                    t.from === fromStatus && t.to === toStatus
                                );
                                const count = transition ? transition.count : 0;
                                const maxCount = Math.max(
                                  ...statusTransitions.map((t) => t.count)
                                );
                                const intensity =
                                  maxCount > 0
                                    ? Math.min((count / maxCount) * 0.8, 0.8)
                                    : 0;

                                return (
                                  <td
                                    key={`${fromStatus}-${toStatus}`}
                                    className={`p-2 border ${tileBorder} text-center ${tileColor}`}
                                    style={{
                                      backgroundColor:
                                        count > 0
                                          ? `${cellHighlight}${intensity})`
                                          : isDark
                                          ? "rgba(30, 41, 59, 0.4)"
                                          : "rgba(243, 244, 246, 0.7)",
                                    }}
                                  >
                                    {count}
                                  </td>
                                );
                              });
                            })()}
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

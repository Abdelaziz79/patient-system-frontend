"use client";

import { HeatmapScatterProps, ChartDataPoint } from "./types";
import { ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export const HeatmapComponent = ({ data, title }: HeatmapScatterProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Style variables for consistent theming
  const backgroundColor = isDark ? "bg-slate-900/90" : "bg-white/90";
  const headerBackground = isDark
    ? "from-blue-950/40 to-slate-900/95"
    : "from-blue-50/80 to-white/80";
  const borderColor = isDark ? "border-blue-950/30" : "border-blue-100/60";
  const cellBackground = isDark ? "rgba(94, 138, 230, " : "rgba(99, 102, 241, ";
  const textColor = isDark ? "text-blue-300" : "text-blue-700";
  const mutedTextColor = isDark ? "text-blue-400/70" : "text-blue-600/70";

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

  // Check if we have fromStatus/toStatus format data (for status reports)
  const isStatusHeatmap =
    data.length > 0 && "fromStatus" in data[0] && "toStatus" in data[0];

  // Check if we have day/hour format data (for visit reports)
  const isVisitHeatmap =
    data.length > 0 && "day" in data[0] && "hour" in data[0];

  if (isStatusHeatmap) {
    // Get unique statuses
    const statuses = Array.from(
      new Set([
        ...data.map((item: any) => item.fromStatus),
        ...data.map((item: any) => item.toStatus),
      ])
    );

    // Find max value for color intensity scaling
    const maxValue = Math.max(...data.map((item: any) => item.value || 0));

    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        <Card
          className={`w-full h-auto md:col-span-2 overflow-hidden hover:shadow-lg transition-all duration-300 ${borderColor} ${backgroundColor} backdrop-blur-lg`}
        >
          <CardHeader
            className={`pb-2 bg-gradient-to-r ${headerBackground} border-b border-blue-100/50 dark:border-blue-950/20`}
          >
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <motion.div variants={item} className="overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th
                      className={`p-2 border border-blue-100/40 dark:border-blue-900/30 ${textColor} text-left bg-blue-50/50 dark:bg-blue-950/40`}
                    >
                      From → To
                    </th>
                    {statuses.map((status: any) => (
                      <th
                        key={status}
                        className={`p-2 border border-blue-100/40 dark:border-blue-900/30 ${textColor} text-center capitalize bg-blue-50/50 dark:bg-blue-950/40`}
                      >
                        {status.replace("_", " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {statuses.map((fromStatus: any) => (
                    <tr key={fromStatus}>
                      <th
                        className={`p-2 border border-blue-100/40 dark:border-blue-900/30 ${textColor} text-left capitalize bg-blue-50/30 dark:bg-blue-950/30`}
                      >
                        {fromStatus.replace("_", " ")}
                      </th>
                      {statuses.map((toStatus: any) => {
                        const cell = data.find(
                          (item: any) =>
                            item.fromStatus === fromStatus &&
                            item.toStatus === toStatus
                        );
                        const value: number =
                          cell && typeof cell.value === "number"
                            ? cell.value
                            : 0;
                        const intensity =
                          maxValue > 0
                            ? Math.min((value / maxValue) * 0.9, 0.9)
                            : 0;

                        return (
                          <td
                            key={`${fromStatus}-${toStatus}`}
                            className={`p-2 border border-blue-100/40 dark:border-blue-900/30 text-center ${textColor}`}
                            style={{
                              backgroundColor:
                                value > 0
                                  ? `${cellBackground}${intensity})`
                                  : isDark
                                  ? "rgba(30, 41, 59, 0.4)"
                                  : "rgba(243, 244, 246, 0.7)",
                            }}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isVisitHeatmap) {
    // Get unique days and hours
    const days = Array.from(new Set(data.map((item: any) => item.day)));
    const hours = Array.from(new Set(data.map((item: any) => item.hour))).sort(
      (a: any, b: any) => a - b
    );

    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        <Card
          className={`w-full h-auto md:col-span-2 overflow-hidden hover:shadow-lg transition-all duration-300 ${borderColor} ${backgroundColor} backdrop-blur-lg`}
        >
          <CardHeader
            className={`pb-2 bg-gradient-to-r ${headerBackground} border-b border-blue-100/50 dark:border-blue-950/20`}
          >
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <motion.div variants={item} className="overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th
                      className={`p-2 border border-blue-100/40 dark:border-blue-900/30 ${textColor} text-left bg-blue-50/50 dark:bg-blue-950/40`}
                    >
                      &nbsp;
                    </th>
                    {hours.map((hour: any) => (
                      <th
                        key={hour}
                        className={`p-2 border border-blue-100/40 dark:border-blue-900/30 ${textColor} text-center bg-blue-50/50 dark:bg-blue-950/40`}
                        style={{ minWidth: "40px" }}
                      >
                        {hour}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day: any) => (
                    <tr key={day}>
                      <th
                        className={`p-2 border border-blue-100/40 dark:border-blue-900/30 ${textColor} text-left bg-blue-50/30 dark:bg-blue-950/30`}
                      >
                        {day}
                      </th>
                      {hours.map((hour: any) => {
                        const cell = data.find(
                          (item: any) => item.day === day && item.hour === hour
                        );
                        const value: number =
                          cell && typeof cell.value === "number"
                            ? cell.value
                            : 0;
                        const maxValue = Math.max(
                          ...data.map((item: any) =>
                            typeof item.value === "number" ? item.value : 0
                          )
                        );
                        const intensity =
                          maxValue > 0
                            ? Math.min((value / maxValue) * 0.9, 0.9)
                            : 0;

                        return (
                          <td
                            key={`${day}-${hour}`}
                            className={`p-2 border border-blue-100/40 dark:border-blue-900/30 text-center ${textColor}`}
                            style={{
                              backgroundColor:
                                value > 0
                                  ? `${cellBackground}${intensity})`
                                  : isDark
                                  ? "rgba(30, 41, 59, 0.4)"
                                  : "rgba(243, 244, 246, 0.7)",
                            }}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Original implementation for standard heatmaps
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      <Card
        className={`w-full h-auto overflow-hidden hover:shadow-lg transition-all duration-300 ${borderColor} ${backgroundColor} backdrop-blur-lg`}
      >
        <CardHeader
          className={`pb-2 bg-gradient-to-r ${headerBackground} border-b border-blue-100/50 dark:border-blue-950/20`}
        >
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {data.length > 0 && data[0].x === "Unknown" ? (
            <motion.div
              variants={item}
              className={`flex items-center justify-center h-64 ${mutedTextColor}`}
            >
              Not enough data to display heatmap
            </motion.div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              {/* Simple representation as table since recharts doesn't have built-in heatmap */}
              <motion.div variants={item} className="overflow-auto h-full">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th
                        className={`p-2 border border-blue-100/40 dark:border-blue-900/30 ${textColor} bg-blue-50/50 dark:bg-blue-950/40`}
                      >
                        &nbsp;
                      </th>
                      {Array.from(
                        new Set(data.map((item: ChartDataPoint) => item.x))
                      ).map((x: any) => (
                        <th
                          key={x}
                          className={`p-2 border border-blue-100/40 dark:border-blue-900/30 ${textColor} text-center bg-blue-50/50 dark:bg-blue-950/40`}
                        >
                          {x}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(
                      new Set(data.map((item: ChartDataPoint) => item.y))
                    ).map((y: any) => (
                      <tr key={y}>
                        <th
                          className={`p-2 border border-blue-100/40 dark:border-blue-900/30 ${textColor} text-left bg-blue-50/30 dark:bg-blue-950/30`}
                        >
                          {y}
                        </th>
                        {Array.from(
                          new Set(data.map((item: ChartDataPoint) => item.x))
                        ).map((x: any) => {
                          const cell = data.find(
                            (item: ChartDataPoint) =>
                              item.x === x && item.y === y
                          );
                          const value: number =
                            cell && typeof cell.value === "number"
                              ? cell.value
                              : 0;
                          const maxValue = Math.max(
                            ...data
                              .filter((item) => typeof item.value === "number")
                              .map((item) => item.value as number)
                          );
                          const intensity =
                            maxValue > 0
                              ? Math.min((value / maxValue) * 0.9, 0.9)
                              : 0;

                          return (
                            <td
                              key={`${y}-${x}`}
                              className={`p-2 border border-blue-100/40 dark:border-blue-900/30 text-center ${textColor}`}
                              style={{
                                backgroundColor:
                                  value > 0
                                    ? `${cellBackground}${intensity})`
                                    : isDark
                                    ? "rgba(30, 41, 59, 0.4)"
                                    : "rgba(243, 244, 246, 0.7)",
                              }}
                            >
                              {value}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

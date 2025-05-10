"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HeatmapScatterProps } from "./types";

// Custom tooltip for better visual display
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 p-3 border border-blue-100/50 dark:border-blue-950/40 rounded-md shadow-md backdrop-blur-sm">
        <p className="font-medium text-sm mb-1 text-blue-700 dark:text-blue-200">{`${payload[0].name}: ${payload[0].value}`}</p>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].color }}
          />
          <p className="text-sm text-blue-600/90 dark:text-blue-300/90">
            <span className="font-medium">Category: </span>
            <span className="font-semibold">{payload[0].payload.x}</span>
          </p>
        </div>
        <p className="text-sm text-blue-600/90 dark:text-blue-300/90">
          <span className="font-medium">Value: </span>
          <span className="font-semibold">{payload[0].payload.y}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const ScatterChartComponent = ({ data, title }: HeatmapScatterProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Colors for dark/light mode
  const axisColor = isDark ? "#7BA4EF" : "#4B74C9";
  const gridColor = isDark
    ? "rgba(120, 160, 230, 0.25)"
    : "rgba(75, 116, 201, 0.25)";
  const gridOpacity = 0.7;
  const textColor = isDark ? "#7BA4EF" : "#4B74C9";
  const backgroundColor = isDark ? "bg-slate-900/90" : "bg-white/90";
  const headerBackground = isDark
    ? "from-blue-950/40 to-slate-900/95"
    : "from-blue-50/80 to-white/80";
  const mutedTextColor = isDark ? "text-blue-400/70" : "text-blue-600/70";
  const scatterColor = isDark ? "#5E8AE6" : "#6366F1";

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
        className={`w-full h-96 overflow-hidden hover:shadow-lg transition-all duration-300 border-blue-100/60 dark:border-blue-950/30 ${backgroundColor} backdrop-blur-lg`}
      >
        <CardHeader
          className={`pb-2 bg-gradient-to-r ${headerBackground} border-b border-blue-100/50 dark:border-blue-950/20`}
        >
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-80">
          {data.length > 0 && data[0].x === "No Data" ? (
            <motion.div
              variants={item}
              className={`flex items-center justify-center h-full ${mutedTextColor}`}
            >
              Not enough data to display scatter chart
            </motion.div>
          ) : (
            <motion.div variants={item} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={gridOpacity}
                    stroke={gridColor}
                  />
                  <XAxis
                    type="category"
                    dataKey="x"
                    name="Category"
                    tick={{ fontSize: 11, fill: textColor }}
                    tickLine={{ stroke: axisColor }}
                    axisLine={{ stroke: axisColor }}
                    tickMargin={8}
                  />
                  <YAxis
                    dataKey="y"
                    name="Value"
                    tick={{ fontSize: 11, fill: textColor }}
                    tickLine={{ stroke: axisColor }}
                    axisLine={{ stroke: axisColor }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      strokeDasharray: "3 3",
                      stroke: isDark ? "#4B74C9" : "#6366F1",
                      strokeOpacity: 0.6,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                    formatter={(value) => (
                      <span style={{ color: isDark ? "#7BA4EF" : "#4B74C9" }}>
                        {value}
                      </span>
                    )}
                  />
                  <Scatter
                    name={title}
                    data={data}
                    fill={scatterColor}
                    stroke={isDark ? "#1E293B" : "#ffffff"}
                    strokeWidth={1.5}
                    animationDuration={1500}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

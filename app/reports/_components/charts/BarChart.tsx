"use client";

import { BarLineChartProps, getColor } from "./types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

// Custom tooltip for better visual display
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 p-3 border border-blue-100/50 dark:border-blue-950/40 rounded-md shadow-md backdrop-blur-sm">
        <p className="font-medium text-sm mb-1 text-blue-700 dark:text-blue-200">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm text-blue-600/90 dark:text-blue-300/90">
              <span className="font-medium">{entry.name}: </span>
              <span className="font-semibold">{entry.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const BarChartComponent = ({ data, title }: BarLineChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Colors for dark/light mode - adjusted for darker theme
  const axisColor = isDark ? "#7BA4EF" : "#4B74C9";
  // Improved grid color for better visibility in both modes
  const gridColor = isDark
    ? "rgba(120, 160, 230, 0.25)"
    : "rgba(75, 116, 201, 0.25)";
  const gridOpacity = 0.7; // Increased opacity for better visibility
  const textColor = isDark ? "#7BA4EF" : "#4B74C9";
  const backgroundColor = isDark ? "bg-slate-900/90" : "bg-white/90";
  const headerBackground = isDark
    ? "from-blue-950/40 to-slate-900/95"
    : "from-blue-50/80 to-white/80";

  // Adjust color brightness for dark mode
  const getDarkModeAdjustedColor = (index: number): string => {
    const baseColor = getColor(index);
    // If in dark mode, make colors more vibrant but not too bright
    if (isDark) {
      // This is a simple approach - for a more sophisticated approach,
      // you could use a color manipulation library
      return baseColor === "#0088FE"
        ? "#3080E6"
        : baseColor === "#00C49F"
        ? "#00B090"
        : baseColor === "#FFBB28"
        ? "#EAA820"
        : baseColor === "#FF8042"
        ? "#E86830"
        : baseColor === "#8884d8"
        ? "#7A76C8"
        : baseColor === "#82ca9d"
        ? "#70B889"
        : baseColor === "#ffc658"
        ? "#E0B050"
        : baseColor === "#8dd1e1"
        ? "#70B8C8"
        : baseColor; // Default case
    }
    return baseColor;
  };

  // Check if this is a segment-based bar chart
  const hasSegmentAndGender =
    data.length > 0 && "segment" in data[0] && "gender" in data[0];

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

  if (hasSegmentAndGender) {
    // Process data for recharts
    // Group by segment, then by gender
    const segments = [...new Set(data.map((item: any) => item.segment))];
    const genders = [...new Set(data.map((item: any) => item.gender))];

    // Convert to format needed for recharts grouped bar chart
    const transformedData = segments.map((segment: string) => {
      const result: Record<string, any> = {
        segment: segment.replace("_", " "),
      };

      // Add count for each gender
      genders.forEach((gender: string) => {
        const matchingItem = data.find(
          (item: any) => item.segment === segment && item.gender === gender
        );
        result[gender] = matchingItem ? matchingItem.count : 0;
      });

      return result;
    });

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
            <motion.div variants={item} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={transformedData}
                  margin={{ top: 15, right: 25, left: 0, bottom: 40 }}
                  barGap={4}
                  barCategoryGap="12%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={gridOpacity}
                    stroke={gridColor}
                  />
                  <XAxis
                    dataKey="segment"
                    angle={-35}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 11, fill: textColor }}
                    tickLine={{ stroke: axisColor }}
                    axisLine={{ stroke: axisColor }}
                    tickMargin={8}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: textColor }}
                    tickLine={{ stroke: axisColor }}
                    axisLine={{ stroke: axisColor }}
                  />
                  <Tooltip content={<CustomTooltip />} />
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
                  {genders.map((gender: string, index: number) => (
                    <Bar
                      key={gender}
                      dataKey={gender}
                      fill={getDarkModeAdjustedColor(index)}
                      name={gender}
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                      animationBegin={index * 150}
                      className="hover:opacity-80 transition-opacity duration-300"
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Original implementation for standard bar charts
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
          <motion.div variants={item} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 15, right: 25, left: 0, bottom: 40 }}
                barCategoryGap="25%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={gridOpacity}
                  stroke={gridColor}
                />
                <XAxis
                  dataKey="period"
                  angle={-35}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 11, fill: textColor }}
                  tickLine={{ stroke: axisColor }}
                  axisLine={{ stroke: axisColor }}
                  tickMargin={8}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: textColor }}
                  tickLine={{ stroke: axisColor }}
                  axisLine={{ stroke: axisColor }}
                />
                <Tooltip content={<CustomTooltip />} />
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
                <Bar
                  dataKey="count"
                  fill={isDark ? "#5E8AE6" : "#6366F1"}
                  name="Count"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

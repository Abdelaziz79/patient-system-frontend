"use client";

import { useState } from "react";
import { PieChartProps, getColor } from "./types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

// Active pie sector rendering with enhanced styling
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const textColor = isDark ? "#BAD1FF" : "#334155";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-20}
        textAnchor="middle"
        fill={fill}
        className="font-medium text-[13px]"
      >
        {payload.label}
      </text>
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        fill={textColor}
        className="font-semibold text-[14px]"
      >{`${value} (${(percent * 100).toFixed(1)}%)`}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        strokeWidth={2}
        stroke={isDark ? "#1E293B" : "#fff"}
        className="drop-shadow-sm"
      />
    </g>
  );
};

// Custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 p-3 border border-blue-100/50 dark:border-blue-950/40 rounded-md shadow-md backdrop-blur-sm">
        <p className="font-medium text-sm mb-1 text-blue-700 dark:text-blue-200">
          {payload[0].name}
        </p>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].color }}
          />
          <p className="text-sm text-blue-600/90 dark:text-blue-300/90">
            <span className="font-medium">Value: </span>
            <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
        <p className="text-xs text-blue-500/70 dark:text-blue-400/70 mt-1">
          {`${(payload[0].percent * 100).toFixed(1)}% of total`}
        </p>
      </div>
    );
  }
  return null;
};

export const PieChartComponent = ({ data, title }: PieChartProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Style variables for consistent theming
  const backgroundColor = isDark ? "bg-slate-900/90" : "bg-white/90";
  const headerBackground = isDark
    ? "from-blue-950/40 to-slate-900/95"
    : "from-blue-50/80 to-white/80";
  const borderColor = isDark ? "border-blue-950/30" : "border-blue-100/60";
  const legendTextColor = isDark ? "#7BA4EF" : "#4B74C9";

  // Adjust color brightness for dark mode
  const getDarkModeAdjustedColor = (index: number): string => {
    const baseColor = getColor(index);
    // If in dark mode, make colors more vibrant but not too bright
    if (isDark) {
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

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Apply animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
        className={`w-full h-96 overflow-hidden hover:shadow-lg transition-all duration-300 ${borderColor} ${backgroundColor} backdrop-blur-lg`}
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
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={90}
                  dataKey="value"
                  nameKey="label"
                  onMouseEnter={onPieEnter}
                  paddingAngle={2}
                  animationBegin={300}
                  animationDuration={1500}
                  cornerRadius={3}
                >
                  {data.map((entry, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getDarkModeAdjustedColor(index)}
                      stroke={isDark ? "#1E293B" : "#ffffff"}
                      strokeWidth={1.5}
                      className="drop-shadow-sm hover:opacity-90 transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  iconSize={10}
                  iconType="circle"
                  formatter={(value) => (
                    <span
                      style={{
                        color: legendTextColor,
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {value}
                    </span>
                  )}
                  wrapperStyle={{ paddingTop: 15 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

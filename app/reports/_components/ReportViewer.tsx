"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IReport, IReportChart } from "@/app/_hooks/report/reportApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { AlertCircle, FileBarChart, Info } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ReportViewerProps {
  reportData: {
    reportConfig?: IReport;
    data?: any[] | Record<string, any>;
    generatedAt?: Date | string | { $date: string };
    [key: string]: any;
  };
}

// Chart colors
const COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
  "#6366f1", // indigo
  "#ec4899", // pink
  "#84cc16", // lime
];

// Helper function to normalize MongoDB ObjectId and ISODate format
const normalizeMongoDBData = (data: any): any => {
  if (!data) return data;

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => normalizeMongoDBData(item));
  }

  // Handle objects
  if (typeof data === "object" && data !== null) {
    // Clone the object to avoid mutating the original
    const result = { ...data };

    // Handle ObjectId
    if (data._id) {
      if (typeof data._id === "object" && data._id.$oid) {
        result.id = data._id.$oid;
      } else {
        result.id = data._id.toString();
      }
    }

    // Handle ISODate fields
    ["createdAt", "updatedAt", "lastGeneratedAt", "generatedAt"].forEach(
      (dateField) => {
        if (data[dateField]) {
          if (typeof data[dateField] === "object" && data[dateField].$date) {
            result[dateField] = new Date(data[dateField].$date);
          } else if (typeof data[dateField] === "string") {
            // Try to parse the date string
            try {
              result[dateField] = new Date(data[dateField]);
            } catch (e) {
              console.error(`Failed to parse date: ${data[dateField]}`);
            }
          }
        }
      }
    );

    // Process nested fields specifically for personalInfo
    if (data.personalInfo) {
      result.personalInfo = normalizeMongoDBData(data.personalInfo);
    }

    // Process nested fields for other objects
    Object.keys(result).forEach((key) => {
      if (typeof result[key] === "object" && result[key] !== null) {
        result[key] = normalizeMongoDBData(result[key]);
      }
    });

    return result;
  }

  // Return primitives as is
  return data;
};

// Helper function to get patient name from the updated patient model
const getPatientName = (patient: any): string => {
  if (!patient) return "Unknown Patient";

  // Get name directly from personalInfo fields
  if (patient.personalInfo) {
    const firstName = patient.personalInfo.firstName || "";
    const lastName = patient.personalInfo.lastName || "";
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
  }

  // Fallbacks
  if (patient.name) {
    return patient.name;
  }

  return `Patient ${patient.id?.substring(0, 6) || "Unknown"}`;
};

export default function ReportViewer({ reportData }: ReportViewerProps) {
  const { t, isRTL } = useLanguage();
  const [normalized, setNormalized] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("chart-0");
  const [showDebug, setShowDebug] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Normalize the report data on component mount
  useEffect(() => {
    try {
      if (reportData) {
        const normalizedData = normalizeMongoDBData(reportData);
        console.log("Normalized report data:", normalizedData);
        setNormalized(normalizedData);
        setError(null);
      }
    } catch (err) {
      console.error("Error normalizing report data:", err);
      setError("Failed to process report data");
    }
  }, [reportData]);

  // Extract report data from normalized structure
  const reportConfig = normalized?.reportConfig || normalized;
  const data = normalized?.data;
  const generatedAt = normalized?.generatedAt;

  // For debugging
  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  // Guard against undefined or empty data
  if (!normalized) {
    return (
      <div className="text-center py-8">
        {error ? (
          <div className="text-red-500 flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>{error}</p>
            <p className="text-sm mt-1">Check the console for more details</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading report data...</p>
        )}
      </div>
    );
  }

  // Get the actual data to display - handle different data structures
  const actualData = Array.isArray(data)
    ? data
    : data
    ? [data]
    : Array.isArray(normalized)
    ? normalized
    : [normalized];

  const hasData = actualData && actualData.length > 0;

  if (!hasData && !error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available for this report</p>
        <button
          onClick={toggleDebug}
          className="mt-4 text-xs text-blue-500 underline cursor-pointer"
        >
          Show debug info
        </button>
        {showDebug && (
          <pre className="mt-4 text-left text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-60">
            {JSON.stringify(normalized, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  // Get all available charts from the report
  const allCharts = reportConfig?.charts || [];

  // Helper function to get report type labels
  const getReportTypeLabel = () => {
    const type = reportConfig?.type?.toLowerCase() || "custom";
    switch (type) {
      case "patient":
        return "Patient Reports";
      case "visit":
        return "Visit Reports";
      case "status":
        return "Status Reports";
      case "custom":
        return "Custom Reports";
      case "event":
        return "Event Reports";
      default:
        return "Reports";
    }
  };

  const renderChartContent = (chartData: any, index: number) => {
    if (!chartData) {
      console.warn(`No chart data available for index ${index}`);
      return (
        <div className="text-center py-8 text-yellow-500">
          <Info className="h-8 w-8 mx-auto mb-2" />
          <p>Chart data unavailable</p>
          {showDebug && (
            <pre className="mt-4 text-left text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-40">
              Chart index: {index}
              <br />
              Chart config: {JSON.stringify(allCharts[index] || {}, null, 2)}
            </pre>
          )}
        </div>
      );
    }

    // Determine the chart type - either from the data or from the chart configuration
    const chartType = chartData.type || allCharts[index]?.type || "summary";
    console.log(`Rendering chart type: ${chartType} for index ${index}`);

    switch (chartType) {
      case "summary":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4"
          >
            {chartData.statusDistribution &&
              Array.isArray(chartData.statusDistribution) && (
                <Card className="shadow-sm border border-gray-100 dark:border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-blue-700 dark:text-blue-400">
                      Status Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.statusDistribution.map(
                      (item: any, i: number) => (
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.2, delay: i * 0.1 }}
                          key={`status-${item.name || "unknown"}-${i}`}
                          className="flex justify-between items-center mb-2"
                        >
                          <span className="text-gray-700 dark:text-gray-300">
                            {item.name || "Unknown"}
                          </span>
                          <span className="font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-sm">
                            {item.count || 0} ({item.percentage || 0}%)
                          </span>
                        </motion.div>
                      )
                    )}
                  </CardContent>
                </Card>
              )}
            {chartData.total !== undefined && (
              <Card className="shadow-sm border border-gray-100 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-blue-700 dark:text-blue-400">
                    Patients Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="flex justify-between items-center mb-2"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      Total Patients
                    </span>
                    <span className="font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-sm">
                      {chartData.total}
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="flex justify-between items-center mb-2"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                    <span className="font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-sm">
                      {chartData.active || 0} (
                      {Math.round(
                        ((chartData.active || 0) / (chartData.total || 1)) * 100
                      )}
                      %)
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      Inactive
                    </span>
                    <span className="font-medium bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded text-sm">
                      {chartData.inactive || 0} (
                      {Math.round(
                        ((chartData.inactive || 0) / (chartData.total || 1)) *
                          100
                      )}
                      %)
                    </span>
                  </motion.div>
                </CardContent>
              </Card>
            )}
            {chartData.totalVisits !== undefined && (
              <Card className="shadow-sm border border-gray-100 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-blue-700 dark:text-blue-400">
                    Visits Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="flex justify-between items-center mb-2"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      Total Visits
                    </span>
                    <span className="font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-sm">
                      {chartData.totalVisits}
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      Avg Per Patient
                    </span>
                    <span className="font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded text-sm">
                      {(chartData.avgVisitsPerPatient || 0).toFixed(1)}
                    </span>
                  </motion.div>
                </CardContent>
              </Card>
            )}
            {/* Display additional fields if available */}
            {!chartData.statusDistribution &&
              chartData.total === undefined &&
              chartData.totalVisits === undefined && (
                <div className="col-span-3">
                  <Card className="shadow-sm border border-gray-100 dark:border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-blue-700 dark:text-blue-400">
                        Report Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableBody>
                          {Object.entries(chartData)
                            .filter(
                              ([key]) => key !== "type" && key !== "title"
                            )
                            .map(([key, value]) => (
                              <TableRow key={key}>
                                <TableCell className="font-medium">
                                  {key}
                                </TableCell>
                                <TableCell>{formatCellValue(value)}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
          </motion.div>
        );

      case "pie":
        // Check if we have valid data for pie chart
        if (
          !chartData.data ||
          !Array.isArray(chartData.data) ||
          chartData.data.length === 0
        ) {
          return (
            <div className="text-center py-8">
              <p className="text-gray-500">No data available for pie chart</p>
              {showDebug && (
                <pre className="mt-4 text-left text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-40">
                  {JSON.stringify(chartData, null, 2)}
                </pre>
              )}
            </div>
          );
        }

        // Make sure each data point has a name and value property
        const pieData = chartData.data.map((item: any, index: number) => ({
          name: item.name || item.label || `Item ${index + 1}`,
          value: item.value || item.count || 0,
        }));

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-80 p-4"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name || "Unknown"}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry: any, idx: number) => (
                    <Cell
                      key={`cell-${idx}-${entry?.name || idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        );

      case "bar":
        // Check if we have valid data for bar chart
        if (
          !chartData.data ||
          !Array.isArray(chartData.data) ||
          chartData.data.length === 0
        ) {
          return (
            <div className="text-center py-8">
              <p className="text-gray-500">No data available for bar chart</p>
              {showDebug && (
                <pre className="mt-4 text-left text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-40">
                  {JSON.stringify(chartData, null, 2)}
                </pre>
              )}
            </div>
          );
        }

        // Determine the x-axis key based on data format
        const xAxisKey = chartData.data[0].period
          ? "period"
          : chartData.data[0].label
          ? "label"
          : chartData.data[0].name
          ? "name"
          : "label";

        // Determine the y-axis key based on data format
        const yAxisKey =
          chartData.data[0].count !== undefined
            ? "count"
            : chartData.data[0].value !== undefined
            ? "value"
            : "value";

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-80 p-4"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey={xAxisKey} tick={{ fill: "#718096" }} />
                <YAxis tick={{ fill: "#718096" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Bar
                  dataKey={yAxisKey}
                  fill={COLORS[0]}
                  radius={[4, 4, 0, 0]}
                />
                {Object.keys(chartData.data[0])
                  .filter(
                    (key) =>
                      ![
                        xAxisKey,
                        yAxisKey,
                        "period",
                        "label",
                        "count",
                        "value",
                        "name",
                      ].includes(key)
                  )
                  .map((key, i) => (
                    <Bar
                      key={`bar-${key}-${i}`}
                      dataKey={key}
                      fill={COLORS[(i + 1) % COLORS.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        );

      case "line":
        // Check if we have valid data for line chart
        if (
          !chartData.data ||
          !Array.isArray(chartData.data) ||
          chartData.data.length === 0
        ) {
          return (
            <div className="text-center py-8">
              <p className="text-gray-500">No data available for line chart</p>
            </div>
          );
        }

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-80 p-4"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey={chartData.data[0].period ? "period" : "label"}
                  tick={{ fill: "#718096" }}
                />
                <YAxis tick={{ fill: "#718096" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={
                    chartData.data[0].count !== undefined ? "count" : "value"
                  }
                  stroke={COLORS[0]}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                {Object.keys(chartData.data[0])
                  .filter(
                    (key) =>
                      !["period", "label", "count", "value"].includes(key)
                  )
                  .map((key, i) => (
                    <Line
                      key={`line-${key}-${i}`}
                      type="monotone"
                      dataKey={key}
                      stroke={COLORS[(i + 1) % COLORS.length]}
                      strokeWidth={2}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        );

      case "area":
        // Check if we have valid data for area chart
        if (
          !chartData.data ||
          !Array.isArray(chartData.data) ||
          chartData.data.length === 0
        ) {
          return (
            <div className="text-center py-8">
              <p className="text-gray-500">No data available for area chart</p>
            </div>
          );
        }

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-80 p-4"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey={chartData.data[0].period ? "period" : "label"}
                  tick={{ fill: "#718096" }}
                />
                <YAxis tick={{ fill: "#718096" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey={
                    chartData.data[0].count !== undefined ? "count" : "value"
                  }
                  fill={COLORS[0] + "40"}
                  stroke={COLORS[0]}
                  strokeWidth={2}
                />
                {Object.keys(chartData.data[0])
                  .filter(
                    (key) =>
                      !["period", "label", "count", "value"].includes(key)
                  )
                  .map((key, i) => (
                    <Area
                      key={`area-${key}-${i}`}
                      type="monotone"
                      dataKey={key}
                      fill={COLORS[(i + 1) % COLORS.length] + "40"}
                      stroke={COLORS[(i + 1) % COLORS.length]}
                      strokeWidth={2}
                    />
                  ))}
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        );

      case "table":
        // Check if we have valid data for table - support both data.rows and data array formats
        const tableRows = chartData.rows || chartData.data;
        const tableHeaders = chartData.headers || chartData.columns;

        if (!tableRows || !Array.isArray(tableRows) || !tableHeaders) {
          return (
            <div className="text-center py-8">
              <p className="text-gray-500">No data available for table</p>
              {showDebug && (
                <pre className="mt-4 text-left text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-60">
                  {JSON.stringify(chartData, null, 2)}
                </pre>
              )}
            </div>
          );
        }

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-x-auto p-4"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHeaders.map((column: any, colIdx: number) => (
                    <TableHead
                      key={`col-${column.key || column.label}-${colIdx}`}
                      className="text-blue-700 dark:text-blue-400"
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableRows.map((row: any, rowIndex: number) => (
                  <TableRow
                    key={`row-${rowIndex}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    {tableHeaders.map((column: any, cellIdx: number) => {
                      // Handle nested fields like "personalInfo.firstName"
                      const key = column.key || "";
                      let cellValue = row[key];

                      // Handle nested fields with dot notation
                      if (key.includes(".") && !cellValue) {
                        try {
                          const parts = key.split(".");
                          let nestedValue = row;

                          for (const part of parts) {
                            if (
                              nestedValue &&
                              typeof nestedValue === "object"
                            ) {
                              nestedValue = nestedValue[part];
                            } else {
                              nestedValue = undefined;
                              break;
                            }
                          }

                          cellValue = nestedValue;
                        } catch (error) {
                          console.error(
                            `Error accessing nested value for ${key}:`,
                            error
                          );
                        }
                      }

                      return (
                        <TableCell key={`cell-${key}-${cellIdx}`}>
                          {formatCellValue(cellValue)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        );

      default:
        // If we don't recognize the chart type, display the raw data as a table
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-3">Raw Data</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(chartData)
                    .filter(
                      ([key]) =>
                        typeof chartData[key] !== "object" ||
                        chartData[key] === null
                    )
                    .map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{key}</TableCell>
                        <TableCell>{formatCellValue(value)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {showDebug && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">
                    Debug: Full Chart Data
                  </h4>
                  <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-60">
                    {JSON.stringify(chartData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  const formatCellValue = (value: any) => {
    if (value === undefined || value === null) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") return value.toLocaleString();
    if (value instanceof Date) return value.toLocaleDateString();
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const getChartTitle = (chart: any, index: number) => {
    // Try to get title from the chart config
    if (chart.title) return chart.title;

    // Try to get title from the allCharts array
    if (allCharts[index]?.title) return allCharts[index].title;

    // Default title based on chart type
    const type = chart.type || allCharts[index]?.type || "unknown";
    if (type === "summary") return "Summary";
    if (type === "table") return "Data Table";
    return `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">
              {reportConfig?.name || "Report"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {reportConfig?.description || getReportTypeLabel()}
            </p>
          </div>
          <button
            onClick={toggleDebug}
            className="text-xs text-blue-500 underline"
          >
            {showDebug ? "Hide debug info" : "Show debug info"}
          </button>
        </div>

        {showDebug && (
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-xs overflow-auto max-h-60">
            <h3 className="font-medium mb-2">Debug Information</h3>
            <pre>{JSON.stringify(normalized, null, 2)}</pre>
          </div>
        )}

        <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="bg-gray-50 dark:bg-gray-800 py-3 px-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <FileBarChart className="mx-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Report Results
                </CardTitle>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="font-normal">
                    {getReportTypeLabel()}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="font-normal text-gray-500 dark:text-gray-400"
                  >
                    {generatedAt instanceof Date
                      ? generatedAt.toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </Badge>
                  {reportConfig?.includeFields?.length > 0 && (
                    <Badge variant="outline" className="font-normal">
                      {reportConfig.includeFields.length} fields
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {allCharts && allCharts.length > 0 ? (
              <Tabs
                defaultValue="chart-0"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mx-4 my-3 bg-gray-100 dark:bg-gray-800">
                  {allCharts.map((chart: IReportChart, index: number) => (
                    <TabsTrigger
                      key={`tab-${index}`}
                      value={`chart-${index}`}
                      className="text-sm"
                    >
                      {chart.title || `Chart ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {allCharts.map((chart: IReportChart, index: number) => {
                  // Try to find the chart data
                  let chartData = null;

                  // Method 1: Look for data with matching chartId
                  if (Array.isArray(actualData) && actualData.length > 0) {
                    chartData = actualData.find(
                      (d) => d.chartId === chart.dataField
                    );
                  }

                  // Method 2: If not found, try the first chart data or the data at the current index
                  if (!chartData) {
                    chartData = Array.isArray(actualData)
                      ? actualData[index] || actualData[0]
                      : actualData;
                  }

                  // Method 3: If still not found, but we have a data property that's an array, try that
                  if (
                    !chartData &&
                    normalized.data &&
                    Array.isArray(normalized.data)
                  ) {
                    chartData = normalized.data[index] || normalized.data[0];
                  }

                  // Method 4: Check if we have a charts array within the data
                  if (
                    !chartData &&
                    normalized.charts &&
                    Array.isArray(normalized.charts)
                  ) {
                    chartData = normalized.charts[index];
                  }

                  console.log(`Chart ${index}: ${chart.title}`, chartData);

                  return (
                    <TabsContent
                      key={`content-${index}`}
                      value={`chart-${index}`}
                      className="border-0 p-0"
                    >
                      {chartData ? (
                        renderChartContent(chartData, index)
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            No data available for this chart
                          </p>
                          {showDebug && (
                            <div className="mt-4 text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded-md mx-4">
                              <p className="font-medium mb-2">
                                Chart Configuration:
                              </p>
                              <pre>{JSON.stringify(chart, null, 2)}</pre>
                              <p className="font-medium mt-4 mb-2">
                                Available Data:
                              </p>
                              <pre>
                                {JSON.stringify(
                                  actualData?.slice(0, 1),
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            ) : hasData ? (
              <div className="p-4">
                {typeof actualData[0] === "object" ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(actualData[0]).map((key) => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {actualData.map((row, i) => (
                        <TableRow key={i}>
                          {Object.keys(actualData[0]).map((key) => (
                            <TableCell key={`${i}-${key}`}>
                              {typeof row[key] === "object"
                                ? JSON.stringify(row[key])
                                : formatCellValue(row[key])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {JSON.stringify(actualData, null, 2)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

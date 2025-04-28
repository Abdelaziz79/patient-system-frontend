"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IReport, IReportChart } from "@/app/_api/reportApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReportViewerProps {
  reportData: {
    reportConfig: IReport;
    data: any[];
    generatedAt: Date;
  };
}

// Chart colors
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#F44336",
  "#3F51B5",
  "#9C27B0",
  "#CDDC39",
];

export default function ReportViewer({ reportData }: ReportViewerProps) {
  const { reportConfig, data, generatedAt } = reportData;
  const [activeTab, setActiveTab] = React.useState("chart-0");

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available for this report</p>
      </div>
    );
  }

  const renderChartContent = (chartData: any, index: number) => {
    switch (chartData.type) {
      case "summary":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {chartData.statusDistribution && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.statusDistribution.map((item: any) => (
                    <div
                      key={item.name}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>{item.name}</span>
                      <span className="font-medium">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {chartData.total !== undefined && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Patients Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span>Total Patients</span>
                    <span className="font-medium">{chartData.total}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Active</span>
                    <span className="font-medium">
                      {chartData.active} (
                      {Math.round((chartData.active / chartData.total) * 100)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Inactive</span>
                    <span className="font-medium">
                      {chartData.inactive} (
                      {Math.round((chartData.inactive / chartData.total) * 100)}
                      %)
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
            {chartData.totalVisits !== undefined && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Visits Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span>Total Visits</span>
                    <span className="font-medium">{chartData.totalVisits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. Per Patient</span>
                    <span className="font-medium">
                      {chartData.avgVisitsPerPatient.toFixed(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "pie":
        return (
          <div className="h-80 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.data}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.data.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case "bar":
        return (
          <div className="h-80 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={chartData.data[0].period ? "period" : "label"}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey={
                    chartData.data[0].count !== undefined ? "count" : "value"
                  }
                  fill="#8884d8"
                />
                {Object.keys(chartData.data[0])
                  .filter(
                    (key) =>
                      !["period", "label", "count", "value"].includes(key)
                  )
                  .map((key, i) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "line":
        return (
          <div className="h-80 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                {chartData.data[0].count !== undefined && (
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                )}
                {Object.keys(chartData.data[0])
                  .filter((key) => !["period", "count"].includes(key))
                  .map((key, i) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={COLORS[i % COLORS.length]}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case "table":
        return (
          <div className="p-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {chartData.headers.map((header: any) => (
                    <TableHead key={header.key}>{header.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.rows.map((row: any, rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {chartData.headers.map((header: any) => (
                      <TableCell key={header.key}>
                        {formatCellValue(row[header.key])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  const formatCellValue = (value: any) => {
    if (value === undefined || value === null) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === "object") return JSON.stringify(value);
    return value.toString();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{reportConfig.name}</h2>
        {reportConfig.description && (
          <p className="text-gray-500 text-sm mt-1">
            {reportConfig.description}
          </p>
        )}
        <p className="text-gray-400 text-xs mt-1">
          Generated on: {new Date(generatedAt).toLocaleString()}
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-grow"
      >
        <TabsList className="mb-4">
          {data.map((chart, index) => (
            <TabsTrigger key={index} value={`chart-${index}`}>
              {chart.title || `Chart ${index + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>

        {data.map((chart, index) => (
          <TabsContent
            key={index}
            value={`chart-${index}`}
            className="flex-grow"
          >
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>{chart.title}</CardTitle>
              </CardHeader>
              {renderChartContent(chart, index)}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

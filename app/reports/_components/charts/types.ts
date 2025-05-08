import { ReactNode } from "react";

export interface ChartDataPoint {
  period?: string;
  count?: number;
  label?: string;
  value?: number;
  x?: string;
  y?: number;
  size?: number;
}

export interface TableHeader {
  key: string;
  label: string;
}

export interface TableRow {
  [key: string]: string | number | null;
}

export interface SummaryValue {
  count: number;
  values: Array<string | number | Date>;
}

export interface SummaryData {
  [key: string]: SummaryValue;
}

export interface PieChartProps {
  title: string;
  data: { label: string; value: number }[];
}

export interface BarLineChartProps {
  title: string;
  data: ChartDataPoint[];
}

export interface TableComponentProps {
  title: string;
  headers: TableHeader[];
  rows: TableRow[];
}

export interface SummaryComponentProps {
  title: string;
  field: string;
  count: number;
  summary: SummaryData;
}

export interface HeatmapScatterProps {
  title: string;
  data: ChartDataPoint[];
}

export interface ReportData {
  type: string;
  title: string;
  field: string;
  data?: any[];
  headers?: TableHeader[];
  rows?: TableRow[];
  count?: number;
  summary?: SummaryData;
  totalVisits?: number;
  totalPatients?: number;
  avgVisitsPerPatient?: string | number;
  visitsByDayOfWeek?: Array<{ day: string; count: number; percentage: number }>;
  mostRecentVisit?: Record<string, any>;
  oldestVisit?: Record<string, any>;
  // Patient summary fields
  total?: number;
  active?: number;
  inactive?: number;
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
  // Status summary fields
  avgDaysInCurrentStatus?: number;
  statusTransitions?: Array<{ from: string; to: string; count: number }>;
  // Comparative summary fields
  segments?: string[];
  segmentCounts?: Array<{ segment: string; count: number; percentage: number }>;
}

export interface ReportChartsProps {
  reportData: ReportData[];
}

// Chart colors
export const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
];
export const getColor = (index: number): string =>
  COLORS[index % COLORS.length];

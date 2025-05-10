"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  FileText,
  LayoutGrid,
  LineChart,
  PieChart,
  Table2,
  Target,
} from "lucide-react";
import { useState } from "react";
import {
  BarChartComponent,
  ComparativeSummaryComponent,
  HeatmapComponent,
  LineChartComponent,
  PatientSummaryComponent,
  PieChartComponent,
  ReportChartsProps,
  ReportData,
  ScatterChartComponent,
  StatusSummaryComponent,
  TableComponent,
  VisitSummaryComponent,
} from "./charts";

// Map chart types to their icons
const chartTypeIcons: Record<string, any> = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  table: Table2,
  summary: FileText,
  heatmap: LayoutGrid,
  scatter: Target,
  all: Activity,
};

export default function ReportCharts({ reportData }: ReportChartsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { t, dir } = useLanguage();

  const chartTypes = Array.from(new Set(reportData.map((chart) => chart.type)));
  const filteredCharts =
    activeTab === "all"
      ? reportData
      : reportData.filter((chart) => chart.type === activeTab);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6" dir={dir}>
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="bg-white/70 dark:bg-slate-800/70 p-4 rounded-xl shadow-sm border border-blue-100/50 dark:border-blue-900/30 backdrop-blur-sm">
          <TabsList className="grid grid-cols-2 md:flex md:flex-wrap gap-1 p-1 bg-blue-50/80 dark:bg-slate-800/90 rounded-lg">
            <TabsTrigger
              value="all"
              className="flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg shadow-sm"
            >
              {(() => {
                const Icon = chartTypeIcons["all"];
                return <Icon className="h-3.5 w-3.5" />;
              })()}
              <span>{t("allCharts")}</span>
            </TabsTrigger>

            {chartTypes.map((type) => {
              const Icon = chartTypeIcons[type] || chartTypeIcons.all;
              return (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="capitalize">
                    {t(
                      type as
                        | "bar"
                        | "line"
                        | "pie"
                        | "table"
                        | "summary"
                        | "heatmap"
                        | "scatter"
                    )}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredCharts.length === 0 ? (
                <motion.div
                  variants={item}
                  className="col-span-full bg-white/80 dark:bg-slate-800/80 p-8 rounded-xl text-center shadow-sm border border-blue-100/50 dark:border-blue-900/30"
                >
                  <div className="flex flex-col items-center justify-center space-y-3 text-blue-600/70 dark:text-blue-400/70">
                    <FileText className="h-10 w-10" />
                    <p className="text-lg font-medium">
                      {t("noChartsOfTypeAvailable")}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <>
                  {filteredCharts.map((chart, index) => {
                    // Determine column span based on chart type
                    const colSpan =
                      chart.type === "summary" ||
                      chart.type === "heatmap" ||
                      chart.type === "table"
                        ? "md:col-span-2"
                        : "";

                    return (
                      <motion.div
                        key={`${chart.type}-${index}`}
                        variants={item}
                        className={colSpan}
                      >
                        {renderChartComponent(chart, index, t)}
                      </motion.div>
                    );
                  })}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Moved the chart rendering logic to a separate function for cleaner code
function renderChartComponent(chart: ReportData, index: number, t: any) {
  switch (chart.type) {
    case "bar":
      return <BarChartComponent data={chart.data || []} title={chart.title} />;
    case "line":
      return <LineChartComponent data={chart.data || []} title={chart.title} />;
    case "pie":
      return <PieChartComponent data={chart.data || []} title={chart.title} />;
    case "table":
      return (
        <TableComponent
          headers={chart.headers || []}
          rows={chart.rows || []}
          title={chart.title}
        />
      );
    case "summary":
      // Status summary
      if (chart.statusTransitions !== undefined) {
        return (
          <StatusSummaryComponent
            title={chart.title}
            statusDistribution={chart.statusDistribution}
            avgDaysInCurrentStatus={chart.avgDaysInCurrentStatus}
            statusTransitions={chart.statusTransitions}
          />
        );
      }
      // Patient summary
      if (chart.total !== undefined) {
        return (
          <PatientSummaryComponent
            title={chart.title}
            total={chart.total}
            active={chart.active || 0}
            inactive={chart.inactive || 0}
            avgAge={chart.avgAge}
            genderDistribution={chart.genderDistribution}
            statusDistribution={chart.statusDistribution}
          />
        );
      }
      // Visit summary
      if (chart.totalVisits !== undefined) {
        return (
          <VisitSummaryComponent
            title={chart.title}
            totalVisits={chart.totalVisits}
            totalPatients={chart.totalPatients || 0}
            avgVisitsPerPatient={chart.avgVisitsPerPatient || 0}
            visitsByDayOfWeek={chart.visitsByDayOfWeek}
            mostRecentVisit={chart.mostRecentVisit}
            oldestVisit={chart.oldestVisit}
          />
        );
      }
      // Comparative summary
      if (chart.segments !== undefined) {
        return (
          <ComparativeSummaryComponent
            title={chart.title}
            field={chart.field}
            segments={chart.segments}
            totalPatients={chart.totalPatients}
            segmentCounts={chart.segmentCounts}
          />
        );
      }
      // Regular summary
      return (
        <div className="card p-6 border rounded-md bg-white/90 dark:bg-slate-800/90 shadow-sm">
          <h3 className="text-lg font-medium mb-2">{chart.title}</h3>
          <p className="text-sm text-muted-foreground">
            {t("summaryTypeNotVisualized")}
          </p>
        </div>
      );
    case "heatmap":
      return <HeatmapComponent data={chart.data || []} title={chart.title} />;
    case "scatter":
      return (
        <ScatterChartComponent data={chart.data || []} title={chart.title} />
      );
    default:
      return null;
  }
}

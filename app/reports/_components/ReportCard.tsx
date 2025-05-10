"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IReport } from "@/app/_hooks/report/reportApi";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  FileText,
  LineChart,
  PieChart,
  Star,
  Table2,
} from "lucide-react";
import Link from "next/link";

interface ReportCardProps {
  report: IReport;
}

export default function ReportCard({ report }: ReportCardProps) {
  const { t, dir } = useLanguage();

  // Map report types to their visual styling and icons
  const reportTypeConfigs = {
    patient: {
      icon: <BarChart3 className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      styles: {
        border: "border-blue-100 dark:border-blue-800/50",
        badge:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        titleGradient:
          "from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600",
        hoverEffect: "hover:bg-blue-50/80 dark:hover:bg-blue-950/30",
      },
    },
    visit: {
      icon: (
        <PieChart className="h-5 w-5 text-purple-500 dark:text-purple-400" />
      ),
      styles: {
        border: "border-purple-100 dark:border-purple-800/50",
        badge:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        titleGradient:
          "from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600",
        hoverEffect: "hover:bg-purple-50/80 dark:hover:bg-purple-950/30",
      },
    },
    status: {
      icon: (
        <LineChart className="h-5 w-5 text-green-500 dark:text-green-400" />
      ),
      styles: {
        border: "border-green-100 dark:border-green-800/50",
        badge:
          "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
        iconBg: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
        titleGradient:
          "from-green-600 to-green-800 dark:from-green-400 dark:to-green-600",
        hoverEffect: "hover:bg-green-50/80 dark:hover:bg-green-950/30",
      },
    },
    custom: {
      icon: <Table2 className="h-5 w-5 text-amber-500 dark:text-amber-400" />,
      styles: {
        border: "border-amber-100 dark:border-amber-800/50",
        badge:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        titleGradient:
          "from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-600",
        hoverEffect: "hover:bg-amber-50/80 dark:hover:bg-amber-950/30",
      },
    },
    default: {
      icon: <BarChart3 className="h-5 w-5 text-gray-500 dark:text-gray-400" />,
      styles: {
        border: "border-gray-100 dark:border-gray-800/50",
        badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        iconBg: "bg-gray-100 dark:bg-gray-800/30",
        iconColor: "text-gray-600 dark:text-gray-400",
        titleGradient:
          "from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-600",
        hoverEffect: "hover:bg-gray-50/80 dark:hover:bg-gray-900/30",
      },
    },
  };

  // Get the correct configuration based on report type
  const reportType =
    report.type.toLowerCase() as keyof typeof reportTypeConfigs;
  const config = reportTypeConfigs[reportType] || reportTypeConfigs.default;

  return (
    <Link href={`/reports/${report.id}`}>
      <Card
        className={cn(
          "h-full transition-all duration-200 hover:shadow-lg cursor-pointer bg-white dark:bg-slate-800/90 backdrop-blur-sm",
          config.styles.border,
          config.styles.hoverEffect
        )}
        dir={dir}
      >
        <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700/50">
          <CardTitle className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-full shadow-sm ${config.styles.iconBg}`}
              >
                {config.icon}
              </div>
              <span
                className={`text-lg font-bold bg-gradient-to-r ${config.styles.titleGradient} bg-clip-text text-transparent line-clamp-1`}
              >
                {report.name}
              </span>
            </div>
            <div className="flex gap-1">
              {report.isTemplate && (
                <Badge
                  variant="outline"
                  className="border-purple-100 dark:border-purple-800/50 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/20"
                >
                  {t("standardReport")}
                </Badge>
              )}
              {report.isFavorite && (
                <Star size={16} className="text-yellow-500 fill-yellow-400" />
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4 pb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
            {report.description || t("noDescription")}
          </p>

          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="secondary" className={config.styles.badge}>
              {report.type}
            </Badge>
            {report.category && (
              <Badge
                variant="outline"
                className="border-gray-200 dark:border-gray-700/70"
              >
                {report.category}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t border-gray-100 dark:border-gray-700/50 text-xs">
          {report.lastGeneratedAt ? (
            <div className="flex items-start gap-x-3">
              <div
                className={`p-1.5 rounded-full shadow-sm ${config.styles.iconBg}`}
              >
                <Calendar size={12} className={config.styles.iconColor} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("generated")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(report.lastGeneratedAt).toLocaleDateString("en-US")}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-x-3">
              <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full shadow-sm">
                <FileText
                  size={12}
                  className="text-orange-600 dark:text-orange-400"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("status")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("reportNotGeneratedYet")}
                </p>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

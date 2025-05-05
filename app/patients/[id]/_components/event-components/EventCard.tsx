import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import {
  AlertCircle,
  Award,
  Calendar,
  CalendarDays,
  Clock,
  FileCheck,
  FileX,
  Flag,
  MoreHorizontal,
  RotateCcw,
  Trash,
} from "lucide-react";
import React from "react";

interface EventCardProps {
  event: any;
  onDeleteEvent: (eventId: string) => void;
  onRestoreEvent?: (eventId: string) => void;
  isDeletingEvent: boolean;
  isRestoringEvent?: boolean;
}

export function EventCard({
  event,
  onDeleteEvent,
  onRestoreEvent,
  isDeletingEvent,
  isRestoringEvent,
}: EventCardProps) {
  const { t, dir } = useLanguage();
  const isDeleted = event.isDeleted;

  // Helper functions for event display
  const getEventColor = (type: string, importance: string) => {
    const typeColorMap: Record<string, { light: string; dark: string }> = {
      general: { light: "#6366f1", dark: "#818cf8" }, // indigo
      medication: { light: "#10b981", dark: "#34d399" }, // emerald
      therapy: { light: "#8b5cf6", dark: "#a78bfa" }, // violet
      surgery: { light: "#ef4444", dark: "#f87171" }, // red
      lab: { light: "#f59e0b", dark: "#fbbf24" }, // amber
      consultation: { light: "#3b82f6", dark: "#60a5fa" }, // blue
      referral: { light: "#ec4899", dark: "#f472b6" }, // pink
      admission: { light: "#f43f5e", dark: "#fb7185" }, // rose
      discharge: { light: "#14b8a6", dark: "#2dd4bf" }, // teal
    };

    const importanceAlphaMap: Record<string, string> = {
      low: "80",
      medium: "bf",
      high: "ff",
    };

    const baseColor = typeColorMap[type] || {
      light: "#6b7280",
      dark: "#9ca3af",
    }; // gray as default
    const alpha = importanceAlphaMap[importance] || "bf"; // medium as default

    return {
      lightColor: baseColor.light,
      darkColor: baseColor.dark,
      alpha,
    };
  };

  const getEventIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      general: <Calendar className="h-4 w-4" />,
      medication: <FileCheck className="h-4 w-4" />,
      therapy: <Award className="h-4 w-4" />,
      surgery: <AlertCircle className="h-4 w-4" />,
      lab: <FileX className="h-4 w-4" />,
      consultation: <CalendarDays className="h-4 w-4" />,
      referral: <Flag className="h-4 w-4" />,
      admission: <FileCheck className="h-4 w-4" />,
      discharge: <FileX className="h-4 w-4" />,
    };

    return iconMap[type] || <Calendar className="h-4 w-4" />;
  };

  const formatEventDate = (date: Date | string) => {
    try {
      return format(new Date(date), "PPP");
    } catch (error) {
      return t("invalidDate");
    }
  };

  const { lightColor, darkColor, alpha } = getEventColor(
    event.eventType || "general",
    event.importance || "medium"
  );

  return (
    <div
      className="md:grid md:grid-cols-[40px_1fr] gap-4 transition-all duration-300 group"
      dir={dir}
    >
      {/* Timeline node with improved hover effect */}
      <div className="hidden md:flex items-start justify-center z-10 pt-1">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
            isDeleted ? "opacity-40 grayscale" : ""
          }`}
          style={{
            background: `linear-gradient(135deg, ${lightColor}, ${lightColor}${alpha})`,
            boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 3px ${lightColor}20`,
          }}
        >
          <div className="text-white dark:text-gray-100">
            {getEventIcon(event.eventType || "general")}
          </div>
        </div>
      </div>

      {/* Event card with enhanced styling */}
      <Card
        className={`border dark:bg-gray-800/70 bg-white backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
          isDeleted ? "opacity-60 grayscale" : ""
        }`}
        style={
          {
            borderLeftColor: `var(--event-color)`,
            borderLeftWidth: "4px",
            boxShadow: isDeleted ? "none" : "var(--event-shadow)",
            "--event-color": `${lightColor}`,
            "--event-shadow": `0 1px 3px ${lightColor}30`,
          } as React.CSSProperties
        }
      >
        <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100">
              {event.title}
              {isDeleted && (
                <Badge
                  variant="outline"
                  className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 mx-2 animate-pulse"
                >
                  Deleted
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-300 flex-wrap">
              <span className="inline-flex items-center">
                <Clock className="h-3.5 w-3.5 mx-1 text-gray-500 dark:text-gray-400" />
                {formatEventDate(event.date)}
              </span>
              <Badge
                variant="outline"
                className="capitalize mx-1 text-xs px-2 py-0 h-5"
                style={
                  {
                    backgroundColor: `${lightColor}15`,
                    borderColor: `${lightColor}40`,
                    color: `var(--badge-text)`,
                    "--badge-text": `${lightColor}`,
                  } as React.CSSProperties
                }
              >
                {t((event.eventType as keyof typeof t) || "general")}
              </Badge>
              <Badge
                variant="outline"
                className="capitalize text-xs px-2 py-0 h-5"
                style={
                  {
                    backgroundColor: `${lightColor}15`,
                    borderColor: `${lightColor}40`,
                    color: `var(--badge-text)`,
                    "--badge-text": `${lightColor}`,
                  } as React.CSSProperties
                }
              >
                {t((event.importance as keyof typeof t) || "medium")}{" "}
                {t("priority")}
              </Badge>
            </CardDescription>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-40 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    {isDeleted ? (
                      <DropdownMenuItem
                        onClick={() =>
                          onRestoreEvent && onRestoreEvent(event._id)
                        }
                        disabled={isRestoringEvent}
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700"
                      >
                        <RotateCcw className="h-4 w-4 mx-2" />
                        {t("restore")}
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => onDeleteEvent(event._id)}
                        disabled={isDeletingEvent}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700"
                      >
                        <Trash className="h-4 w-4 mx-2" />
                        {t("delete")}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isDeleted ? t("restore") : t("delete")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>

        {event.sectionData && (
          <CardContent className="pt-0 px-4 pb-4">
            <div className="grid grid-cols-1 gap-2 mt-2 bg-gray-50 dark:bg-gray-800/80 p-3 rounded-md">
              {/* Handle both Map and Object types for sectionData */}
              {(() => {
                // If it's a Map (has 'entries' method)
                if (
                  event.sectionData.entries &&
                  typeof event.sectionData.entries === "function"
                ) {
                  return Array.from(
                    event.sectionData.entries() as IterableIterator<
                      [string, any]
                    >
                  ).map(([key, value]) => (
                    <div key={key} className="flex flex-wrap">
                      <span className="font-medium min-w-24 text-gray-700 dark:text-gray-300 capitalize px-2">
                        {t(key.replace("_", " ") as keyof typeof t)}:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 font-normal">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </span>
                    </div>
                  ));
                }
                // If it's a plain object
                else if (typeof event.sectionData === "object") {
                  return Object.entries(event.sectionData).map(
                    ([key, value]) => (
                      <div key={key} className="flex flex-wrap">
                        <span className="font-medium min-w-24 text-gray-700 dark:text-gray-300 capitalize px-2">
                          {t(key.replace("_", " ") as keyof typeof t)}:
                        </span>
                        <span className="text-gray-800 dark:text-gray-200 font-normal">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </span>
                      </div>
                    )
                  );
                }
                return null;
              })()}
            </div>
          </CardContent>
        )}

        {/* Subtle border gradient at the bottom */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${lightColor}40, ${lightColor}10, transparent)`,
            opacity: isDeleted ? 0.3 : 0.7,
          }}
        />
      </Card>
    </div>
  );
}

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isValid } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Info,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface SectionData {
  visitType?: string;
  followUpDate?: string;
  [key: string]: any;
}

interface Visit {
  _id: string;
  title?: string;
  date: string;
  notes?: string;
  isDeleted?: boolean;
  sectionData?: SectionData;
}

interface Patient {
  visits?: Visit[];
  [key: string]: any;
}

interface VisitsTabProps {
  patient: Patient;
  formatDate: (date: Date) => string;
  handleDeleteVisit: (visitId: string) => void;
  handleRestoreVisit: (visitId: string) => void;
  isDeletingVisit: boolean;
  setIsVisitDialogOpen: (isOpen: boolean) => void;
}

// Format date helper function
const formatDateHelper = (
  date: string | undefined,
  formatDate: (date: Date) => string,
  t: any
): string => {
  if (!date) return t("notAvailable");
  try {
    const dateObj = new Date(date);
    if (!isValid(dateObj)) return t("invalidDate");
    return formatDate(dateObj);
  } catch (e) {
    console.log(e);
    return t("invalidDate");
  }
};

// Get time from date string
const getTimeFromDate = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return "";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

// Check if a value is likely a date
const isLikelyDate = (value: any, fieldName: string): boolean => {
  if (
    fieldName.toLowerCase().includes("date") ||
    fieldName.toLowerCase().includes("birth") ||
    fieldName.toLowerCase().includes("_at")
  ) {
    return true;
  }

  if (typeof value === "string") {
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}/,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/,
      /^\d{2}\/\d{2}\/\d{4}/,
    ];

    if (datePatterns.some((pattern) => pattern.test(value))) {
      try {
        const dateObj = new Date(value);
        return isValid(dateObj);
      } catch {
        return false;
      }
    }
  }
  return false;
};

// EmptyState component
interface EmptyStateProps {
  isDeleted?: boolean;
  t: any;
  onAddVisit: () => void;
}

const EmptyState = ({ isDeleted = false, t, onAddVisit }: EmptyStateProps) => (
  <div className="text-center p-8 bg-indigo-50/50 dark:bg-slate-800/50 rounded-lg">
    <CalendarDays className="h-12 w-12 mx-auto text-indigo-300 dark:text-slate-600 mb-3" />
    <p className="text-indigo-600 dark:text-slate-400 font-medium">
      {isDeleted ? t("notAvailable") : t("noVisitsRecorded")}
    </p>
    <p className="text-indigo-500 dark:text-slate-500 text-sm mt-1">
      {isDeleted ? t("notAvailable") : t("addFirstVisitTracking")}
    </p>
    {!isDeleted && (
      <Button
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90 text-white"
        onClick={onAddVisit}
      >
        <PlusCircle className="h-4 w-4 mx-2" />
        {t("addFirstVisit")}
      </Button>
    )}
  </div>
);

// VisitDetails component
interface VisitDetailsProps {
  visit: Visit;
  formatDateCleaner: (date?: string) => string;
  t: any;
}

const VisitDetails = ({ visit, formatDateCleaner, t }: VisitDetailsProps) => (
  <CardContent className="pt-4 dark:bg-slate-900/95">
    {visit.notes && (
      <div className="mb-5">
        <h4 className="text-sm font-medium mb-2 text-indigo-700 dark:text-slate-300 flex items-center">
          <FileText className="h-4 w-4 mx-2 text-indigo-600 dark:text-slate-400" />
          {t("notes")}:
        </h4>
        <div className="text-gray-800 dark:text-slate-300 text-sm bg-indigo-50/80 dark:bg-slate-800/80 p-4 rounded-md border border-indigo-100/60 dark:border-slate-700/60">
          <ReactMarkdown
            components={{
              p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
              h1: ({ ...props }) => (
                <h1 className="text-lg font-bold mb-2" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-md font-bold mb-2" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-sm font-bold mb-1" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc px-4 mb-2" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal px-4 mb-2" {...props} />
              ),
              li: ({ ...props }) => <li className="mb-1" {...props} />,
              strong: ({ ...props }) => (
                <strong
                  className="font-bold text-indigo-700 dark:text-slate-200"
                  {...props}
                />
              ),
            }}
          >
            {visit.notes}
          </ReactMarkdown>
        </div>
      </div>
    )}

    {/* Visit section data */}
    {visit.sectionData && Object.keys(visit.sectionData).length > 0 && (
      <div>
        <h4 className="text-sm font-medium mb-3 text-indigo-700 dark:text-slate-300 flex items-center">
          <Info className="h-4 w-4 mx-2 text-indigo-600 dark:text-slate-400" />
          {t("visitDetails")}:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(visit.sectionData)
            .filter(([key]) => key !== "visitType" && key !== "followUpDate")
            .map(([key, value]) => {
              const displayValue = isLikelyDate(value, key)
                ? formatDateCleaner(value)
                : typeof value === "object"
                ? JSON.stringify(value)
                : String(value);

              return (
                <div
                  key={key}
                  className="p-3 sm:p-4 rounded-lg transition-colors duration-200 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <h5 className="font-semibold text-indigo-800 dark:text-slate-200 text-sm capitalize flex items-center mb-1">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </h5>
                  <p className="text-gray-800 dark:text-slate-300 text-sm">
                    {displayValue}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    )}
  </CardContent>
);

// VisitCard component
interface VisitCardProps {
  visit: Visit;
  isExpanded: boolean;
  toggleExpand: (visitId: string) => void;
  onDelete: (visitId: string) => void;
  onRestore: (visitId: string) => void;
  isDeletingVisit: boolean;
  formatDateCleaner: (date?: string) => string;
  t: any;
  dir: string;
}

const VisitCard = ({
  visit,
  isExpanded,
  toggleExpand,
  onDelete,
  onRestore,
  isDeletingVisit,
  formatDateCleaner,
  t,
  dir,
}: VisitCardProps) => {
  const visitType = visit.sectionData?.visitType || "";

  return (
    <Card
      dir={dir}
      className="mb-3 sm:mb-4 border-l-4 shadow-md border-l-indigo-400 dark:border-l-indigo-600 border-indigo-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all duration-200"
    >
      <CardHeader
        className="py-2 sm:py-3 px-3 sm:px-4 bg-indigo-50/50 dark:bg-slate-800/50 rounded-t-lg cursor-pointer"
        onClick={() => toggleExpand(visit._id)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="p-1.5 sm:p-2 rounded-full bg-indigo-100 dark:bg-slate-700">
              {visitType.toLowerCase().includes("emergency") ? (
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-slate-400" />
              ) : visitType.toLowerCase().includes("treatment") ? (
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-slate-400" />
              ) : (
                <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-slate-400" />
              )}
            </div>

            <div>
              <CardTitle className="text-sm sm:text-base font-semibold text-indigo-800 dark:text-slate-300 flex flex-wrap items-center gap-1 sm:gap-2">
                {visit.title ||
                  `${t("visitOn")} ${formatDateCleaner(visit.date)}`}

                {visitType && (
                  <Badge
                    variant="outline"
                    className="mx-1 sm:mx-2 text-xs sm:text-sm px-1 sm:px-2 py-0 sm:py-0.5 bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-slate-300 border-indigo-200 dark:border-slate-700"
                  >
                    {visitType}
                  </Badge>
                )}
              </CardTitle>

              <div className="flex items-center mt-0.5 sm:mt-1 text-xs text-indigo-600 dark:text-slate-400">
                <Clock className="h-3 w-3 mx-1" />
                {formatDateCleaner(visit.date)}
                {getTimeFromDate(visit.date) && (
                  <span className="mx-1">at {getTimeFromDate(visit.date)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {visit.sectionData?.followUpDate && (
              <Badge
                variant="outline"
                className="hidden sm:flex bg-indigo-50 dark:bg-slate-800 text-xs text-indigo-700 dark:text-slate-300 border-indigo-200 dark:border-slate-700"
              >
                <CalendarDays className="h-3 w-3 mx-1" />
                {t("followUp")}:{" "}
                {formatDateCleaner(visit.sectionData.followUpDate)}
              </Badge>
            )}

            {visit.isDeleted ? (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(visit._id);
                }}
                size="sm"
                className="h-7 sm:h-8 text-xs sm:text-sm px-1.5 sm:px-2 border-indigo-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-800 text-indigo-700 dark:text-slate-300"
              >
                <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mx-0.5 sm:mx-1" />
                {t("restore")}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(visit._id);
                }}
                disabled={isDeletingVisit}
                className="h-7 sm:h-8 text-xs sm:text-sm px-1.5 sm:px-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mx-0.5 sm:mx-1" />
                {t("delete")}
              </Button>
            )}

            <ChevronDown
              className={`h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-slate-400 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-3 sm:pt-4 px-3 sm:px-4 dark:bg-slate-900/95">
          {visit.notes && (
            <div className="mb-4 sm:mb-5">
              <h4 className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-indigo-700 dark:text-slate-300 flex items-center">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-indigo-600 dark:text-slate-400" />
                {t("notes")}:
              </h4>
              <div className="text-xs sm:text-sm text-gray-800 dark:text-slate-300 bg-indigo-50/80 dark:bg-slate-800/80 p-3 sm:p-4 rounded-md border border-indigo-100/60 dark:border-slate-700/60">
                <ReactMarkdown
                  components={{
                    p: ({ ...props }) => (
                      <p className="mb-2 last:mb-0" {...props} />
                    ),
                    h1: ({ ...props }) => (
                      <h1
                        className="text-base sm:text-lg font-bold mb-2"
                        {...props}
                      />
                    ),
                    h2: ({ ...props }) => (
                      <h2
                        className="text-sm sm:text-md font-bold mb-2"
                        {...props}
                      />
                    ),
                    h3: ({ ...props }) => (
                      <h3
                        className="text-xs sm:text-sm font-bold mb-1"
                        {...props}
                      />
                    ),
                    ul: ({ ...props }) => (
                      <ul className="list-disc px-3 sm:px-4 mb-2" {...props} />
                    ),
                    ol: ({ ...props }) => (
                      <ol
                        className="list-decimal px-3 sm:px-4 mb-2"
                        {...props}
                      />
                    ),
                    li: ({ ...props }) => <li className="mb-1" {...props} />,
                    strong: ({ ...props }) => (
                      <strong
                        className="font-bold text-indigo-700 dark:text-slate-200"
                        {...props}
                      />
                    ),
                  }}
                >
                  {visit.notes}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Visit section data */}
          {visit.sectionData && Object.keys(visit.sectionData).length > 0 && (
            <div>
              <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-indigo-700 dark:text-slate-300 flex items-center">
                <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-indigo-600 dark:text-slate-400" />
                {t("visitDetails")}:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                {Object.entries(visit.sectionData)
                  .filter(
                    ([key]) => key !== "visitType" && key !== "followUpDate"
                  )
                  .map(([key, value]) => {
                    const displayValue = isLikelyDate(value, key)
                      ? formatDateCleaner(value)
                      : typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value);

                    return (
                      <div
                        key={key}
                        className="p-2 sm:p-3 rounded-lg transition-colors duration-200 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                      >
                        <h5 className="font-semibold text-indigo-800 dark:text-slate-200 text-xs sm:text-sm capitalize flex items-center mb-0.5 sm:mb-1">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </h5>
                        <p className="text-gray-800 dark:text-slate-300 text-xs sm:text-sm">
                          {displayValue}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

// VisitTabContent component
interface VisitTabContentProps {
  visits: Visit[];
  expandedVisits: Record<string, boolean>;
  toggleExpandVisit: (visitId: string) => void;
  handleDeleteVisit: (visitId: string) => void;
  handleRestoreVisit: (visitId: string) => void;
  isDeletingVisit: boolean;
  formatDateCleaner: (date?: string) => string;
  isDeleted?: boolean;
  setIsVisitDialogOpen: (isOpen: boolean) => void;
  t: any;
  dir: string;
}

const VisitTabContent = ({
  visits,
  expandedVisits,
  toggleExpandVisit,
  handleDeleteVisit,
  handleRestoreVisit,
  isDeletingVisit,
  formatDateCleaner,
  isDeleted = false,
  setIsVisitDialogOpen,
  t,
  dir,
}: VisitTabContentProps) => {
  if (visits.length === 0) {
    return (
      <EmptyState
        isDeleted={isDeleted}
        t={t}
        onAddVisit={() => setIsVisitDialogOpen(true)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {visits.map((visit) => (
        <VisitCard
          key={visit._id}
          visit={visit}
          isExpanded={expandedVisits[visit._id]}
          toggleExpand={toggleExpandVisit}
          onDelete={handleDeleteVisit}
          onRestore={handleRestoreVisit}
          isDeletingVisit={isDeletingVisit}
          formatDateCleaner={formatDateCleaner}
          t={t}
          dir={dir}
        />
      ))}
    </div>
  );
};

// Main VisitsTab component
export function VisitsTab({
  patient,
  formatDate,
  handleDeleteVisit,
  handleRestoreVisit,
  isDeletingVisit,
  setIsVisitDialogOpen,
}: VisitsTabProps) {
  const { t, dir } = useLanguage();
  const [expandedVisits, setExpandedVisits] = useState<Record<string, boolean>>(
    {}
  );

  const toggleExpandVisit = (visitId: string) => {
    setExpandedVisits((prev) => ({
      ...prev,
      [visitId]: !prev[visitId],
    }));
  };

  // Format date cleaner
  const formatDateCleaner = (date?: string) =>
    formatDateHelper(date, formatDate, t);

  // Filter visits
  const activeVisits =
    patient?.visits?.filter((visit) => !visit.isDeleted) || [];
  const deletedVisits =
    patient?.visits?.filter((visit) => visit.isDeleted) || [];

  return (
    <div>
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-indigo-100 dark:border-slate-800 shadow-xl transition-all duration-200">
        <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl text-indigo-800 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-slate-400" />
                {t("visitHistory")}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-indigo-600 dark:text-slate-400 mt-0.5 sm:mt-1">
                {t("patientVisitsAndAppointments")}
              </CardDescription>
            </div>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90 text-white h-8 sm:h-10 text-xs sm:text-sm"
              onClick={() => setIsVisitDialogOpen(true)}
            >
              <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-1 sm:mx-2" />{" "}
              {t("addVisit")}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-2 sm:p-4">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-3 sm:mb-4 bg-indigo-50 dark:bg-slate-800 p-0.5 sm:p-1">
              <TabsTrigger
                value="active"
                className="flex items-center gap-1 text-xs sm:text-sm py-1 sm:py-1.5 data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-800 dark:data-[state=active]:text-slate-200"
              >
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {t("active")}
                <Badge className="mx-1 text-xs px-1 py-0 bg-indigo-200 text-indigo-800 dark:bg-indigo-900/80 dark:text-slate-300">
                  {activeVisits.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="deleted"
                className="flex items-center gap-1 text-xs sm:text-sm py-1 sm:py-1.5 data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-800 dark:data-[state=active]:text-slate-200"
              >
                <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {t("deleted")}
                <Badge className="mx-1 text-xs px-1 py-0 bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-200">
                  {deletedVisits.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-0">
              <VisitTabContent
                visits={activeVisits}
                expandedVisits={expandedVisits}
                toggleExpandVisit={toggleExpandVisit}
                handleDeleteVisit={handleDeleteVisit}
                handleRestoreVisit={handleRestoreVisit}
                isDeletingVisit={isDeletingVisit}
                formatDateCleaner={formatDateCleaner}
                setIsVisitDialogOpen={setIsVisitDialogOpen}
                t={t}
                dir={dir}
              />
            </TabsContent>

            <TabsContent value="deleted" className="mt-0">
              <VisitTabContent
                visits={deletedVisits}
                expandedVisits={expandedVisits}
                toggleExpandVisit={toggleExpandVisit}
                handleDeleteVisit={handleDeleteVisit}
                handleRestoreVisit={handleRestoreVisit}
                isDeletingVisit={isDeletingVisit}
                formatDateCleaner={formatDateCleaner}
                isDeleted={true}
                setIsVisitDialogOpen={setIsVisitDialogOpen}
                t={t}
                dir={dir}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

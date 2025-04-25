import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Info,
  Shield,
  Pill,
} from "lucide-react";
import { PatientTabsProps } from "./types";
import { TreatmentSuggestions } from "./TreatmentSuggestions";

// Helper component for section data display
const InfoItem = ({
  icon: Icon,
  label,
  value,
  fullWidth = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
  fullWidth?: boolean;
}) => (
  <div
    className={cn(
      "p-4 rounded-lg transition-colors duration-200",
      "bg-green-50 hover:bg-green-100 dark:bg-slate-800 dark:hover:bg-slate-700",
      fullWidth ? "md:col-span-2" : ""
    )}
  >
    <div className="flex items-center mb-2">
      <Icon className="h-5 w-5 text-green-600 dark:text-slate-400 mr-2" />
      <span className="font-semibold text-green-800 dark:text-slate-200">
        {label}
      </span>
    </div>
    <p className="text-gray-800 dark:text-slate-300">
      {value || "Not provided"}
    </p>
  </div>
);

export function PatientTabs({
  patient,
  formatDate,
  handleDeleteVisit,
  handleRestoreVisit,
  isDeletingVisit,
  setIsVisitDialogOpen,
}: PatientTabsProps) {
  return (
    <Tabs defaultValue="sections" className="w-full">
      <TabsList className="mb-6 bg-white dark:bg-slate-900 border border-green-100 dark:border-slate-800 shadow-md rounded-lg p-1">
        <TabsTrigger
          value="sections"
          className="data-[state=active]:bg-green-50 data-[state=active]:text-green-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 rounded-md"
        >
          <FileText className="h-4 w-4 mr-2" />
          Patient Information
        </TabsTrigger>
        <TabsTrigger
          value="visits"
          className="data-[state=active]:bg-green-50 data-[state=active]:text-green-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 rounded-md"
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          Visits ({patient?.visits?.length || 0})
        </TabsTrigger>
        <TabsTrigger
          value="status"
          className="data-[state=active]:bg-green-50 data-[state=active]:text-green-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 rounded-md"
        >
          <Shield className="h-4 w-4 mr-2" />
          Status History
        </TabsTrigger>
        <TabsTrigger
          value="treatment"
          className="data-[state=active]:bg-green-50 data-[state=active]:text-green-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 rounded-md"
        >
          <Pill className="h-4 w-4 mr-2" />
          Treatment Suggestions
        </TabsTrigger>
      </TabsList>

      {/* Patient Information Tab */}
      <TabsContent
        value="sections"
        className="animate-in fade-in-50 duration-300"
      >
        <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-green-100 dark:border-slate-800 shadow-xl transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-slate-300 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-green-600 dark:text-slate-400" />
              Patient Information
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-slate-400">
              All sections from {patient?.templateId?.name || "template"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {Object.entries(patient?.sectionData || {}).map(
              ([sectionKey, sectionValue]) => (
                <div key={sectionKey} className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 capitalize flex items-center gap-2 text-green-700 dark:text-slate-300">
                    <FileText className="h-5 w-5 text-green-600 dark:text-slate-400" />
                    {sectionKey.replace(/([A-Z])/g, " $1").trim()}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(sectionValue as Record<string, any>).map(
                      ([fieldKey, fieldValue]) => (
                        <InfoItem
                          key={fieldKey}
                          icon={Info}
                          label={fieldKey
                            .replace(/_/g, " ")
                            .replace(/([A-Z])/g, " $1")
                            .trim()}
                          value={
                            typeof fieldValue === "boolean"
                              ? fieldValue
                                ? "Yes"
                                : "No"
                              : String(fieldValue || "Not provided")
                          }
                        />
                      )
                    )}
                  </div>

                  <Separator className="my-6 bg-green-100 dark:bg-slate-700" />
                </div>
              )
            )}

            {/* If there are no sections */}
            {(!patient?.sectionData ||
              Object.keys(patient?.sectionData).length === 0) && (
              <div className="text-center p-8 bg-green-50/50 dark:bg-slate-800/50 rounded-lg">
                <FileText className="h-12 w-12 mx-auto text-green-300 dark:text-slate-600 mb-3" />
                <p className="text-green-600 dark:text-slate-400 font-medium">
                  No patient information available
                </p>
                <p className="text-green-500 dark:text-slate-500 text-sm mt-1">
                  This patient doesn't have any information sections recorded
                  yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Visits Tab */}
      <TabsContent
        value="visits"
        className="animate-in fade-in-50 duration-300"
      >
        <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-green-100 dark:border-slate-800 shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl text-green-800 dark:text-slate-300 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-green-600 dark:text-slate-400" />
                Visit History
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-slate-400">
                Patient visits and appointments
              </CardDescription>
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition-colors"
              onClick={() => setIsVisitDialogOpen(true)}
            >
              <CalendarDays className="h-4 w-4 mr-2" /> Add Visit
            </Button>
          </CardHeader>

          <CardContent>
            {patient?.visits && patient.visits.length > 0 ? (
              <div className="space-y-4">
                {patient.visits.map((visit) => (
                  <Card
                    key={visit._id}
                    className={cn(
                      "border transition-all duration-200",
                      visit.isDeleted
                        ? "border-red-200 dark:border-slate-700 bg-red-50/50 dark:bg-slate-800/50 opacity-80"
                        : "border-green-100 dark:border-slate-800 hover:border-green-200 dark:hover:border-slate-700 hover:shadow-md"
                    )}
                  >
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CardTitle
                            className={cn(
                              "text-base text-green-800 dark:text-slate-300",
                              visit.isDeleted ? "line-through opacity-70" : ""
                            )}
                          >
                            {visit.title ||
                              `Visit on ${formatDate(visit.date)}`}
                          </CardTitle>
                          {visit.isDeleted && (
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Deleted
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-green-50 dark:bg-slate-800 text-green-800 dark:text-slate-300 border-green-200 dark:border-slate-700"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(visit.date)}
                          </Badge>
                          {visit.isDeleted ? (
                            <Button
                              variant="outline"
                              onClick={() => handleRestoreVisit(visit._id)}
                              size="sm"
                              className="h-8 border-green-200 dark:border-slate-700 hover:bg-green-100 dark:hover:bg-slate-800 text-green-700 dark:text-slate-300"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              Restore
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteVisit(visit._id)}
                              disabled={isDeletingVisit}
                              className="h-8 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <AlertCircle className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {!visit.isDeleted && (
                      <CardContent>
                        {visit.notes && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-1 text-green-700 dark:text-slate-300">
                              Notes:
                            </h4>
                            <p className="text-gray-600 dark:text-slate-400 text-sm bg-green-50/80 dark:bg-slate-800/80 p-3 rounded-md">
                              {visit.notes}
                            </p>
                          </div>
                        )}

                        {/* Visit section data */}
                        {visit.sectionData &&
                          Object.keys(visit.sectionData).length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2 text-green-700 dark:text-slate-300">
                                Visit Details:
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(visit.sectionData).map(
                                  ([key, value]) => (
                                    <div
                                      key={key}
                                      className="bg-green-50/80 dark:bg-slate-800/80 p-3 rounded-md border border-green-100 dark:border-slate-700"
                                    >
                                      <h5 className="text-xs font-medium mb-1 capitalize text-green-700 dark:text-slate-300">
                                        {key.replace(/([A-Z])/g, " $1").trim()}:
                                      </h5>
                                      <p className="text-xs text-gray-600 dark:text-slate-400">
                                        {typeof value === "object"
                                          ? JSON.stringify(value)
                                          : String(value)}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-green-50/50 dark:bg-slate-800/50 rounded-lg">
                <CalendarDays className="h-12 w-12 mx-auto text-green-300 dark:text-slate-600 mb-3" />
                <p className="text-green-600 dark:text-slate-400 font-medium">
                  No visits recorded for this patient
                </p>
                <p className="text-green-500 dark:text-slate-500 text-sm mt-1 mb-4">
                  Add the first visit to start tracking this patient's history
                </p>
                <Button
                  className="bg-green-600 hover:bg-green-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition-colors"
                  onClick={() => setIsVisitDialogOpen(true)}
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Add First Visit
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Status History Tab */}
      <TabsContent
        value="status"
        className="animate-in fade-in-50 duration-300"
      >
        <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-green-100 dark:border-slate-800 shadow-xl transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-slate-300 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600 dark:text-slate-400" />
              Status History
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-slate-400">
              Changes in patient status over time
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Current Status */}
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-3 text-green-700 dark:text-slate-300">
                Current Status
              </h3>
              <div className="p-4 border border-green-100 dark:border-slate-800 rounded-lg bg-green-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <Badge
                    style={{
                      backgroundColor:
                        (patient?.status as any)?.color || "#3498db",
                    }}
                    className="text-white text-xs px-3 py-1"
                  >
                    {(patient?.status as any)?.label || "Unknown"}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    Since:{" "}
                    {formatDate((patient?.status as any)?.date || new Date())}
                  </span>
                </div>
                {(patient?.status as any)?.notes && (
                  <p className="text-sm text-gray-600 dark:text-slate-300 p-3 bg-white/80 dark:bg-slate-900/80 rounded-md border border-green-100 dark:border-slate-700">
                    {(patient.status as any).notes}
                  </p>
                )}
              </div>
            </div>

            {/* Status History */}
            <div>
              <h3 className="text-base font-semibold mb-3 text-green-700 dark:text-slate-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600 dark:text-slate-400" />
                History
              </h3>

              {patient?.statusHistory && patient.statusHistory.length > 0 ? (
                <div className="space-y-4">
                  {patient.statusHistory.map((statusItem, index) => (
                    <div
                      key={index}
                      className="p-4 border border-green-100 dark:border-slate-800 rounded-lg bg-green-50/30 dark:bg-slate-800/30 hover:bg-green-50/70 dark:hover:bg-slate-800/70 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          variant="outline"
                          className="bg-white dark:bg-slate-900 text-xs border-green-200 dark:border-slate-700"
                        >
                          {statusItem.label}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-slate-400 flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {formatDate(statusItem.date)}
                        </span>
                      </div>
                      {statusItem.notes && (
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 p-2 bg-white/80 dark:bg-slate-900/80 rounded-md">
                          {statusItem.notes}
                        </p>
                      )}
                      <div className="text-xs text-gray-400 dark:text-slate-500 mt-2 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        Updated by: {statusItem.updatedBy}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-green-50/50 dark:bg-slate-800/50 rounded-lg">
                  <Shield className="h-12 w-12 mx-auto text-green-300 dark:text-slate-600 mb-3" />
                  <p className="text-green-600 dark:text-slate-400 font-medium">
                    No status history available
                  </p>
                  <p className="text-green-500 dark:text-slate-500 text-sm mt-1">
                    Status changes will appear here when they occur
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Treatment Suggestions Tab */}
      <TabsContent
        value="treatment"
        className="animate-in fade-in-50 duration-300"
      >
        <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-green-100 dark:border-slate-800 shadow-xl transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-slate-300 flex items-center gap-2">
              <Pill className="h-5 w-5 text-green-600 dark:text-slate-400" />
              Treatment Suggestions
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-slate-400">
              AI-powered treatment suggestions based on patient data
            </CardDescription>
          </CardHeader>

          <CardContent>
            <TreatmentSuggestions patientId={patient?.id || ""} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

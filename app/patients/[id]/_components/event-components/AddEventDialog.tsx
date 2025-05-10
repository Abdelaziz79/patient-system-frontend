import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IEventInput } from "@/app/_types/Patient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  Award,
  Calendar,
  CalendarCheck,
  Clipboard,
  FilePlus,
  FileText,
  FlaskConical,
  HeartPulse,
  Info,
  Loader2,
  Scissors,
  Share,
  Stethoscope,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

// Type definitions for event types
export type EventType =
  | "general"
  | "medication"
  | "procedure"
  | "lab_result"
  | "diagnosis"
  | "referral"
  | "appointment"
  | "therapy"
  | "surgery"
  | "lab"
  | "consultation"
  | "admission"
  | "discharge"
  | "other";

export type ImportanceLevel = "low" | "medium" | "high" | "critical";

interface AddEventDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddEvent: (eventData: IEventInput) => Promise<any>;
  isAddingEvent: boolean;
  onEventUpdate?: () => void;
}

// Define fields for different event types
const eventTypeFields: Record<
  EventType,
  Array<{
    name: string;
    type: "text" | "textarea" | "date" | "select" | "number";
    options?: string[];
  }>
> = {
  general: [{ name: "notes", type: "textarea" }],
  medication: [
    { name: "medication_name", type: "text" },
    { name: "dosage", type: "text" },
    { name: "frequency", type: "text" },
    {
      name: "route",
      type: "select",
      options: [
        "oral",
        "intravenous",
        "intramuscular",
        "subcutaneous",
        "topical",
        "inhalation",
        "other",
      ],
    },
    { name: "duration", type: "text" },
    { name: "prescriber", type: "text" },
    { name: "notes", type: "textarea" },
  ],
  procedure: [
    { name: "procedure_name", type: "text" },
    { name: "performed_by", type: "text" },
    { name: "location", type: "text" },
    { name: "outcome", type: "textarea" },
    { name: "notes", type: "textarea" },
  ],
  lab_result: [
    { name: "test_name", type: "text" },
    { name: "result", type: "text" },
    { name: "reference_range", type: "text" },
    { name: "notes", type: "textarea" },
  ],
  diagnosis: [
    { name: "diagnosis_name", type: "text" },
    { name: "diagnosis_code", type: "text" },
    { name: "diagnosed_by", type: "text" },
    { name: "notes", type: "textarea" },
  ],
  referral: [
    { name: "referred_to", type: "text" },
    { name: "referred_by", type: "text" },
    { name: "reason", type: "textarea" },
    { name: "urgent", type: "select", options: ["yes", "no"] },
    { name: "notes", type: "textarea" },
  ],
  appointment: [
    { name: "provider", type: "text" },
    { name: "location", type: "text" },
    { name: "reason", type: "text" },
    {
      name: "status",
      type: "select",
      options: ["scheduled", "completed", "cancelled", "no_show"],
    },
    { name: "notes", type: "textarea" },
  ],
  therapy: [
    { name: "therapy_type", type: "text" },
    { name: "therapist", type: "text" },
    { name: "duration", type: "text" },
    { name: "outcome", type: "textarea" },
    { name: "notes", type: "textarea" },
  ],
  surgery: [
    { name: "procedure_name", type: "text" },
    { name: "surgeon", type: "text" },
    {
      name: "anesthesia_type",
      type: "select",
      options: ["general", "local", "regional", "sedation", "none"],
    },
    { name: "location", type: "text" },
    { name: "outcome", type: "textarea" },
    { name: "complications", type: "textarea" },
    { name: "notes", type: "textarea" },
  ],
  lab: [
    { name: "test_name", type: "text" },
    { name: "ordered_by", type: "text" },
    {
      name: "status",
      type: "select",
      options: ["ordered", "collected", "in_process", "completed", "cancelled"],
    },
    { name: "notes", type: "textarea" },
  ],
  consultation: [
    { name: "consultant", type: "text" },
    { name: "specialty", type: "text" },
    { name: "reason", type: "textarea" },
    { name: "recommendations", type: "textarea" },
    { name: "notes", type: "textarea" },
  ],
  admission: [
    { name: "facility", type: "text" },
    { name: "admitting_physician", type: "text" },
    { name: "room", type: "text" },
    { name: "reason", type: "textarea" },
    { name: "expected_stay", type: "text" },
    { name: "notes", type: "textarea" },
  ],
  discharge: [
    { name: "facility", type: "text" },
    { name: "discharging_physician", type: "text" },
    {
      name: "discharge_disposition",
      type: "select",
      options: [
        "home",
        "skilled_nursing",
        "rehabilitation",
        "long_term_care",
        "expired",
        "other",
      ],
    },
    { name: "follow_up", type: "text" },
    { name: "instructions", type: "textarea" },
    { name: "notes", type: "textarea" },
  ],
  other: [
    { name: "category", type: "text" },
    { name: "notes", type: "textarea" },
  ],
};

export function AddEventDialog({
  isOpen,
  setIsOpen,
  onAddEvent,
  isAddingEvent,
  onEventUpdate,
}: AddEventDialogProps) {
  const { t, dir } = useLanguage();

  // New event form state
  const [newEvent, setNewEvent] = useState<{
    title: string;
    date: Date;
    eventType: EventType;
    importance: ImportanceLevel;
    notes: string;
    sectionData: Record<string, any>;
    activeTab: string;
  }>({
    title: "",
    date: new Date(),
    eventType: "general",
    importance: "medium",
    notes: "",
    sectionData: {},
    activeTab: "basic",
  });

  // Get icon for event type
  const getEventTypeIcon = (type: EventType) => {
    const iconMap: Record<EventType, React.ReactNode> = {
      general: <Calendar className="h-5 w-5" />,
      medication: <FileText className="h-5 w-5" />,
      procedure: <Clipboard className="h-5 w-5" />,
      lab_result: <FlaskConical className="h-5 w-5" />,
      diagnosis: <Stethoscope className="h-5 w-5" />,
      referral: <Share className="h-5 w-5" />,
      appointment: <CalendarCheck className="h-5 w-5" />,
      therapy: <Award className="h-5 w-5" />,
      surgery: <Scissors className="h-5 w-5" />,
      lab: <FlaskConical className="h-5 w-5" />,
      consultation: <HeartPulse className="h-5 w-5" />,
      admission: <UserPlus className="h-5 w-5" />,
      discharge: <UserMinus className="h-5 w-5" />,
      other: <Info className="h-5 w-5" />,
    };

    return iconMap[type] || <Calendar className="h-5 w-5" />;
  };

  // Get color for event type
  const getEventTypeColor = (type: EventType) => {
    const colorMap: Record<EventType, { light: string; dark: string }> = {
      general: { light: "#6366f1", dark: "#818cf8" }, // indigo
      medication: { light: "#10b981", dark: "#34d399" }, // emerald
      procedure: { light: "#8b5cf6", dark: "#a78bfa" }, // violet
      lab_result: { light: "#f59e0b", dark: "#fbbf24" }, // amber
      diagnosis: { light: "#ef4444", dark: "#f87171" }, // red
      referral: { light: "#ec4899", dark: "#f472b6" }, // pink
      appointment: { light: "#3b82f6", dark: "#60a5fa" }, // blue
      therapy: { light: "#8b5cf6", dark: "#a78bfa" }, // violet
      surgery: { light: "#ef4444", dark: "#f87171" }, // red
      lab: { light: "#f59e0b", dark: "#fbbf24" }, // amber
      consultation: { light: "#3b82f6", dark: "#60a5fa" }, // blue
      admission: { light: "#f43f5e", dark: "#fb7185" }, // rose
      discharge: { light: "#14b8a6", dark: "#2dd4bf" }, // teal
      other: { light: "#6b7280", dark: "#9ca3af" }, // gray
    };

    return colorMap[type] || { light: "#6b7280", dark: "#9ca3af" };
  };

  // Get color for importance level
  const getImportanceColor = (level: ImportanceLevel) => {
    const colorMap: Record<ImportanceLevel, { light: string; dark: string }> = {
      low: { light: "#10b981", dark: "#34d399" }, // emerald
      medium: { light: "#f59e0b", dark: "#fbbf24" }, // amber
      high: { light: "#ef4444", dark: "#f87171" }, // red
      critical: { light: "#7f1d1d", dark: "#b91c1c" }, // dark red
    };

    return colorMap[level] || { light: "#6b7280", dark: "#9ca3af" };
  };

  // Reset section data when event type changes
  useEffect(() => {
    const newSectionData: Record<string, any> = {};
    eventTypeFields[newEvent.eventType].forEach((field) => {
      newSectionData[field.name] = newEvent.sectionData[field.name] || "";
    });

    setNewEvent((prev) => ({
      ...prev,
      sectionData: newSectionData,
    }));
  }, [newEvent.eventType]);

  // Handler for updating section data
  const handleSectionDataChange = (fieldName: string, value: any) => {
    setNewEvent({
      ...newEvent,
      sectionData: {
        ...newEvent.sectionData,
        [fieldName]: value,
      },
    });
  };

  // Handler for adding a new event
  const handleAddEvent = async () => {
    if (!newEvent.title) {
      toast.error(t("eventTitleRequired"));
      return;
    }

    // Prepare event data
    const eventData: IEventInput = {
      title: newEvent.title,
      date: newEvent.date,
      eventType: newEvent.eventType as any,
      importance: newEvent.importance as any,
      sectionData: newEvent.sectionData,
      createdBy: "", // This will be filled by the backend
    };

    try {
      const result = await onAddEvent(eventData);

      if (result.success) {
        toast.success(t("eventAddedSuccess"));
        setIsOpen(false);

        // Reset form
        setNewEvent({
          title: "",
          date: new Date(),
          eventType: "general",
          importance: "medium",
          notes: "",
          sectionData: {},
          activeTab: "basic",
        });

        // Refresh patient data
        if (onEventUpdate) {
          onEventUpdate();
        }
      } else {
        toast.error(result.error || t("failedToAddEvent"));
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error(t("errorAddingEvent"));
    }
  };

  // Get appropriate fields based on event type
  const currentEventFields = useMemo(() => {
    return eventTypeFields[newEvent.eventType] || [];
  }, [newEvent.eventType]);

  const eventTypeColor = getEventTypeColor(newEvent.eventType);
  const importanceColor = getImportanceColor(newEvent.importance);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        dir={dir}
        className="sm:max-w-[700px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div
              className="p-2 rounded-full"
              style={{
                backgroundColor: `${eventTypeColor.light}20`,
                color: eventTypeColor.light,
              }}
              dir={dir}
            >
              {getEventTypeIcon(newEvent.eventType)}
            </div>
            <span className="text-gray-800 dark:text-gray-100">
              {t("addPatientEvent")}
            </span>
            <Badge
              className="mx-auto"
              style={{
                backgroundColor: importanceColor.light,
                color: "#fff",
              }}
            >
              {t(newEvent.importance as any)}
            </Badge>
          </DialogTitle>
          <DialogDescription
            className={`flex text-gray-600 dark:text-gray-300 ${
              dir === "rtl" ? "items-end" : ""
            }`}
          >
            {t("addEventDescription")}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="basic"
          value={newEvent.activeTab}
          onValueChange={(value) =>
            setNewEvent({ ...newEvent, activeTab: value })
          }
          dir={dir as "ltr" | "rtl"}
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="basic" className="rounded-l-md">
              {t("basicInfo")}
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-r-md">
              {t("eventDetails")}
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("title")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800"
                  placeholder={t("eventTitlePlaceholder")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("dateAndTime")}
                </Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={
                    newEvent.date instanceof Date
                      ? new Date(
                          newEvent.date.getTime() -
                            newEvent.date.getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: new Date(e.target.value) })
                  }
                  className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="eventType"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("eventType")}
                </Label>
                <Select
                  value={newEvent.eventType}
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, eventType: value as EventType })
                  }
                >
                  <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800">
                    <SelectValue placeholder={t("selectEventType")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {(Object.keys(eventTypeFields) as EventType[]).map(
                        (type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="p-1 rounded-full"
                                style={{
                                  backgroundColor: `${
                                    getEventTypeColor(type).light
                                  }20`,
                                  color: getEventTypeColor(type).light,
                                }}
                              >
                                {getEventTypeIcon(type)}
                              </div>
                              <span>{t(type as any)}</span>
                            </div>
                          </SelectItem>
                        )
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="importance"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("importance")}
                </Label>
                <RadioGroup
                  value={newEvent.importance}
                  onValueChange={(value) =>
                    setNewEvent({
                      ...newEvent,
                      importance: value as ImportanceLevel,
                    })
                  }
                  dir={dir as "ltr" | "rtl"}
                  className="flex flex-wrap gap-2"
                >
                  <div className="flex items-center gap-x-2">
                    <RadioGroupItem
                      value="low"
                      id="low"
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <Label htmlFor="low" className="text-sm cursor-pointer">
                      <Badge
                        variant="outline"
                        className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      >
                        {t("low")}
                      </Badge>
                    </Label>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <RadioGroupItem
                      value="medium"
                      id="medium"
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="medium" className="text-sm cursor-pointer">
                      <Badge
                        variant="outline"
                        className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      >
                        {t("medium")}
                      </Badge>
                    </Label>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <RadioGroupItem
                      value="high"
                      id="high"
                      className="text-red-600 focus:ring-red-500"
                    />
                    <Label htmlFor="high" className="text-sm cursor-pointer">
                      <Badge
                        variant="outline"
                        className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      >
                        {t("high")}
                      </Badge>
                    </Label>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <RadioGroupItem
                      value="critical"
                      id="critical"
                      className="text-red-800 focus:ring-red-700"
                    />
                    <Label
                      htmlFor="critical"
                      className="text-sm cursor-pointer"
                    >
                      <Badge
                        variant="outline"
                        className="border-red-300 dark:border-red-900 bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300"
                      >
                        {t("critical" as any)}
                      </Badge>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Button
              onClick={() => setNewEvent({ ...newEvent, activeTab: "details" })}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {t("nextStep" as any)}
            </Button>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 gap-4">
                {currentEventFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label
                      htmlFor={field.name}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize"
                    >
                      {t(field.name.replace("_", " ") as any)}
                    </Label>

                    {field.type === "textarea" && (
                      <Textarea
                        id={field.name}
                        value={newEvent.sectionData[field.name] || ""}
                        onChange={(e) =>
                          handleSectionDataChange(field.name, e.target.value)
                        }
                        className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800"
                        placeholder={t(`${field.name}Placeholder` as any)}
                        rows={3}
                      />
                    )}

                    {field.type === "text" && (
                      <Input
                        id={field.name}
                        value={newEvent.sectionData[field.name] || ""}
                        onChange={(e) =>
                          handleSectionDataChange(field.name, e.target.value)
                        }
                        className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800"
                        placeholder={t(`${field.name}Placeholder` as any)}
                      />
                    )}

                    {field.type === "date" && (
                      <Input
                        id={field.name}
                        type="date"
                        value={newEvent.sectionData[field.name] || ""}
                        onChange={(e) =>
                          handleSectionDataChange(field.name, e.target.value)
                        }
                        className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800"
                      />
                    )}

                    {field.type === "number" && (
                      <Input
                        id={field.name}
                        type="number"
                        value={newEvent.sectionData[field.name] || ""}
                        onChange={(e) =>
                          handleSectionDataChange(field.name, e.target.value)
                        }
                        className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800"
                      />
                    )}

                    {field.type === "select" && field.options && (
                      <Select
                        value={newEvent.sectionData[field.name] || ""}
                        onValueChange={(value) =>
                          handleSectionDataChange(field.name, value)
                        }
                      >
                        <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800">
                          <SelectValue
                            placeholder={t(
                              `select${
                                field.name.charAt(0).toUpperCase() +
                                field.name.slice(1)
                              }` as any
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          {field.options.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="cursor-pointer"
                            >
                              {t(option as any)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-x-2">
              <Button
                onClick={() => setNewEvent({ ...newEvent, activeTab: "basic" })}
                variant="outline"
                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
              >
                {t("back")}
              </Button>

              <Button
                onClick={handleAddEvent}
                disabled={isAddingEvent || !newEvent.title}
                className="w-1/2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
              >
                {isAddingEvent ? (
                  <>
                    <Loader2 className="h-4 w-4 mx-2 animate-spin" />
                    {t("adding")}
                  </>
                ) : (
                  <>
                    <FilePlus className="h-4 w-4 mx-2" />
                    {t("addEvent")}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  {t("cancel")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("cancelEventCreation")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center gap-x-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t("requiredFieldsNotice")}
            </span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

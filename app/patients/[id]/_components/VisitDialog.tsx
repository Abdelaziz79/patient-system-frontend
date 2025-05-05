import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";
import {
  Activity,
  Calendar,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  Pill,
  Plus,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// Define types for the component
export interface Patient {
  personalInfo?: {
    firstName: string;
    lastName?: string;
  };
  [key: string]: any;
}

export interface VisitSectionData {
  duration?: string;
  followUpDate?: Date;
  followUpNotes?: string;
  visitType?: string;
  symptoms?: string;
  observations?: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string;
  vitals?: string;
  [key: string]: any;
}

export interface VisitData {
  id?: string;
  title: string;
  date: Date | null;
  time?: string;
  notes: string;
  sectionData: VisitSectionData;
}

export interface VisitDialogProps {
  isVisitDialogOpen: boolean;
  setIsVisitDialogOpen: (isOpen: boolean) => void;
  newVisit: VisitData;
  setNewVisit: (visit: VisitData) => void;
  handleAddVisit: () => Promise<void>;
  isAddingVisit: boolean;
  patient: Patient | null;
  handleGenerateVisitNotes: (
    symptoms: string,
    observations: string
  ) => Promise<void>;
  isGeneratingNotes: boolean;
}

interface ErrorState {
  title?: string;
  date?: string;
  time?: string;
  followUpDate?: string;
  followUpTime?: string;
  [key: string]: string | undefined;
}

export function VisitDialog({
  isVisitDialogOpen,
  setIsVisitDialogOpen,
  newVisit,
  setNewVisit,
  handleAddVisit,
  isAddingVisit,
  patient,
  handleGenerateVisitNotes,
  isGeneratingNotes,
}: VisitDialogProps) {
  const [errors, setErrors] = useState<ErrorState>({});
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "followup">(
    "basic"
  );
  const [visitDuration, setVisitDuration] = useState<string>("");
  const [followUpNeeded, setFollowUpNeeded] = useState<boolean>(false);
  const [symptoms, setSymptoms] = useState<string>("");
  const [observations, setObservations] = useState<string>("");
  const [visitTime, setVisitTime] = useState<string>(
    format(new Date(), "HH:mm")
  );
  const [followUpTime, setFollowUpTime] = useState<string>(
    format(new Date(), "HH:mm")
  );

  // Format date helper
  const formatDateForInput = (
    date: Date | string | null | undefined
  ): string => {
    if (!date) return "";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      if (!isValid(dateObj)) return "";
      return format(dateObj, "yyyy-MM-dd");
    } catch (e) {
      return "";
    }
  };

  // Format time helper
  const formatTimeForInput = (date: Date | null | undefined): string => {
    if (!date) return "";
    try {
      if (!isValid(date)) return "";
      return format(date, "HH:mm");
    } catch (e) {
      return "";
    }
  };

  // Common visit types
  const visitTypes: string[] = [
    "Initial Consultation",
    "Follow-up",
    "Emergency",
    "Routine Checkup",
    "Treatment Session",
    "Lab Review",
    "Specialist Referral",
    "Telemedicine",
    "Home Visit",
    "Other",
  ];

  // Reset form errors when dialog opens/closes
  useEffect(() => {
    if (isVisitDialogOpen) {
      setErrors({});

      // Set current time as default if no time is set
      if (!visitTime) {
        setVisitTime(format(new Date(), "HH:mm"));
      }

      if (!followUpTime) {
        setFollowUpTime(format(new Date(), "HH:mm"));
      }
    }
  }, [isVisitDialogOpen]);

  // Initialize follow-up needed state based on existing data
  useEffect(() => {
    if (isVisitDialogOpen && newVisit?.sectionData?.followUpDate) {
      setFollowUpNeeded(true);
      if (newVisit.sectionData.followUpDate) {
        setFollowUpTime(
          formatTimeForInput(newVisit.sectionData.followUpDate) ||
            format(new Date(), "HH:mm")
        );
      }
    } else {
      setFollowUpNeeded(false);
    }

    // Initialize duration from visit data
    if (newVisit?.sectionData?.duration) {
      setVisitDuration(newVisit.sectionData.duration);
    }

    // Initialize visit time if available
    if (newVisit.date) {
      setVisitTime(
        formatTimeForInput(newVisit.date) || format(new Date(), "HH:mm")
      );
    }

    // Initialize symptoms and observations
    if (newVisit?.sectionData?.symptoms) {
      setSymptoms(newVisit.sectionData.symptoms);
    }

    if (newVisit?.sectionData?.observations) {
      setObservations(newVisit.sectionData.observations);
    }
  }, [isVisitDialogOpen, newVisit]);

  // Add duration to visit data when it changes
  useEffect(() => {
    if (visitDuration) {
      setNewVisit({
        ...newVisit,
        sectionData: {
          ...newVisit.sectionData,
          duration: visitDuration,
        },
      });
    }
  }, [visitDuration]);

  const validateForm = (): boolean => {
    const newErrors: ErrorState = {};

    if (!newVisit.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!newVisit.date) {
      newErrors.date = "Date is required";
    }

    if (!visitTime) {
      newErrors.time = "Time is required";
    }

    if (followUpNeeded && !newVisit.sectionData.followUpDate) {
      newErrors.followUpDate = "Follow-up date is required";
    }

    if (followUpNeeded && !followUpTime) {
      newErrors.followUpTime = "Follow-up time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Combine date and time
  const combineDateAndTime = (
    date: Date | null,
    timeString: string
  ): Date | null => {
    if (!date || !timeString) return date;

    const newDate = new Date(date);
    const [hours, minutes] = timeString.split(":").map(Number);

    newDate.setHours(hours || 0);
    newDate.setMinutes(minutes || 0);

    return newDate;
  };

  // Update date helper to handle time setting
  const updateDateWithTime = (
    date: Date | null,
    timeString: string
  ): Date | undefined => {
    if (!date) {
      // If no date is set, use today with the specified time
      const now = new Date();
      const [hours, minutes] = timeString.split(":").map(Number);
      now.setHours(hours || 0);
      now.setMinutes(minutes || 0);
      now.setSeconds(0);
      now.setMilliseconds(0);
      return now;
    }

    const combinedDate = combineDateAndTime(date, timeString);
    return combinedDate || undefined;
  };

  // Convert Date | null to Date | undefined for type safety
  const ensureDateType = (date: Date | null): Date | undefined => {
    return date || undefined;
  };

  const handleVisitDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const newDate = new Date(e.target.value);
      const updatedDate = combineDateAndTime(newDate, visitTime);
      setNewVisit({
        ...newVisit,
        date: updatedDate,
      });
    }
  };

  const handleVisitTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisitTime(e.target.value);
    if (newVisit.date) {
      const updatedDate = combineDateAndTime(newVisit.date, e.target.value);
      setNewVisit({
        ...newVisit,
        date: updatedDate,
      });
    }
  };

  const handleFollowUpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const newDate = new Date(e.target.value);
      const updatedDate = combineDateAndTime(newDate, followUpTime);
      setNewVisit({
        ...newVisit,
        sectionData: {
          ...newVisit.sectionData,
          followUpDate: ensureDateType(updatedDate),
        },
      });
    }
  };

  const handleFollowUpTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFollowUpTime(e.target.value);
    if (newVisit.sectionData.followUpDate) {
      const updatedDate = combineDateAndTime(
        newVisit.sectionData.followUpDate,
        e.target.value
      );
      setNewVisit({
        ...newVisit,
        sectionData: {
          ...newVisit.sectionData,
          followUpDate: ensureDateType(updatedDate),
        },
      });
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Combine date and time before submitting
      if (newVisit.date && visitTime) {
        const combinedDate = combineDateAndTime(newVisit.date, visitTime);
        setNewVisit({
          ...newVisit,
          date: combinedDate,
        });
      }

      if (newVisit.sectionData.followUpDate && followUpTime) {
        const combinedFollowUpDate = combineDateAndTime(
          newVisit.sectionData.followUpDate,
          followUpTime
        );

        setNewVisit({
          ...newVisit,
          sectionData: {
            ...newVisit.sectionData,
            followUpDate: ensureDateType(combinedFollowUpDate),
          },
        });
      }

      handleAddVisit();
    }
  };

  const handleVisitTypeSelect = (type: string) => {
    setNewVisit({
      ...newVisit,
      title: type,
      sectionData: {
        ...newVisit.sectionData,
        visitType: type,
      },
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVisit({
      ...newVisit,
      title: e.target.value,
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewVisit({
      ...newVisit,
      notes: e.target.value,
    });
  };

  const generateNotes = async () => {
    await handleGenerateVisitNotes(symptoms, observations);
  };

  const handleNextTab = () => {
    if (activeTab === "basic") {
      setActiveTab("details");
    } else if (activeTab === "details") {
      setActiveTab("followup");
    }
  };

  const handlePreviousTab = () => {
    if (activeTab === "followup") {
      setActiveTab("details");
    } else if (activeTab === "details") {
      setActiveTab("basic");
    } else {
      setIsVisitDialogOpen(false);
    }
  };

  // Handler for tab header clicks
  const handleTabHeaderClick = (tab: "basic" | "details" | "followup") => {
    setActiveTab(tab);
  };

  return (
    <Dialog open={isVisitDialogOpen} onOpenChange={setIsVisitDialogOpen}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 rounded-xl shadow-lg">
        {/* Header with gradient background */}
        <DialogHeader className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarCheck className="h-6 w-6 text-indigo-200" />
              <DialogTitle className="text-2xl font-bold">
                Add New Visit
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisitDialogOpen(false)}
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-base mt-2 text-indigo-100">
            Recording visit for{" "}
            <span className="font-medium text-white">
              {patient?.personalInfo?.firstName}{" "}
              {patient?.personalInfo?.lastName || ""}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="px-6 pt-6">
          <Tabs
            defaultValue="basic"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "basic" | "details" | "followup")
            }
            className="w-full"
          >
            <div className="mb-8">
              <div className="flex justify-between mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <span
                  className={cn(
                    "cursor-pointer py-1 px-2 rounded transition-colors",
                    activeTab === "basic"
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                      : "hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
                  )}
                  onClick={() => handleTabHeaderClick("basic")}
                >
                  Basic Info
                </span>
                <span
                  className={cn(
                    "cursor-pointer py-1 px-2 rounded transition-colors",
                    activeTab === "details"
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                      : "hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
                  )}
                  onClick={() => handleTabHeaderClick("details")}
                >
                  Clinical Details
                </span>
                <span
                  className={cn(
                    "cursor-pointer py-1 px-2 rounded transition-colors",
                    activeTab === "followup"
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                      : "hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
                  )}
                  onClick={() => handleTabHeaderClick("followup")}
                >
                  Follow-up
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width:
                      activeTab === "basic"
                        ? "33.3%"
                        : activeTab === "details"
                        ? "66.6%"
                        : "100%",
                  }}
                ></div>
              </div>
            </div>

            <TabsList className="hidden">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Clinical Details</TabsTrigger>
              <TabsTrigger value="followup">Follow-up</TabsTrigger>
            </TabsList>

            <TabsContent
              value="basic"
              className="space-y-6 focus-visible:outline-none focus-visible:ring-0 px-6"
            >
              <div className="grid gap-6">
                <div>
                  <Label
                    htmlFor="visit-type"
                    className="mb-2 text-base font-medium flex items-center gap-2"
                  >
                    <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Visit Type
                  </Label>
                  <Select
                    onValueChange={handleVisitTypeSelect}
                    defaultValue=""
                    value={newVisit.sectionData.visitType || ""}
                  >
                    <SelectTrigger className="w-full h-12 text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg">
                      <SelectValue placeholder="Select visit type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {visitTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-base"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Label
                    htmlFor="visit-title"
                    className="mb-2 text-base font-medium flex items-center gap-2"
                  >
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Title
                    <span className="text-red-500 mx-1">*</span>
                  </Label>
                  <Input
                    id="visit-title"
                    placeholder="Visit title"
                    value={newVisit.title}
                    onChange={handleTitleChange}
                    className={cn(
                      "h-12 text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg",
                      errors.title && "border-red-500 dark:border-red-500"
                    )}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Label
                      htmlFor="visit-date"
                      className="mb-2 text-base font-medium flex items-center gap-2"
                    >
                      <CalendarCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Visit Date
                      <span className="text-red-500 mx-1">*</span>
                    </Label>
                    <Input
                      id="visit-date"
                      type="date"
                      value={
                        newVisit.date ? formatDateForInput(newVisit.date) : ""
                      }
                      onChange={handleVisitDateChange}
                      className={cn(
                        "h-12 text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg",
                        errors.date && "border-red-500 dark:border-red-500"
                      )}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>

                  <div className="relative">
                    <Label
                      htmlFor="visit-time"
                      className="mb-2 text-base font-medium flex items-center gap-2"
                    >
                      <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Visit Time
                      <span className="text-red-500 mx-1">*</span>
                    </Label>
                    <Input
                      id="visit-time"
                      type="time"
                      value={visitTime}
                      onChange={handleVisitTimeChange}
                      className={cn(
                        "h-12 text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg",
                        errors.time && "border-red-500 dark:border-red-500"
                      )}
                    />
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="visit-duration"
                    className="mb-2 text-base font-medium flex items-center gap-2"
                  >
                    <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Visit Duration
                  </Label>
                  <Select
                    onValueChange={setVisitDuration}
                    defaultValue=""
                    value={visitDuration}
                  >
                    <SelectTrigger className="w-full h-12 text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="15 minutes" className="text-base">
                        15 minutes
                      </SelectItem>
                      <SelectItem value="30 minutes" className="text-base">
                        30 minutes
                      </SelectItem>
                      <SelectItem value="45 minutes" className="text-base">
                        45 minutes
                      </SelectItem>
                      <SelectItem value="1 hour" className="text-base">
                        1 hour
                      </SelectItem>
                      <SelectItem value="1.5 hours" className="text-base">
                        1.5 hours
                      </SelectItem>
                      <SelectItem value="2+ hours" className="text-base">
                        2+ hours
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="details"
              className="space-y-6 focus-visible:outline-none focus-visible:ring-0 px-6"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label
                    htmlFor="visit-notes"
                    className="text-base font-medium flex items-center gap-2"
                  >
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Clinical Notes
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={generateNotes}
                          disabled={isGeneratingNotes}
                          className="flex items-center gap-2 h-10 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
                        >
                          {isGeneratingNotes ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              <span>Generate with AI</span>
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Generate clinical notes using AI based on symptoms and
                          observations
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  id="visit-notes"
                  placeholder="Enter detailed visit notes, observations, and findings..."
                  value={newVisit.notes}
                  onChange={handleNotesChange}
                  className="min-h-[150px] text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="symptoms"
                    className="mb-2 text-base font-medium flex items-center gap-2"
                  >
                    <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Symptoms
                  </Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Patient reported symptoms"
                    value={symptoms}
                    onChange={(e) => {
                      setSymptoms(e.target.value);
                      setNewVisit({
                        ...newVisit,
                        sectionData: {
                          ...newVisit.sectionData,
                          symptoms: e.target.value,
                        },
                      });
                    }}
                    className="min-h-[100px] text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="observations"
                    className="mb-2 text-base font-medium flex items-center gap-2"
                  >
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Observations
                  </Label>
                  <Textarea
                    id="observations"
                    placeholder="Clinical observations"
                    value={observations}
                    onChange={(e) => {
                      setObservations(e.target.value);
                      setNewVisit({
                        ...newVisit,
                        sectionData: {
                          ...newVisit.sectionData,
                          observations: e.target.value,
                        },
                      });
                    }}
                    className="min-h-[100px] text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="diagnosis"
                    className="mb-2 text-base font-medium flex items-center gap-2"
                  >
                    <Stethoscope className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Diagnosis
                  </Label>
                  <Input
                    id="diagnosis"
                    placeholder="Primary diagnosis"
                    value={newVisit.sectionData.diagnosis || ""}
                    onChange={(e) =>
                      setNewVisit({
                        ...newVisit,
                        sectionData: {
                          ...newVisit.sectionData,
                          diagnosis: e.target.value,
                        },
                      })
                    }
                    className="h-12 text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="treatment"
                    className="mb-2 text-base font-medium flex items-center gap-2"
                  >
                    <Pill className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Treatment Plan
                  </Label>
                  <Input
                    id="treatment"
                    placeholder="Treatment provided"
                    value={newVisit.sectionData.treatment || ""}
                    onChange={(e) =>
                      setNewVisit({
                        ...newVisit,
                        sectionData: {
                          ...newVisit.sectionData,
                          treatment: e.target.value,
                        },
                      })
                    }
                    className="h-12 text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="medications"
                    className="mb-2 text-base font-medium flex items-center gap-2"
                  >
                    <Pill className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Medications
                  </Label>
                  <Input
                    id="medications"
                    placeholder="Prescribed medications"
                    value={newVisit.sectionData.medications || ""}
                    onChange={(e) =>
                      setNewVisit({
                        ...newVisit,
                        sectionData: {
                          ...newVisit.sectionData,
                          medications: e.target.value,
                        },
                      })
                    }
                    className="h-12 text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="vitals"
                    className="mb-2 text-base font-medium flex items-center gap-2"
                  >
                    <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Vital Signs
                  </Label>
                  <Input
                    id="vitals"
                    placeholder="BP, HR, Temp, etc."
                    value={newVisit.sectionData.vitals || ""}
                    onChange={(e) =>
                      setNewVisit({
                        ...newVisit,
                        sectionData: {
                          ...newVisit.sectionData,
                          vitals: e.target.value,
                        },
                      })
                    }
                    className="h-12 text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="followup"
              className="space-y-6 focus-visible:outline-none focus-visible:ring-0 px-6"
            >
              <div className="flex items-center gap-x-3 mb-6 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg">
                <Checkbox
                  id="follow-up"
                  checked={followUpNeeded}
                  onCheckedChange={(checked: boolean) => {
                    setFollowUpNeeded(checked);
                    if (!checked) {
                      // Create new object without followUpDate
                      const { followUpDate, ...rest } = newVisit.sectionData;
                      setNewVisit({
                        ...newVisit,
                        sectionData: rest,
                      });
                    } else {
                      // Set follow-up date to visit date + 7 days
                      const followUpDate = new Date(
                        newVisit.date || new Date()
                      );
                      followUpDate.setDate(followUpDate.getDate() + 7);
                      setNewVisit({
                        ...newVisit,
                        sectionData: {
                          ...newVisit.sectionData,
                          followUpDate,
                        },
                      });
                    }
                  }}
                  className="h-5 w-5 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 rounded"
                />
                <Label
                  htmlFor="follow-up"
                  className="text-lg font-medium flex items-center gap-2"
                >
                  <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Schedule follow-up visit
                </Label>
              </div>

              {followUpNeeded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Label
                      htmlFor="followup-date"
                      className="mb-2 text-base font-medium flex items-center gap-2"
                    >
                      <CalendarCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Follow-up Date
                      <span className="text-red-500 mx-1">*</span>
                    </Label>
                    <Input
                      id="followup-date"
                      type="date"
                      value={
                        newVisit.sectionData.followUpDate
                          ? formatDateForInput(
                              newVisit.sectionData.followUpDate
                            )
                          : ""
                      }
                      onChange={handleFollowUpDateChange}
                      className={cn(
                        "h-12 text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg",
                        errors.followUpDate &&
                          "border-red-500 dark:border-red-500"
                      )}
                      min={formatDateForInput(new Date())}
                    />
                    {errors.followUpDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.followUpDate}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <Label
                      htmlFor="followup-time"
                      className="mb-2 text-base font-medium flex items-center gap-2"
                    >
                      <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Follow-up Time
                      <span className="text-red-500 mx-1">*</span>
                    </Label>
                    <Input
                      id="followup-time"
                      type="time"
                      value={followUpTime}
                      onChange={handleFollowUpTimeChange}
                      className={cn(
                        "h-12 text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg",
                        errors.followUpTime &&
                          "border-red-500 dark:border-red-500"
                      )}
                    />
                    {errors.followUpTime && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.followUpTime}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <Label
                  htmlFor="follow-up-notes"
                  className="mb-2 text-base font-medium flex items-center gap-2"
                >
                  <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Follow-up Instructions
                </Label>
                <Textarea
                  id="follow-up-notes"
                  placeholder="Instructions for the patient's follow-up care..."
                  value={newVisit.sectionData.followUpNotes || ""}
                  onChange={(e) =>
                    setNewVisit({
                      ...newVisit,
                      sectionData: {
                        ...newVisit.sectionData,
                        followUpNotes: e.target.value,
                      },
                    })
                  }
                  className="min-h-[150px] text-base border-indigo-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Fixed footer with gradient divider and navigation buttons */}
        <DialogFooter className="mt-8 px-6 py-4 border-t border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 dark:bg-slate-800/50">
          <Button
            variant="ghost"
            onClick={handlePreviousTab}
            className="h-12 px-6 text-base text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg flex items-center gap-2 w-full sm:w-auto"
          >
            <ChevronLeft className="h-5 w-5" />
            {activeTab === "basic" ? "Cancel" : "Back"}
          </Button>

          <div className="flex gap-3 w-full sm:w-auto">
            {activeTab !== "followup" ? (
              <Button
                onClick={handleNextTab}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white h-12 px-6 text-base rounded-lg flex items-center gap-2 w-full sm:w-auto"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isAddingVisit}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white h-12 px-6 text-base rounded-lg flex items-center gap-2 w-full sm:w-auto"
              >
                {isAddingVisit ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Adding Visit...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" /> Save Visit
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

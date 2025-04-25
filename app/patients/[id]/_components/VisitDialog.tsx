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
import { format } from "date-fns";
import {
  CalendarCheck,
  ClipboardList,
  Clock,
  FileText,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { VisitDialogProps } from "./types";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("basic");
  const [visitDuration, setVisitDuration] = useState("");
  const [followUpNeeded, setFollowUpNeeded] = useState(false);

  // Common visit types based on general practice
  const visitTypes = [
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
    }
  }, [isVisitDialogOpen]);

  // Add follow-up date and duration to visit data
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newVisit.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!newVisit.date) {
      newErrors.date = "Date is required";
    }

    if (followUpNeeded && !newVisit.sectionData.followUpDate) {
      newErrors.followUpDate = "Follow-up date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
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

  const formatDateString = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  return (
    <Dialog open={isVisitDialogOpen} onOpenChange={setIsVisitDialogOpen}>
      <DialogContent className="sm:max-w-[700px] lg:max-w-[800px] max-h-[90vh] min-h-[600px] overflow-y-auto p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl text-green-800 dark:text-green-300 flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            Add New Visit
          </DialogTitle>
          <DialogDescription className="text-base">
            Record a new visit for{" "}
            {patient?.sectionData?.personalinfo?.full_name || "this patient"}.
            Include all relevant details.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="basic"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 mb-6 w-full">
            <TabsTrigger
              value="basic"
              className="flex items-center gap-1 text-sm "
            >
              <FileText className="h-4 w-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="flex items-center gap-1 text-sm "
            >
              <ClipboardList className="h-4 w-4" />
              <span>Clinical Details</span>
            </TabsTrigger>
            <TabsTrigger
              value="followup"
              className="flex items-center gap-1 text-sm "
            >
              <Clock className="h-4 w-4" />
              <span>Follow-up</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-2">
            <div className="grid gap-6">
              <div>
                <Label htmlFor="visit-type" className="mb-2 block text-base">
                  Visit Type
                </Label>
                <Select
                  onValueChange={handleVisitTypeSelect}
                  defaultValue=""
                  value={newVisit.sectionData.visitType || ""}
                >
                  <SelectTrigger className="w-full h-10 text-base">
                    <SelectValue placeholder="Select visit type" />
                  </SelectTrigger>
                  <SelectContent>
                    {visitTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-base">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Label htmlFor="visit-title" className="mb-2 block text-base">
                  Title
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="visit-title"
                  placeholder="Visit title"
                  value={newVisit.title}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, title: e.target.value })
                  }
                  className={cn(
                    "h-10 text-base",
                    errors.title && "border-red-500"
                  )}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="visit-date" className="mb-2 block text-base">
                  Visit Date
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="visit-date"
                  type="date"
                  value={newVisit.date ? formatDateString(newVisit.date) : ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      setNewVisit({
                        ...newVisit,
                        date: new Date(e.target.value),
                      });
                    }
                  }}
                  className={cn(
                    "h-10 text-base",
                    errors.date && "border-red-500"
                  )}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="visit-duration"
                  className="mb-2 block text-base"
                >
                  Visit Duration
                </Label>
                <Select
                  onValueChange={setVisitDuration}
                  defaultValue=""
                  value={visitDuration}
                >
                  <SelectTrigger className="w-full h-10 text-base">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
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

          <TabsContent value="details" className="space-y-6 mt-2">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="visit-notes" className="block text-base">
                  Clinical Notes
                </Label>
                {handleGenerateVisitNotes && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const symptoms =
                              newVisit.sectionData.symptoms || "";
                            const observations =
                              newVisit.sectionData.observations || "";
                            handleGenerateVisitNotes(symptoms, observations);
                          }}
                          disabled={isGeneratingNotes}
                          className="flex items-center gap-1 h-8"
                        >
                          <Sparkles className="h-4 w-4" />
                          {isGeneratingNotes
                            ? "Generating..."
                            : "Generate with AI"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Generate clinical notes using AI</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Textarea
                id="visit-notes"
                placeholder="Enter detailed visit notes, observations, and findings..."
                value={newVisit.notes}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, notes: e.target.value })
                }
                className="min-h-[180px] text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="symptoms" className="mb-2 block text-base">
                  Symptoms
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Patient reported symptoms"
                  value={newVisit.sectionData.symptoms || ""}
                  onChange={(e) =>
                    setNewVisit({
                      ...newVisit,
                      sectionData: {
                        ...newVisit.sectionData,
                        symptoms: e.target.value,
                      },
                    })
                  }
                  className="min-h-[100px] text-base"
                />
              </div>
              <div>
                <Label htmlFor="observations" className="mb-2 block text-base">
                  Observations
                </Label>
                <Textarea
                  id="observations"
                  placeholder="Clinical observations"
                  value={newVisit.sectionData.observations || ""}
                  onChange={(e) =>
                    setNewVisit({
                      ...newVisit,
                      sectionData: {
                        ...newVisit.sectionData,
                        observations: e.target.value,
                      },
                    })
                  }
                  className="min-h-[100px] text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="diagnosis" className="mb-2 block text-base">
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
                  className="h-10 text-base"
                />
              </div>
              <div>
                <Label htmlFor="treatment" className="mb-2 block text-base">
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
                  className="h-10 text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="medications" className="mb-2 block text-base">
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
                  className="h-10 text-base"
                />
              </div>
              <div>
                <Label htmlFor="vitals" className="mb-2 block text-base">
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
                  className="h-10 text-base"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="followup" className="space-y-6 mt-2">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="follow-up"
                checked={followUpNeeded}
                onCheckedChange={(checked) => {
                  setFollowUpNeeded(checked as boolean);
                  if (!checked) {
                    // Remove follow-up date from visit data
                    const { followUpDate, ...rest } = newVisit.sectionData;
                    setNewVisit({
                      ...newVisit,
                      sectionData: rest,
                    });
                  }
                }}
                className="h-5 w-5"
              />
              <Label htmlFor="follow-up" className="text-base">
                Schedule follow-up visit
              </Label>
            </div>

            {followUpNeeded && (
              <div className="relative">
                <Label htmlFor="followup-date" className="mb-2 block text-base">
                  Follow-up Date
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="followup-date"
                  type="date"
                  value={
                    newVisit.sectionData.followUpDate
                      ? formatDateString(
                          new Date(newVisit.sectionData.followUpDate)
                        )
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      setNewVisit({
                        ...newVisit,
                        sectionData: {
                          ...newVisit.sectionData,
                          followUpDate: new Date(e.target.value),
                        },
                      });
                    }
                  }}
                  className={cn(
                    "h-10 text-base",
                    errors.followUpDate && "border-red-500"
                  )}
                  min={formatDateString(new Date())}
                />
                {errors.followUpDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.followUpDate}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="follow-up-notes" className="mb-2 block text-base">
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
                className="min-h-[150px] text-base"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between pt-6 gap-4 mt-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                if (activeTab === "basic") {
                  setIsVisitDialogOpen(false);
                } else if (activeTab === "details") {
                  setActiveTab("basic");
                } else if (activeTab === "followup") {
                  setActiveTab("details");
                }
              }}
              type="button"
              className="h-10 px-4 text-base"
            >
              {activeTab === "basic" ? "Cancel" : "Back"}
            </Button>
          </div>

          <div className="flex gap-2">
            {activeTab !== "followup" && (
              <Button
                variant="outline"
                onClick={() => {
                  if (activeTab === "basic") {
                    setActiveTab("details");
                  } else if (activeTab === "details") {
                    setActiveTab("followup");
                  }
                }}
                type="button"
                className="bg-white dark:bg-slate-900 h-10 px-4 text-base"
              >
                Next
              </Button>
            )}

            {activeTab === "followup" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={handleSubmit}
                        disabled={isAddingVisit}
                        className="bg-green-600 hover:bg-green-700 text-white h-10 px-6 text-base"
                      >
                        {isAddingVisit ? "Adding..." : "Save Visit"}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save this visit record</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

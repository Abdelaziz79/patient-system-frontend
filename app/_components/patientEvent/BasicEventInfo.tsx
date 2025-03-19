"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState } from "react";
import DatePicker from "../DatePicker";
import TimePicker from "../TimePicker";

type Events =
  | "status_update"
  | "medication_change"
  | "lab_result"
  | "vital_signs"
  | "imaging_result"
  | "consultation"
  | "procedure"
  | "other";

type Actions =
  | "no_action"
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

type Priorities = "low" | "medium" | "high";

type EventField = {
  title: string;
  description: string;
  action: Actions;
  date: Date | undefined;
  time: Date | undefined;
  priority: Priorities;
};

// Event type definitions
const EVENT_TYPES = {
  status_update: {
    id: "status_update",
    label: "Status Update",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    icon: "📝",
    titlePlaceholder: "Enter status update title",
    descriptionPlaceholder: "Detail the current status and any changes",
    actionPlaceholder: "Select action for status update",
  },
  medication_change: {
    id: "medication_change",
    label: "Medication Change",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    icon: "💊",
    titlePlaceholder: "Enter medication name and change",
    descriptionPlaceholder: "Detail dosage, frequency, reason for change, etc.",
    actionPlaceholder: "Select action for medication change",
  },
  lab_result: {
    id: "lab_result",
    label: "Lab Result",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    icon: "🧪",
    titlePlaceholder: "Enter lab test name",
    descriptionPlaceholder:
      "Detail the results, normal ranges, and any follow-up needed",
    actionPlaceholder: "Select action for lab result",
  },
  vital_signs: {
    id: "vital_signs",
    label: "Vital Signs",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    icon: "📊",
    titlePlaceholder: "Enter vital signs summary",
    descriptionPlaceholder: "Detail BP, HR, RR, temperature, O2 sat, etc.",
    actionPlaceholder: "Select action for vital signs",
  },
  imaging_result: {
    id: "imaging_result",
    label: "Imaging Result",
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    icon: "🔍",
    titlePlaceholder: "Enter imaging study name",
    descriptionPlaceholder:
      "Detail the findings, impression, and recommended follow-up",
    actionPlaceholder: "Select action for imaging result",
  },
  consultation: {
    id: "consultation",
    label: "Consultation",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    icon: "👨‍⚕️",
    titlePlaceholder: "Enter consultant name and specialty",
    descriptionPlaceholder:
      "Detail the consultation reason, findings, and recommendations",
    actionPlaceholder: "Select action for consultation",
  },
  procedure: {
    id: "procedure",
    label: "Procedure",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
    icon: "🔧",
    titlePlaceholder: "Enter procedure name",
    descriptionPlaceholder:
      "Detail the procedure, findings, and post-procedure instructions",
    actionPlaceholder: "Select action for procedure",
  },
  other: {
    id: "other",
    label: "Other",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    icon: "📋",
    titlePlaceholder: "Enter event title",
    descriptionPlaceholder: "Describe the event details",
    actionPlaceholder: "Select action for this event",
  },
};

// Action states for events

const ACTION_STATES = {
  pending: {
    id: "pending",
    label: "Pending",
    color: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
    },
    icon: "⏳",
  },
  in_progress: {
    id: "in_progress",
    label: "In Progress",
    color: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800",
    },
    icon: "🔄",
  },
  completed: {
    id: "completed",
    label: "Completed",
    color: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
    },
    icon: "✅",
  },
  cancelled: {
    id: "cancelled",
    label: "Cancelled",
    color: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
    },
    icon: "❌",
  },
  no_action: {
    id: "no_action",
    label: "No Action Required",
    color: {
      bg: "bg-gray-100 dark:bg-gray-900/30",
      text: "text-gray-700 dark:text-gray-300",
      border: "border-gray-200 dark:border-gray-800",
    },
    icon: "⚪",
  },
};

// Priority definitions
const PRIORITIES = {
  low: {
    id: "low",
    label: "Low",
    color: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
    },
    icon: "🟢",
  },
  medium: {
    id: "medium",
    label: "Medium",
    color: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800",
    },
    icon: "🟡",
  },
  high: {
    id: "high",
    label: "High",
    color: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
    },
    icon: "🔴",
  },
};

// Get a default date for initialization
const defaultDate = new Date();

function EventForm() {
  // State for selected event type
  const [selectedEventType, setSelectedEventType] =
    useState<Events>("status_update");

  // Initialize event fields with default values
  const [eventFields, setEventFields] = useState<Record<Events, EventField>>({
    status_update: {
      title: "",
      description: "",
      action: "no_action",
      date: defaultDate,
      time: defaultDate,
      priority: "medium",
    },
    medication_change: {
      title: "",
      description: "",
      action: "no_action",
      date: defaultDate,
      time: defaultDate,
      priority: "medium",
    },
    lab_result: {
      title: "",
      description: "",
      action: "no_action",
      date: defaultDate,
      time: defaultDate,
      priority: "medium",
    },
    vital_signs: {
      title: "",
      description: "",
      action: "no_action",
      date: defaultDate,
      time: defaultDate,
      priority: "medium",
    },
    imaging_result: {
      title: "",
      description: "",
      action: "no_action",
      date: defaultDate,
      time: defaultDate,
      priority: "medium",
    },
    consultation: {
      title: "",
      description: "",
      action: "no_action",
      date: defaultDate,
      time: defaultDate,
      priority: "medium",
    },
    procedure: {
      title: "",
      description: "",
      action: "no_action",
      date: defaultDate,
      time: defaultDate,
      priority: "medium",
    },
    other: {
      title: "",
      description: "",
      action: "no_action",
      date: defaultDate,
      time: defaultDate,
      priority: "medium",
    },
  });

  // Handler for changing event fields
  // Optimized handlers with useCallback
  const handleEventFieldChange = useCallback(
    (
      type: Events,
      field: keyof EventField,
      value: string | Date | undefined
    ) => {
      setEventFields((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [field]: value,
        },
      }));
    },
    []
  );

  // Handler for changing event type
  const handleEventTypeChange = useCallback((type: string) => {
    setSelectedEventType(type as Events);
  }, []);

  // Handler for date change
  const handleDateChange = useCallback(
    (date: Date | undefined) => {
      if (date) {
        handleEventFieldChange(selectedEventType, "date", date);
      }
    },
    [selectedEventType, handleEventFieldChange]
  );

  // Handler for time change
  const handleTimeChange = useCallback(
    (time: Date | undefined) => {
      if (time) {
        handleEventFieldChange(selectedEventType, "time", time);
      }
    },
    [selectedEventType, handleEventFieldChange]
  );

  // Get current field values for the selected event type
  const currentFields = eventFields[selectedEventType];

  return (
    <Card className="border border-gray-200 rounded-xl dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-600 px-6 py-4">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Create New Event
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Event Type Selection */}
        <div className="mb-6">
          <Label className="font-medium text-gray-900 dark:text-gray-100 block mb-3">
            Event Type
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.values(EVENT_TYPES).map((type) => (
              <Button
                key={type.id}
                type="button"
                onClick={() => handleEventTypeChange(type.id)}
                className={`h-auto py-2 px-3 justify-start overflow-hidden ${
                  selectedEventType === type.id
                    ? "ring-2 ring-blue-500 dark:ring-blue-400"
                    : "bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300"
                }`}
                variant={selectedEventType === type.id ? "default" : "outline"}
              >
                <span className="mr-2">{type.icon}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            {/* Title field - specific to the event type */}
            <div>
              <Label
                htmlFor={`${selectedEventType}Title`}
                className="font-medium text-gray-900 dark:text-gray-100 block mb-1.5"
              >
                {EVENT_TYPES[selectedEventType].label} Title
              </Label>
              <Input
                id={`${selectedEventType}Title`}
                value={currentFields.title}
                onChange={(e) =>
                  handleEventFieldChange(
                    selectedEventType,
                    "title",
                    e.target.value
                  )
                }
                placeholder={EVENT_TYPES[selectedEventType].titlePlaceholder}
                className="border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                required
              />
            </div>

            {/* Description field - specific to the event type */}
            <div>
              <Label
                htmlFor={`${selectedEventType}Description`}
                className="font-medium text-gray-900 dark:text-gray-100 block mb-1.5"
              >
                {EVENT_TYPES[selectedEventType].label} Description
              </Label>
              <Textarea
                id={`${selectedEventType}Description`}
                value={currentFields.description}
                onChange={(e) =>
                  handleEventFieldChange(
                    selectedEventType,
                    "description",
                    e.target.value
                  )
                }
                placeholder={
                  EVENT_TYPES[selectedEventType].descriptionPlaceholder
                }
                className="min-h-[120px] border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-700 resize-vertical"
                required
              />
            </div>
          </div>

          <div className="space-y-5">
            {/* Date & Time - specific to the event type */}
            <div>
              <Label
                htmlFor={`${selectedEventType}Date`}
                className="font-medium text-gray-900 dark:text-gray-100 block mb-1.5"
              >
                {EVENT_TYPES[selectedEventType].label} Date & Time
              </Label>
              <div className="flex flex-wrap gap-2">
                <div className="flex-grow">
                  <DatePicker
                    date={currentFields.date}
                    setDate={handleDateChange}
                  />
                </div>
                <div className="flex-grow">
                  <TimePicker
                    time={currentFields.time}
                    setTime={handleTimeChange}
                  />
                </div>
              </div>
            </div>

            {/* Action Status - specific to the event type */}
            <div>
              <Label
                htmlFor={`${selectedEventType}Action`}
                className="font-medium text-gray-900 dark:text-gray-100 block mb-1.5"
              >
                {EVENT_TYPES[selectedEventType].label} Action Status
              </Label>
              <select
                id={`${selectedEventType}Action`}
                value={currentFields.action}
                onChange={(e) =>
                  handleEventFieldChange(
                    selectedEventType,
                    "action",
                    e.target.value as Actions
                  )
                }
                className="w-full py-2 rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 shadow-sm"
              >
                {Object.values(ACTION_STATES).map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.icon} {state.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Selection - specific to the event type */}
            <div>
              <div>
                <Label
                  htmlFor={`${selectedEventType}Priority`}
                  className="font-medium text-gray-900 dark:text-gray-100 block mb-1.5"
                >
                  {EVENT_TYPES[selectedEventType].label} Priority
                </Label>

                {/* Replace the RadioGroup with standard buttons */}
                <div className="flex flex-wrap gap-2">
                  {Object.values(PRIORITIES).map((priority) => (
                    <button
                      key={priority.id}
                      type="button"
                      onClick={() =>
                        handleEventFieldChange(
                          selectedEventType,
                          "priority",
                          priority.id as Priorities
                        )
                      }
                      className={`p-2 rounded-md border flex items-center space-x-2 ${
                        priority.color.bg
                      } ${priority.color.border} ${priority.color.text} ${
                        currentFields.priority === priority.id
                          ? "ring-2 ring-blue-500 dark:ring-blue-400"
                          : ""
                      }`}
                    >
                      <span>{priority.icon}</span>
                      <span className="font-medium">{priority.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Summary Card */}
        <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <Badge className={EVENT_TYPES[selectedEventType].color + " mr-2"}>
                {EVENT_TYPES[selectedEventType].icon}{" "}
                {EVENT_TYPES[selectedEventType].label}
              </Badge>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {currentFields.title}
              </span>
            </h3>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                className={`${PRIORITIES[currentFields.priority].color.bg} ${
                  PRIORITIES[currentFields.priority].color.text
                }`}
              >
                {PRIORITIES[currentFields.priority].icon}{" "}
                {PRIORITIES[currentFields.priority].label} Priority
              </Badge>
              <Badge
                className={`${ACTION_STATES[currentFields.action].color.bg} ${
                  ACTION_STATES[currentFields.action].color.text
                }`}
              >
                {ACTION_STATES[currentFields.action].icon}{" "}
                {ACTION_STATES[currentFields.action].label}
              </Badge>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {currentFields.date && currentFields.time && (
                <p>
                  Date & Time: {currentFields.date.toLocaleDateString()} at{" "}
                  {currentFields.time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
              <p className="mt-2">{currentFields.description}</p>
            </div>
            {/* 
            <div className="mt-4 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Event
              </Button>
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EventForm;

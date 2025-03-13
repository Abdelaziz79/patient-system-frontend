"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import DatePicker from "../DatePicker";
import TimePicker from "../TimePicker";

type Priority = "low" | "medium" | "high";
type EventType =
  | "status_update"
  | "medication_change"
  | "lab_result"
  | "vital_signs"
  | "imaging_result"
  | "consultation"
  | "procedure"
  | "other";

function BasicEventInfo() {
  const [eventType, setEventType] = useState<EventType>("status_update");

  // General event fields
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date());
  const [eventTime, setEventTime] = useState<Date | undefined>(new Date());
  const [eventPriority, setEventPriority] = useState("medium");

  // Get priority color based on selected priority
  const getPriorityColor = (priority: Priority) => {
    const colors = {
      low: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        border: "border-green-200 dark:border-green-800",
      },
      medium: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800",
      },
      high: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
        border: "border-red-200 dark:border-red-800",
      },
    };
    return colors[priority];
  };

  const eventTypeLabels = {
    status_update: {
      label: "Status Update",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    },
    medication_change: {
      label: "Medication Change",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    },
    lab_result: {
      label: "Lab Result",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    },
    vital_signs: {
      label: "Vital Signs",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    },
    imaging_result: {
      label: "Imaging Result",
      color:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    },
    consultation: {
      label: "Consultation",
      color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    },
    procedure: {
      label: "Procedure",
      color: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
    },
    other: {
      label: "Other",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
  };

  // const priorityColor = getPriorityColor(eventPriority);

  return (
    <Card className="border border-gray-200 rounded-xl dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <Label
                htmlFor="eventTitle"
                className="font-medium text-gray-900 dark:text-gray-100 block mb-1.5"
              >
                Event Title
              </Label>
              <Input
                id="eventTitle"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter a descriptive title for this event"
                className="border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                required
              />
            </div>

            <div className="">
              <Label
                htmlFor="eventDate"
                className="font-medium text-gray-900 dark:text-gray-100 block mb-1"
              >
                Date & Time
              </Label>
              <div className="flex space-x-2">
                <div className="">
                  <DatePicker date={eventDate} setDate={setEventDate} />
                </div>
                <div className="">
                  <TimePicker time={eventTime} setTime={setEventTime} />
                </div>
              </div>
            </div>

            <div>
              <Label
                htmlFor="eventType"
                className="font-medium text-gray-900 dark:text-gray-100 block mb-1.5"
              >
                Event Type
              </Label>
              <Select
                value={eventType}
                onValueChange={(value: EventType) => setEventType(value)}
              >
                <SelectTrigger className="border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-700">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-700 border dark:border-gray-700">
                  {Object.entries(eventTypeLabels).map(([value, { label }]) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="focus:bg-gray-100 dark:focus:bg-gray-800"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {eventType && (
                <div className="mt-2">
                  <Badge
                    className={`font-normal ${eventTypeLabels[eventType].color}`}
                  >
                    {eventTypeLabels[eventType].label}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <Label
                htmlFor="eventDescription"
                className="font-medium text-gray-900 dark:text-gray-100 block mb-1.5"
              >
                Description
              </Label>
              <Textarea
                id="eventDescription"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Brief description of this event"
                className="min-h-[120px] border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-700 resize-vertical"
                required
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="eventPriority"
                  className="font-medium text-gray-900 dark:text-gray-100 block mb-2"
                >
                  Priority
                </Label>
                <RadioGroup
                  id="eventPriority"
                  className="flex space-x-4"
                  value={eventPriority}
                  onValueChange={setEventPriority}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-md ${
                        getPriorityColor("low").bg
                      } ${
                        getPriorityColor("low").border
                      } border flex items-center space-x-2`}
                    >
                      <RadioGroupItem
                        value="low"
                        id="low"
                        className="text-green-600 dark:text-green-400"
                      />
                      <Label
                        htmlFor="low"
                        className={`${
                          getPriorityColor("low").text
                        } font-medium cursor-pointer`}
                      >
                        Low
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-md ${
                        getPriorityColor("medium").bg
                      } ${
                        getPriorityColor("medium").border
                      } border flex items-center space-x-2`}
                    >
                      <RadioGroupItem
                        value="medium"
                        id="medium"
                        className="text-amber-600 dark:text-amber-400"
                      />
                      <Label
                        htmlFor="medium"
                        className={`${
                          getPriorityColor("medium").text
                        } font-medium cursor-pointer`}
                      >
                        Medium
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-md ${
                        getPriorityColor("high").bg
                      } ${
                        getPriorityColor("high").border
                      } border flex items-center space-x-2`}
                    >
                      <RadioGroupItem
                        value="high"
                        id="high"
                        className="text-red-600 dark:text-red-400"
                      />
                      <Label
                        htmlFor="high"
                        className={`${
                          getPriorityColor("high").text
                        } font-medium cursor-pointer`}
                      >
                        High
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BasicEventInfo;

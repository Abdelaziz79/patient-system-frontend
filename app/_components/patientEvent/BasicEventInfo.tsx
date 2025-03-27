"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

type Priorities = "low" | "medium" | "high";

type EventField = {
  id: string;
  title: string;
  description: string;
  action: string;
  reminderDate: string;
  reminderTime: string;
  priority: Priorities;
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

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get current date and time in input format
const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString().split(" ")[0].substring(0, 5);
};

// Format date for display
const formatDate = (dateStr: string, timeStr: string) => {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T${timeStr || "00:00"}`);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Create default event
const createDefaultEvent = (): EventField => ({
  id: generateId(),
  title: "",
  description: "",
  action: "",
  reminderDate: getCurrentDate(),
  reminderTime: getCurrentTime(),
  priority: "medium",
});

function EventForm() {
  // State for list of events
  const [events, setEvents] = useState<EventField[]>([createDefaultEvent()]);

  // Separate collection for completed/saved events
  const [eventHistory, setEventHistory] = useState<EventField[]>([
    {
      id: generateId(),
      title: "bbd",
      description: "xsa",
      action: "gwd",
      reminderDate: getCurrentDate(),
      reminderTime: getCurrentTime(),
      priority: "medium",
    },
    {
      id: generateId(),
      title: "dsadca",
      description:
        "sadasdsasad da sjd saknj dnj najd naojdn kaldnmo andia hjndos akjmdkl anldkj anlkdj nalkdj na",
      action: "dsada ",
      reminderDate: getCurrentDate(),
      reminderTime: getCurrentTime(),
      priority: "medium",
    },
  ]);

  // State for currently editing event
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  // Initialize with default event
  useEffect(() => {
    // Set the first event as current when component mounts
    if (events.length > 0 && !currentEventId) {
      setCurrentEventId(events[0].id);
    }
  }, []);

  // Get current event being edited
  const currentEvent =
    events.find((event) => event.id === currentEventId) || events[0];

  // Handler for changing event fields
  const handleEventFieldChange = (
    field: keyof EventField,
    value: string | Priorities
  ) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === currentEventId ? { ...event, [field]: value } : event
      )
    );
  };

  // Add a new event
  const addNewEvent = () => {
    const newEvent = createDefaultEvent();
    setEvents((prev) => [...prev, newEvent]);
    setCurrentEventId(newEvent.id);
  };

  // Save current event
  const saveEvent = () => {
    // Validate that the event has at least a title
    if (!currentEvent.title.trim()) {
      // Could show an error message here
      return;
    }

    // Add current event to history
    setEventHistory((prev) => [...prev, { ...currentEvent }]);

    // If we're editing a non-existing event, add it
    if (!events.some((e) => e.id === currentEventId)) {
      const newEvent = {
        ...currentEvent,
        id: currentEventId || generateId(),
      };
      setEvents((prev) => [...prev, newEvent]);
    }

    // Reset to create a new event
    const newEvent = createDefaultEvent();
    setEvents((prev) => [...prev, newEvent]);
    setCurrentEventId(newEvent.id);
  };

  // Delete an event
  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));

    // If we're deleting the current event, select another one
    if (currentEventId === id) {
      if (events.length > 1) {
        const remainingEvents = events.filter((event) => event.id !== id);
        setCurrentEventId(remainingEvents[0].id);
      } else {
        // If no events left, create a new default one
        const newEvent = createDefaultEvent();
        setEvents([newEvent]);
        setCurrentEventId(newEvent.id);
      }
    }
  };

  // Delete from history
  const deleteFromHistory = (id: string) => {
    setEventHistory((prev) => prev.filter((event) => event.id !== id));
  };

  // Select an event to edit
  const selectEvent = (id: string) => {
    setCurrentEventId(id);
  };

  // Edit event from history
  const editFromHistory = (event: EventField) => {
    // Remove from history
    setEventHistory((prev) => prev.filter((e) => e.id !== event.id));

    // Add to current events and set as current
    setEvents((prev) => [...prev, event]);
    setCurrentEventId(event.id);
  };

  // Truncate text for table display
  const truncateText = (text: string, maxLength: number = 40) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <TabsContent value="events" className="space-y-6 mt-4">
      <Card className="border border-gray-200 rounded-xl dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md overflow-hidden transition-colors duration-200">
        <CardHeader className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Events
            </CardTitle>
            <Button
              onClick={addNewEvent}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-sm transition-all duration-200"
            >
              Add New Event
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {events.length > 0 && (
            <div className="mb-6">
              <Label className="font-medium text-gray-900 dark:text-gray-50 block mb-2">
                Event List
              </Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {events.map((event) => (
                  <Badge
                    key={event.id}
                    className={`cursor-pointer px-3 py-1.5 rounded-full transition-colors duration-200 ${
                      event.id === currentEventId
                        ? "bg-blue-500 text-white dark:bg-blue-600 shadow-sm"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => selectEvent(event.id)}
                  >
                    {event.title || "Untitled Event"}
                    {event.id !== currentEventId && (
                      <button
                        className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 opacity-70 hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEvent(event.id);
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              {/* Title field */}
              <div>
                <Label
                  htmlFor="eventTitle"
                  className="font-medium text-gray-900 dark:text-gray-50 block mb-1.5"
                >
                  Title
                </Label>
                <Input
                  id="eventTitle"
                  value={currentEvent?.title || ""}
                  onChange={(e) =>
                    handleEventFieldChange("title", e.target.value)
                  }
                  placeholder="Enter event title"
                  className="border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-colors duration-200"
                  required
                />
              </div>

              {/* Description field */}
              <div>
                <Label
                  htmlFor="eventDescription"
                  className="font-medium text-gray-900 dark:text-gray-50 block mb-1.5"
                >
                  Description
                </Label>
                <Textarea
                  id="eventDescription"
                  value={currentEvent?.description || ""}
                  onChange={(e) =>
                    handleEventFieldChange("description", e.target.value)
                  }
                  placeholder="Describe the event details"
                  className="min-h-[120px] border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 resize-vertical transition-colors duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-5">
              {/* Reminder Date and Time */}
              <div>
                <Label
                  htmlFor="eventReminder"
                  className="font-medium text-gray-900 dark:text-gray-50 block mb-1.5"
                >
                  Reminder
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="eventReminderDate"
                    type="date"
                    value={currentEvent?.reminderDate || ""}
                    onChange={(e) =>
                      handleEventFieldChange("reminderDate", e.target.value)
                    }
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-colors duration-200"
                  />
                  <Input
                    id="eventReminderTime"
                    type="time"
                    value={currentEvent?.reminderTime || ""}
                    onChange={(e) =>
                      handleEventFieldChange("reminderTime", e.target.value)
                    }
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Action Taken */}
              <div>
                <Label
                  htmlFor="eventAction"
                  className="font-medium text-gray-900 dark:text-gray-50 block mb-1.5"
                >
                  Action Taken
                </Label>
                <Input
                  id="eventAction"
                  value={currentEvent?.action || ""}
                  onChange={(e) =>
                    handleEventFieldChange("action", e.target.value)
                  }
                  placeholder="Enter action taken"
                  className="border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-colors duration-200"
                />
              </div>

              {/* Priority Selection */}
              <div>
                <Label
                  htmlFor="eventPriority"
                  className="font-medium text-gray-900 dark:text-gray-50 block mb-1.5"
                >
                  Priority
                </Label>
                <div className="flex flex-wrap gap-3">
                  {Object.values(PRIORITIES).map((priority) => (
                    <button
                      key={priority.id}
                      type="button"
                      onClick={() =>
                        handleEventFieldChange(
                          "priority",
                          priority.id as Priorities
                        )
                      }
                      className={`p-2 rounded-md border flex items-center space-x-2 transition-all duration-200 hover:shadow-sm ${
                        priority.color.bg
                      } ${priority.color.border} ${priority.color.text} ${
                        currentEvent?.priority === priority.id
                          ? "ring-2 ring-blue-500 dark:ring-blue-400 shadow-sm"
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

          {/* Event Summary Card */}
          {currentEvent && currentEvent.title && (
            <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-5 border border-gray-200 dark:border-gray-600 shadow-sm transition-colors duration-200">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-3">
                  {currentEvent.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    className={`${PRIORITIES[currentEvent.priority].color.bg} ${
                      PRIORITIES[currentEvent.priority].color.text
                    } px-3 py-1.5 rounded-full`}
                  >
                    {PRIORITIES[currentEvent.priority].icon}{" "}
                    {PRIORITIES[currentEvent.priority].label} Priority
                  </Badge>
                  {currentEvent.action && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1.5 rounded-full">
                      Action: {currentEvent.action}
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {currentEvent.reminderDate && currentEvent.reminderTime && (
                    <p>
                      Reminder: {currentEvent.reminderDate} at{" "}
                      {currentEvent.reminderTime}
                    </p>
                  )}
                  <p className="mt-2">{currentEvent.description}</p>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <Button
                    onClick={() => deleteEvent(currentEvent.id)}
                    className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white shadow-sm transition-all duration-200"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={saveEvent}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-sm transition-all duration-200"
                  >
                    Save Event
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Event History Table */}
          {eventHistory.length > 0 && (
            <div className="mt-10 border-t pt-6 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4 flex items-center">
                <span className="mr-2">📋</span> Event History
              </h3>

              <div className="border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-slate-800 transition-colors duration-200">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-slate-700/50">
                    <TableRow className="border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="w-1/6 py-3 font-semibold text-gray-900 dark:text-gray-50">
                        Priority
                      </TableHead>
                      <TableHead className="w-1/4 py-3 font-semibold text-gray-900 dark:text-gray-50">
                        Title
                      </TableHead>
                      <TableHead className="hidden md:table-cell py-3 font-semibold text-gray-900 dark:text-gray-50">
                        Description
                      </TableHead>
                      <TableHead className="w-1/6 py-3 font-semibold text-gray-900 dark:text-gray-50">
                        Reminder
                      </TableHead>
                      <TableHead className="w-1/6 py-3 text-right font-semibold text-gray-900 dark:text-gray-50">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventHistory.map((event, index) => (
                      <TableRow
                        key={event.id}
                        className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors duration-150 ${
                          index % 2 === 0
                            ? "bg-gray-50/50 dark:bg-slate-800/50"
                            : ""
                        }`}
                      >
                        <TableCell className="py-3">
                          <Badge
                            className={`${
                              PRIORITIES[event.priority].color.bg
                            } ${
                              PRIORITIES[event.priority].color.text
                            } px-2.5 py-1 rounded-full`}
                          >
                            {PRIORITIES[event.priority].icon}{" "}
                            {PRIORITIES[event.priority].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100 py-3">
                          {event.title}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-gray-600 dark:text-gray-300 py-3">
                          {truncateText(event.description)}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300 py-3">
                          {formatDate(event.reminderDate, event.reminderTime)}
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => editFromHistory(event)}
                              className="h-8 w-16 px-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-xs rounded-full shadow-sm transition-all duration-200"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => deleteFromHistory(event.id)}
                              className="h-8 w-16 px-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white text-xs rounded-full shadow-sm transition-all duration-200"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary stat row */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>
                    Low Priority:{" "}
                    {eventHistory.filter((e) => e.priority === "low").length}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>
                    Medium Priority:{" "}
                    {eventHistory.filter((e) => e.priority === "medium").length}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>
                    High Priority:{" "}
                    {eventHistory.filter((e) => e.priority === "high").length}
                  </span>
                </div>
                <div className="flex-1 text-right">
                  <span>Total Events: {eventHistory.length}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default EventForm;

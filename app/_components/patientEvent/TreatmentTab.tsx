"use client";

import DatePicker from "@/app/_components/DatePicker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarIcon,
  ChevronUp,
  Pill,
  Plus,
  Save,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// Define types for treatment records
type TreatmentRecord = {
  id: string;
  date: Date;
  details: string;
};

type TreatmentCategoryType = {
  id: string;
  label: string;
  records: TreatmentRecord[];
  newRecord?: {
    date: Date;
    details: string;
  };
};

function TreatmentTab() {
  // Define treatment categories
  const [treatmentCategories, setTreatmentCategories] = useState<
    TreatmentCategoryType[]
  >([
    {
      id: "oxygenTherapy",
      label: "O2 Therapy",
      records: [
        {
          id: "oxygenTherapy-1",
          date: new Date(),
          details: "Oxygen therapy for 3 hours",
        },
      ],
      newRecord: { date: new Date(), details: "" },
    },
    {
      id: "infusions",
      label: "Infusions / Supports",
      records: [],
      newRecord: { date: new Date(), details: "" },
    },
    {
      id: "ivFluids",
      label: "IV Fluids & Electrolytes",
      records: [],
      newRecord: { date: new Date(), details: "" },
    },
    {
      id: "sedations",
      label: "Sedations",
      records: [],
      newRecord: { date: new Date(), details: "" },
    },
    {
      id: "antibiotics",
      label: "Antibiotics/Antimicrobials",
      records: [],
      newRecord: { date: new Date(), details: "" },
    },
    {
      id: "medications",
      label: "Medications",
      records: [],
      newRecord: { date: new Date(), details: "" },
    },
  ]);

  // Treatment plans section
  const [treatmentPlans, setTreatmentPlans] = useState([
    {
      id: "plan-1",
      planNumber: 1,
      plan: "",
      reminder: new Date(),
      isNew: true,
    },
  ]);

  // Notes section
  const [notes, setNotes] = useState({
    records: [] as TreatmentRecord[],
    newRecord: { date: new Date(), details: "" },
  });

  // State for filtering categories
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] =
    useState(treatmentCategories);

  // Filter categories when search term changes
  useEffect(() => {
    const filtered = treatmentCategories.filter((category) =>
      category.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, treatmentCategories]);

  // State for expanded accordion values
  const [expandedAccordion, setExpandedAccordion] = useState<
    string | undefined
  >(undefined);

  // State for showing scroll to top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Function to handle accordion change
  const handleAccordionChange = (value: string) => {
    setExpandedAccordion(value === expandedAccordion ? undefined : value);
  };

  // Function to update a category's new record
  const updateNewRecord = (
    categoryId: string,
    field: "date" | "details",
    value: Date | string
  ) => {
    setTreatmentCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            newRecord: {
              ...category.newRecord!,
              [field]: value,
            },
          };
        }
        return category;
      })
    );
  };

  // Function to update notes new record
  const updateNotesNewRecord = (
    field: "date" | "details",
    value: Date | string
  ) => {
    setNotes((prev) => ({
      ...prev,
      newRecord: {
        ...prev.newRecord,
        [field]: value,
      },
    }));
  };

  // Function to add a new treatment plan
  const addTreatmentPlan = () => {
    const newPlanNumber =
      treatmentPlans.length > 0
        ? Math.max(...treatmentPlans.map((plan) => plan.planNumber)) + 1
        : 1;

    setTreatmentPlans([
      ...treatmentPlans,
      {
        id: `plan-${Date.now()}`,
        planNumber: newPlanNumber,
        plan: "",
        reminder: new Date(),
        isNew: true,
      },
    ]);
  };

  // Function to update a treatment plan
  const updateTreatmentPlan = (
    planId: string,
    field: "plan" | "reminder",
    value: string | Date
  ) => {
    setTreatmentPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            [field]: value,
          };
        }
        return plan;
      })
    );
  };

  // Function to save all records
  const saveAllRecords = () => {
    // Save new records for treatment categories
    setTreatmentCategories((prev) =>
      prev.map((category) => {
        if (category.newRecord && category.newRecord.details.trim()) {
          return {
            ...category,
            records: [
              ...category.records,
              {
                id: `${category.id}-${Date.now()}`,
                date: category.newRecord.date,
                details: category.newRecord.details,
              },
            ].sort((a, b) => b.date.getTime() - a.date.getTime()), // Sort by newest first
            newRecord: { date: new Date(), details: "" },
          };
        }
        return category;
      })
    );

    // Save new record for notes
    if (notes.newRecord.details.trim()) {
      setNotes((prev) => ({
        ...prev,
        records: [
          ...prev.records,
          {
            id: `notes-${Date.now()}`,
            date: prev.newRecord.date,
            details: prev.newRecord.details,
          },
        ].sort((a, b) => b.date.getTime() - a.date.getTime()),
        newRecord: { date: new Date(), details: "" },
      }));
    }

    // Save treatment plans
    setTreatmentPlans((prev) =>
      prev.map((plan) => ({
        ...plan,
        isNew: false, // Mark as saved
      }))
    );

    // Show success notification
    showNotification("Records saved successfully");
  };

  // Function to handle scroll area scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setShowScrollTop(target.scrollTop > 300);
  };

  // Function to scroll to top
  const scrollToTop = () => {
    const scrollArea = document.querySelector(".scroll-area-viewport");
    if (scrollArea) {
      scrollArea.scrollTop = 0;
    }
  };

  // Basic notification system
  const [notification, setNotification] = useState("");
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  // Function to check if there are any new records to save
  const hasNewRecords = () => {
    return (
      treatmentCategories.some((category) =>
        category.newRecord?.details.trim()
      ) ||
      notes.newRecord.details.trim() ||
      treatmentPlans.some((plan) => plan.isNew && plan.plan.trim())
    );
  };

  // Function to delete a record
  const deleteRecord = (categoryId: string, recordId: string) => {
    if (categoryId === "notes") {
      setNotes((prev) => ({
        ...prev,
        records: prev.records.filter((record) => record.id !== recordId),
      }));
    } else {
      setTreatmentCategories((prev) =>
        prev.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              records: category.records.filter(
                (record) => record.id !== recordId
              ),
            };
          }
          return category;
        })
      );
    }
    showNotification("Record deleted");
  };

  // Function to delete a treatment plan
  const deleteTreatmentPlan = (planId: string) => {
    setTreatmentPlans((prev) => prev.filter((plan) => plan.id !== planId));
    showNotification("Treatment plan deleted");
  };

  // Function to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <TabsContent value="treatment" className="space-y-6 mt-4">
      <Card className="shadow-md border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <h3 className="font-semibold text-lg sm:text-xl text-primary dark:text-blue-300 flex items-center">
              <Pill size={20} className="mr-2" />
              Treatment
            </h3>

            {/* Search categories */}
            <div className="relative w-full sm:w-64 lg:w-72">
              <Input
                type="text"
                placeholder="Search treatment types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-sm"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded shadow-sm dark:bg-green-900/30 dark:text-green-300 dark:border-green-400 transition-all">
              {notification}
            </div>
          )}

          <ScrollArea
            className="h-[calc(100vh-350px)] pr-4"
            onScrollCapture={handleScroll}
          >
            <Accordion
              type="single"
              collapsible
              value={expandedAccordion}
              onValueChange={handleAccordionChange}
              className="w-full space-y-4"
            >
              {/* Treatment categories */}
              {filteredCategories.map((category) => (
                <AccordionItem
                  key={category.id}
                  value={category.id}
                  className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-700"
                >
                  <AccordionTrigger className="px-3 sm:px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-600/50 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="text-sm sm:text-base font-medium">
                          {category.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        {category.records.length > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-1.5 py-0 h-5 sm:h-6"
                          >
                            {category.records.length}
                          </Badge>
                        )}
                        {category.newRecord?.details && (
                          <Badge className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300 text-xs px-1.5 py-0 h-5 sm:h-6">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 border-t border-gray-200 dark:border-slate-600">
                    <div className="p-3 sm:p-4 space-y-4">
                      {/* New record form */}
                      <div className="bg-gray-50 dark:bg-slate-600/30 p-3 sm:p-4 rounded-md border border-gray-100 dark:border-slate-600">
                        <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                          Add New {category.label}
                        </h4>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <Label
                              htmlFor={`${category.id}-date`}
                              className="text-sm"
                            >
                              Date
                            </Label>
                            <div className="w-full sm:w-48">
                              <DatePicker
                                date={category.newRecord?.date}
                                setDate={(date) =>
                                  date &&
                                  updateNewRecord(category.id, "date", date)
                                }
                                id={`${category.id}-date`}
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor={`${category.id}-details`}
                              className="text-sm mb-1 block"
                            >
                              Details
                            </Label>
                            <Textarea
                              id={`${category.id}-details`}
                              value={category.newRecord?.details || ""}
                              onChange={(e) =>
                                updateNewRecord(
                                  category.id,
                                  "details",
                                  e.target.value
                                )
                              }
                              placeholder={`Specify ${category.label} details`}
                              className="h-20 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Previous records */}
                      {category.records.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Previous Records
                          </h4>
                          <div className="space-y-2">
                            {category.records.map((record) => (
                              <div
                                key={record.id}
                                className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md p-2 sm:p-3"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    <CalendarIcon size={14} className="mr-1" />
                                    {formatDate(record.date)}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      deleteRecord(category.id, record.id)
                                    }
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <XCircle size={16} />
                                  </Button>
                                </div>
                                <div className="text-xs sm:text-sm whitespace-pre-wrap bg-gray-50 dark:bg-slate-600/30 p-2 rounded">
                                  {record.details}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}

              {/* Display message when no results found */}
              {filteredCategories.length === 0 && (
                <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                  <p className="text-gray-500 dark:text-gray-400">
                    No treatment types found matching &quot;{searchTerm}&quot;
                  </p>
                </div>
              )}

              {/* Treatment Plans Section */}
              {(searchTerm === "" ||
                "treatment plan".includes(searchTerm.toLowerCase())) && (
                <AccordionItem
                  value="treatmentPlans"
                  className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-700"
                >
                  <AccordionTrigger className="px-3 sm:px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-600/50 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="text-sm sm:text-base font-medium">
                          Treatment Plans
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-1.5 py-0 h-5 sm:h-6"
                        >
                          {treatmentPlans.length}
                        </Badge>
                        {treatmentPlans.some(
                          (plan) => plan.isNew && plan.plan.trim()
                        ) && (
                          <Badge className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300 text-xs px-1.5 py-0 h-5 sm:h-6">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 border-t border-gray-200 dark:border-slate-600">
                    <div className="p-3 sm:p-4 space-y-4">
                      {/* Treatment Plans */}
                      {treatmentPlans.map((plan, index) => (
                        <div
                          key={plan.id}
                          className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md p-3 sm:p-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                            <h4 className="font-medium text-base text-primary dark:text-blue-300 mb-2 sm:mb-0 flex items-center">
                              Treatment Plan {plan.planNumber}
                              {plan.isNew && plan.plan.trim() && (
                                <Badge className="ml-2 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300 text-xs">
                                  New
                                </Badge>
                              )}
                            </h4>
                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                              <div className="flex items-center">
                                <Label
                                  htmlFor={`reminderDate-${index}`}
                                  className="font-medium text-xs sm:text-sm mr-2 dark:text-gray-300"
                                >
                                  Reminder:
                                </Label>
                                <DatePicker
                                  date={
                                    plan.reminder
                                      ? new Date(plan.reminder)
                                      : undefined
                                  }
                                  setDate={(date) =>
                                    date &&
                                    updateTreatmentPlan(
                                      plan.id,
                                      "reminder",
                                      date
                                    )
                                  }
                                  id={`reminderDate-${index}`}
                                  className="text-sm"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTreatmentPlan(plan.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <XCircle size={16} />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Textarea
                              id={`treatmentPlan-${index}`}
                              value={plan.plan}
                              onChange={(e) =>
                                updateTreatmentPlan(
                                  plan.id,
                                  "plan",
                                  e.target.value
                                )
                              }
                              placeholder="• Treatment point"
                              className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                            />
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-center">
                        <Button
                          onClick={addTreatmentPlan}
                          variant="outline"
                          className="border-dashed border-gray-300 dark:border-slate-500 hover:border-gray-400 dark:hover:border-slate-400 bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                        >
                          <Plus className="mr-1 h-4 w-4" /> Add Treatment Plan
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Notes Section */}
              {(searchTerm === "" ||
                "notes".includes(searchTerm.toLowerCase())) && (
                <AccordionItem
                  value="notes"
                  className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-700"
                >
                  <AccordionTrigger className="px-3 sm:px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-600/50 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="text-sm sm:text-base font-medium">
                          Notes
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        {notes.records.length > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-1.5 py-0 h-5 sm:h-6"
                          >
                            {notes.records.length}
                          </Badge>
                        )}
                        {notes.newRecord?.details && (
                          <Badge className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300 text-xs px-1.5 py-0 h-5 sm:h-6">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 border-t border-gray-200 dark:border-slate-600">
                    <div className="p-3 sm:p-4 space-y-4">
                      {/* New note form */}
                      <div className="bg-gray-50 dark:bg-slate-600/30 p-3 sm:p-4 rounded-md border border-gray-100 dark:border-slate-600">
                        <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                          Add New Note
                        </h4>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <Label htmlFor="notes-date" className="text-sm">
                              Date
                            </Label>
                            <div className="w-full sm:w-48">
                              <DatePicker
                                date={notes.newRecord?.date}
                                setDate={(date) =>
                                  date && updateNotesNewRecord("date", date)
                                }
                                id="notes-date"
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <Textarea
                              id="notes-details"
                              value={notes.newRecord?.details || ""}
                              onChange={(e) =>
                                updateNotesNewRecord("details", e.target.value)
                              }
                              placeholder="Enter any additional information, concerns, or special instructions"
                              className="h-32 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Previous notes */}
                      {notes.records.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Previous Notes
                          </h4>
                          <div className="space-y-2">
                            {notes.records.map((record) => (
                              <div
                                key={record.id}
                                className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md p-2 sm:p-3"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    <CalendarIcon size={14} className="mr-1" />
                                    {formatDate(record.date)}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      deleteRecord("notes", record.id)
                                    }
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <XCircle size={16} />
                                  </Button>
                                </div>
                                <div className="text-xs sm:text-sm whitespace-pre-wrap bg-gray-50 dark:bg-slate-600/30 p-2 rounded">
                                  {record.details}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </ScrollArea>

          {/* Scroll to top button */}
          {showScrollTop && (
            <Button
              onClick={scrollToTop}
              size="sm"
              variant="secondary"
              className="fixed bottom-24 right-6 z-10 rounded-full w-10 h-10 p-0 shadow-md"
            >
              <ChevronUp size={20} />
            </Button>
          )}
        </CardContent>

        <CardFooter className="flex justify-end p-4 sm:p-6 border-t border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800">
          <Button
            onClick={saveAllRecords}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 w-full sm:w-auto"
            disabled={!hasNewRecords()}
          >
            <Save size={18} className="mr-2" />
            Save All Changes
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}

export default TreatmentTab;

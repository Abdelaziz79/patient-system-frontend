"use client";

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
  ImageIcon,
  Save,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "../DatePicker";

// Define types for our imaging records
type ImagingRecord = {
  id: string;
  date: Date;
  findings: string;
};

type ImagingStudyType = {
  id: string;
  label: string;
  records: ImagingRecord[];
  newRecord?: {
    date: Date;
    findings: string;
  };
};

function ImagingTab() {
  // Define imaging studies
  const [imagingStudies, setImagingStudies] = useState<ImagingStudyType[]>([
    {
      id: "ctBrain",
      label: "CT Brain",
      records: [
        {
          id: "1",
          date: new Date(),
          findings: "Normal",
        },
        {
          id: "2",
          date: new Date(),
          findings: "Abnormal",
        },
      ],
      newRecord: { date: new Date(), findings: "" },
    },
    {
      id: "ctChest",
      label: "CT Chest",
      records: [],
      newRecord: { date: new Date(), findings: "" },
    },
    {
      id: "cxr",
      label: "CXR (Chest X-Ray)",
      records: [],
      newRecord: { date: new Date(), findings: "" },
    },
    {
      id: "us",
      label: "U/S (Ultrasound)",
      records: [],
      newRecord: { date: new Date(), findings: "" },
    },
    {
      id: "dupplex",
      label: "Duplex",
      records: [],
      newRecord: { date: new Date(), findings: "" },
    },
    {
      id: "ecg",
      label: "ECG",
      records: [],
      newRecord: { date: new Date(), findings: "" },
    },
    {
      id: "echo",
      label: "ECHO",
      records: [],
      newRecord: { date: new Date(), findings: "" },
    },
    {
      id: "mpi",
      label: "MPI (Myocardial Perfusion Imaging)",
      records: [],
      newRecord: { date: new Date(), findings: "" },
    },
    {
      id: "ctAngio",
      label: "CT Angiography",
      records: [],
      newRecord: { date: new Date(), findings: "" },
    },
  ]);

  // State for filtering studies
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudies, setFilteredStudies] = useState(imagingStudies);

  // Filter studies when search term changes
  useEffect(() => {
    const filtered = imagingStudies.filter((study) =>
      study.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudies(filtered);
  }, [searchTerm, imagingStudies]);

  // State for other imaging studies
  const [otherStudy, setOtherStudy] = useState({
    label: "Other Study",
    newRecord: { date: new Date(), findings: "" },
    records: [] as ImagingRecord[],
  });

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

  // Function to update a study's new record
  const updateNewRecord = (
    studyId: string,
    field: "date" | "findings",
    value: Date | string
  ) => {
    setImagingStudies((prev) =>
      prev.map((study) => {
        if (study.id === studyId) {
          return {
            ...study,
            newRecord: {
              ...study.newRecord!,
              [field]: value,
            },
          };
        }
        return study;
      })
    );
  };

  // Function to update other study's new record
  const updateOtherNewRecord = (
    field: "date" | "findings",
    value: Date | string
  ) => {
    setOtherStudy((prev) => ({
      ...prev,
      newRecord: {
        ...prev.newRecord,
        [field]: value,
      },
    }));
  };

  // Function to save all new records
  const saveAllRecords = () => {
    // Save new records for standard imaging studies
    setImagingStudies((prev) =>
      prev.map((study) => {
        if (study.newRecord && study.newRecord.findings.trim()) {
          return {
            ...study,
            records: [
              ...study.records,
              {
                id: `${study.id}-${Date.now()}`,
                date: study.newRecord.date,
                findings: study.newRecord.findings,
              },
            ].sort((a, b) => b.date.getTime() - a.date.getTime()), // Sort by newest first
            newRecord: { date: new Date(), findings: "" },
          };
        }
        return study;
      })
    );

    // Save new record for other study
    if (otherStudy.newRecord.findings.trim()) {
      setOtherStudy((prev) => ({
        ...prev,
        records: [
          ...prev.records,
          {
            id: `other-${Date.now()}`,
            date: prev.newRecord.date,
            findings: prev.newRecord.findings,
          },
        ].sort((a, b) => b.date.getTime() - a.date.getTime()),
        newRecord: { date: new Date(), findings: "" },
      }));
    }

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
      imagingStudies.some((study) => study.newRecord?.findings.trim()) ||
      otherStudy.newRecord.findings.trim()
    );
  };

  // Function to delete a record
  const deleteRecord = (studyId: string, recordId: string) => {
    if (studyId === "other") {
      setOtherStudy((prev) => ({
        ...prev,
        records: prev.records.filter((record) => record.id !== recordId),
      }));
    } else {
      setImagingStudies((prev) =>
        prev.map((study) => {
          if (study.id === studyId) {
            return {
              ...study,
              records: study.records.filter((record) => record.id !== recordId),
            };
          }
          return study;
        })
      );
    }
    showNotification("Record deleted");
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
    <TabsContent value="imaging">
      <Card className="shadow-md border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <h3 className="font-semibold text-lg sm:text-xl text-primary dark:text-blue-300 flex items-center">
              <ImageIcon size={20} className="mr-2" />
              Imaging Results
            </h3>

            {/* Search studies */}
            <div className="relative w-full sm:w-64 lg:w-72">
              <Input
                type="text"
                placeholder="Search studies..."
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
              {/* Standard imaging studies */}
              {filteredStudies.map((study) => (
                <AccordionItem
                  key={study.id}
                  value={study.id}
                  className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-700"
                >
                  <AccordionTrigger className="px-3 sm:px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-600/50 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="text-sm sm:text-base font-medium">
                          {study.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        {study.records.length > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-1.5 py-0 h-5 sm:h-6"
                          >
                            {study.records.length}
                          </Badge>
                        )}
                        {study.newRecord?.findings && (
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
                          Add New Result
                        </h4>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <Label
                              htmlFor={`${study.id}-date`}
                              className="text-sm"
                            >
                              Date Performed
                            </Label>
                            <div className="w-full sm:w-48">
                              <DatePicker
                                date={study.newRecord?.date}
                                setDate={(date) =>
                                  date &&
                                  updateNewRecord(study.id, "date", date)
                                }
                                id={`${study.id}-date`}
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor={`${study.id}-findings`}
                              className="text-sm mb-1 block"
                            >
                              Findings
                            </Label>
                            <Textarea
                              id={`${study.id}-findings`}
                              value={study.newRecord?.findings || ""}
                              onChange={(e) =>
                                updateNewRecord(
                                  study.id,
                                  "findings",
                                  e.target.value
                                )
                              }
                              placeholder={`Enter ${study.label} findings`}
                              className="h-20 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Previous records */}
                      {study.records.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Previous Results
                          </h4>
                          <div className="space-y-2">
                            {study.records.map((record) => (
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
                                      deleteRecord(study.id, record.id)
                                    }
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <XCircle size={16} />
                                  </Button>
                                </div>
                                <div className="text-xs sm:text-sm whitespace-pre-wrap bg-gray-50 dark:bg-slate-600/30 p-2 rounded">
                                  {record.findings}
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
              {filteredStudies.length === 0 && (
                <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                  <p className="text-gray-500 dark:text-gray-400">
                    No studies found matching &quot;{searchTerm}&quot;
                  </p>
                </div>
              )}

              {/* Other imaging studies - always show this regardless of search */}
              {(searchTerm === "" ||
                "other".includes(searchTerm.toLowerCase())) && (
                <AccordionItem
                  value="other"
                  className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-700"
                >
                  <AccordionTrigger className="px-3 sm:px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-600/50 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="text-sm sm:text-base font-medium">
                          Other Imaging Studies
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        {otherStudy.records.length > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-1.5 py-0 h-5 sm:h-6"
                          >
                            {otherStudy.records.length}
                          </Badge>
                        )}
                        {otherStudy.newRecord?.findings && (
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
                          Add New Result
                        </h4>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <Label htmlFor="other-date" className="text-sm">
                              Date Performed
                            </Label>
                            <div className="w-full sm:w-48">
                              <DatePicker
                                date={otherStudy.newRecord?.date}
                                setDate={(date) =>
                                  date && updateOtherNewRecord("date", date)
                                }
                                id="other-date"
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor="other-findings"
                              className="text-sm mb-1 block"
                            >
                              Study & Findings
                            </Label>
                            <Textarea
                              id="other-findings"
                              value={otherStudy.newRecord?.findings || ""}
                              onChange={(e) =>
                                updateOtherNewRecord("findings", e.target.value)
                              }
                              placeholder="Enter imaging study type and findings"
                              className="h-20 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Previous records */}
                      {otherStudy.records.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Previous Results
                          </h4>
                          <div className="space-y-2">
                            {otherStudy.records.map((record) => (
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
                                      deleteRecord("other", record.id)
                                    }
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <XCircle size={16} />
                                  </Button>
                                </div>
                                <div className="text-xs sm:text-sm whitespace-pre-wrap bg-gray-50 dark:bg-slate-600/30 p-2 rounded">
                                  {record.findings}
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

export default ImagingTab;

"use client";

import React, { useState, useEffect } from "react";
import { useReport } from "@/app/_hooks/useReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart4,
  PieChart,
  Table2,
  LineChart,
  ListFilter,
  ChevronRight,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { IReport, IReportChart, IReportFilter } from "@/app/_api/reportApi";
import { Spinner } from "@/app/_components/Spinner";

interface ReportBuilderProps {
  onReportCreated: () => void;
  existingReport?: IReport;
}

export default function ReportBuilder({
  onReportCreated,
  existingReport,
}: ReportBuilderProps) {
  const {
    reportFields,
    isFieldsLoading,
    refetchFields,
    createReport,
    updateReport,
    generateCustomReport,
  } = useReport();
  const [activeTab, setActiveTab] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [reportData, setReportData] = useState<Partial<IReport>>({
    name: "",
    description: "",
    type: "patient",
    filters: [],
    charts: [],
    includeFields: [],
    isPrivate: false,
  });

  useEffect(() => {
    // Fetch report fields if not loaded
    if (!reportFields) {
      refetchFields();
    }

    // If editing existing report, populate the form
    if (existingReport) {
      setReportData({
        ...existingReport,
      });
    }
  }, [reportFields, refetchFields, existingReport]);

  const handleInputChange = (field: string, value: any) => {
    setReportData((prev) => ({ ...prev, [field]: value }));
  };

  const addFilter = () => {
    setReportData((prev) => ({
      ...prev,
      filters: [
        ...(prev.filters || []),
        {
          field: "",
          operator: "equals",
          value: "",
          fieldType: "text",
        },
      ],
    }));
  };

  const updateFilter = (index: number, field: string, value: any) => {
    setReportData((prev) => {
      const updatedFilters = [...(prev.filters || [])];
      updatedFilters[index] = { ...updatedFilters[index], [field]: value };

      // If field is changed, update the fieldType automatically
      if (field === "field" && reportFields) {
        const selectedField = reportFields.find(
          (f: { name: string }) => f.name === value
        );
        if (selectedField) {
          updatedFilters[index].fieldType = selectedField.type;
        }
      }

      return { ...prev, filters: updatedFilters };
    });
  };

  const removeFilter = (index: number) => {
    setReportData((prev) => {
      const updatedFilters = [...(prev.filters || [])];
      updatedFilters.splice(index, 1);
      return { ...prev, filters: updatedFilters };
    });
  };

  const addChart = (type: string) => {
    setReportData((prev) => ({
      ...prev,
      charts: [
        ...(prev.charts || []),
        {
          type,
          title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
          dataField: "",
        },
      ],
    }));
  };

  const updateChart = (index: number, field: string, value: any) => {
    setReportData((prev) => {
      const updatedCharts = [...(prev.charts || [])];
      updatedCharts[index] = { ...updatedCharts[index], [field]: value };
      return { ...prev, charts: updatedCharts };
    });
  };

  const removeChart = (index: number) => {
    setReportData((prev) => {
      const updatedCharts = [...(prev.charts || [])];
      updatedCharts.splice(index, 1);
      return { ...prev, charts: updatedCharts };
    });
  };

  const toggleIncludeField = (fieldName: string) => {
    setReportData((prev) => {
      const currentFields = prev.includeFields || [];
      const updatedFields = currentFields.includes(fieldName)
        ? currentFields.filter((f) => f !== fieldName)
        : [...currentFields, fieldName];
      return { ...prev, includeFields: updatedFields };
    });
  };

  const handlePreview = async () => {
    setIsLoading(true);
    try {
      const result = await generateCustomReport({
        type: reportData.type,
        filters: reportData.filters,
        charts: reportData.charts,
        includeFields: reportData.includeFields,
      });
      setPreviewData(result);
      setShowPreview(true);
    } catch (error) {
      console.error("Error generating preview:", error);
      alert(
        "Failed to generate preview. Please check your report configuration."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!reportData.name) {
      alert("Please enter a report name");
      return;
    }

    if (!reportData.type) {
      alert("Please select a report type");
      return;
    }

    if (!reportData.includeFields || reportData.includeFields.length === 0) {
      alert("Please select at least one field to include in the report");
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (existingReport?.id) {
        result = await updateReport(existingReport.id, reportData);
      } else {
        result = await createReport(reportData);
      }

      if (result.success) {
        alert(`Report ${existingReport ? "updated" : "created"} successfully!`);
        onReportCreated();
      } else {
        alert(
          `Failed to ${existingReport ? "update" : "create"} report: ${
            result.error
          }`
        );
      }
    } catch (error) {
      console.error("Error saving report:", error);
      alert(`Failed to ${existingReport ? "update" : "create"} report.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFieldsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  const fieldsGroupedBySection = reportFields
    ? reportFields.reduce((acc: any, field: any) => {
        const section = field.templateName
          ? field.templateName
          : "Common Fields";
        if (!acc[section]) {
          acc[section] = [];
        }
        acc[section].push(field);
        return acc;
      }, {})
    : {};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="info">Basic Info</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="fields">Include Fields</TabsTrigger>
          <TabsTrigger value="preview" disabled={isLoading}>
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Report Name *</Label>
                  <Input
                    id="name"
                    value={reportData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter report name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={reportData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter report description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Report Type *</Label>
                  <Select
                    value={reportData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient Report</SelectItem>
                      <SelectItem value="visit">Visit Report</SelectItem>
                      <SelectItem value="status">Status Report</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPrivate"
                    checked={reportData.isPrivate}
                    onCheckedChange={(checked) =>
                      handleInputChange("isPrivate", checked === true)
                    }
                  />
                  <Label htmlFor="isPrivate">
                    Make this report private (only visible to you)
                  </Label>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => setActiveTab("filters")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Next: Configure Filters
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Report Filters</CardTitle>
              <Button onClick={addFilter} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Filter
              </Button>
            </CardHeader>
            <CardContent>
              {reportData.filters && reportData.filters.length > 0 ? (
                <div className="space-y-4">
                  {reportData.filters.map((filter, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 items-center bg-gray-50 dark:bg-gray-900 p-3 rounded"
                    >
                      <div className="col-span-3">
                        <Label>Field</Label>
                        <Select
                          value={filter.field}
                          onValueChange={(value) =>
                            updateFilter(index, "field", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportFields &&
                              reportFields.map((field: any) => (
                                <SelectItem key={field.name} value={field.name}>
                                  {field.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-3">
                        <Label>Operator</Label>
                        <Select
                          value={filter.operator}
                          onValueChange={(value) =>
                            updateFilter(index, "operator", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="notEquals">
                              Not Equals
                            </SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="greaterThan">
                              Greater Than
                            </SelectItem>
                            <SelectItem value="lessThan">Less Than</SelectItem>
                            {/* More operators can be added */}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-5">
                        <Label>Value</Label>
                        <Input
                          value={filter.value}
                          onChange={(e) =>
                            updateFilter(index, "value", e.target.value)
                          }
                          placeholder="Enter filter value"
                        />
                      </div>

                      <div className="col-span-1 flex justify-end pt-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFilter(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ListFilter className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No filters configured</p>
                  <p className="text-sm">
                    Filters help narrow down the data in your report
                  </p>
                  <Button
                    onClick={addFilter}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Filter
                  </Button>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button onClick={() => setActiveTab("info")} variant="outline">
                  Back
                </Button>
                <Button
                  onClick={() => setActiveTab("charts")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Next: Configure Charts
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Report Charts</CardTitle>
              <div className="flex space-x-2">
                <Button
                  onClick={() => addChart("summary")}
                  size="sm"
                  variant="outline"
                  title="Add Summary"
                >
                  <Table2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => addChart("bar")}
                  size="sm"
                  variant="outline"
                  title="Add Bar Chart"
                >
                  <BarChart4 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => addChart("pie")}
                  size="sm"
                  variant="outline"
                  title="Add Pie Chart"
                >
                  <PieChart className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => addChart("line")}
                  size="sm"
                  variant="outline"
                  title="Add Line Chart"
                >
                  <LineChart className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => addChart("table")}
                  size="sm"
                  variant="outline"
                  title="Add Table"
                >
                  <Table2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reportData.charts && reportData.charts.length > 0 ? (
                <div className="space-y-6">
                  {reportData.charts.map((chart, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-900 p-4 rounded"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium flex items-center">
                          {chart.type === "bar" && (
                            <BarChart4 className="h-4 w-4 mr-2" />
                          )}
                          {chart.type === "pie" && (
                            <PieChart className="h-4 w-4 mr-2" />
                          )}
                          {chart.type === "line" && (
                            <LineChart className="h-4 w-4 mr-2" />
                          )}
                          {chart.type === "table" && (
                            <Table2 className="h-4 w-4 mr-2" />
                          )}
                          {chart.type === "summary" && (
                            <Table2 className="h-4 w-4 mr-2" />
                          )}
                          {chart.type.charAt(0).toUpperCase() +
                            chart.type.slice(1)}{" "}
                          Chart
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChart(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`chart-title-${index}`}>Title</Label>
                          <Input
                            id={`chart-title-${index}`}
                            value={chart.title || ""}
                            onChange={(e) =>
                              updateChart(index, "title", e.target.value)
                            }
                            placeholder="Chart title"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`chart-dataField-${index}`}>
                            Data Field
                          </Label>
                          <Select
                            value={chart.dataField}
                            onValueChange={(value) =>
                              updateChart(index, "dataField", value)
                            }
                          >
                            <SelectTrigger id={`chart-dataField-${index}`}>
                              <SelectValue placeholder="Select data field" />
                            </SelectTrigger>
                            <SelectContent>
                              {reportFields &&
                                reportFields.map((field: any) => (
                                  <SelectItem
                                    key={field.name}
                                    value={field.name}
                                  >
                                    {field.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {(chart.type === "line" || chart.type === "bar") && (
                          <>
                            <div>
                              <Label htmlFor={`chart-groupBy-${index}`}>
                                Group By
                              </Label>
                              <Select
                                value={chart.groupBy || ""}
                                onValueChange={(value) =>
                                  updateChart(index, "groupBy", value)
                                }
                              >
                                <SelectTrigger id={`chart-groupBy-${index}`}>
                                  <SelectValue placeholder="Select grouping" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="timePeriod">
                                    Time Period
                                  </SelectItem>
                                  <SelectItem value="status">Status</SelectItem>
                                  <SelectItem value="templateId">
                                    Template
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {chart.groupBy === "timePeriod" && (
                              <div>
                                <Label htmlFor={`chart-timeInterval-${index}`}>
                                  Time Interval
                                </Label>
                                <Select
                                  value={chart.timeInterval || "month"}
                                  onValueChange={(value) =>
                                    updateChart(index, "timeInterval", value)
                                  }
                                >
                                  <SelectTrigger
                                    id={`chart-timeInterval-${index}`}
                                  >
                                    <SelectValue placeholder="Select time interval" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="day">Day</SelectItem>
                                    <SelectItem value="week">Week</SelectItem>
                                    <SelectItem value="month">Month</SelectItem>
                                    <SelectItem value="quarter">
                                      Quarter
                                    </SelectItem>
                                    <SelectItem value="year">Year</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart4 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No charts configured</p>
                  <p className="text-sm">
                    Add charts to visualize your report data
                  </p>
                  <div className="flex justify-center space-x-2 mt-4">
                    <Button
                      onClick={() => addChart("bar")}
                      size="sm"
                      variant="outline"
                    >
                      <BarChart4 className="h-4 w-4 mr-2" />
                      Bar Chart
                    </Button>
                    <Button
                      onClick={() => addChart("pie")}
                      size="sm"
                      variant="outline"
                    >
                      <PieChart className="h-4 w-4 mr-2" />
                      Pie Chart
                    </Button>
                    <Button
                      onClick={() => addChart("table")}
                      size="sm"
                      variant="outline"
                    >
                      <Table2 className="h-4 w-4 mr-2" />
                      Table
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button
                  onClick={() => setActiveTab("filters")}
                  variant="outline"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setActiveTab("fields")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Next: Select Fields
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <CardTitle>Include Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Select the fields to include in your report. These fields will
                be available in tables and for filtering.
              </p>

              <div className="space-y-6">
                {reportFields &&
                  Object.entries(fieldsGroupedBySection).map(
                    ([section, fields]: [string, any]) => (
                      <div key={section} className="border rounded-md p-4">
                        <h3 className="font-medium mb-3">{section}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {fields.map((field: any) => (
                            <div
                              key={field.name}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`field-${field.name}`}
                                checked={(
                                  reportData.includeFields || []
                                ).includes(field.name)}
                                onCheckedChange={() =>
                                  toggleIncludeField(field.name)
                                }
                              />
                              <Label
                                htmlFor={`field-${field.name}`}
                                className="text-sm cursor-pointer"
                              >
                                {field.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  onClick={() => setActiveTab("charts")}
                  variant="outline"
                >
                  Back
                </Button>
                <div className="space-x-2">
                  <Button
                    onClick={handlePreview}
                    variant="outline"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Report
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          {showPreview && previewData ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>
                    Preview: {reportData.name || "Untitled Report"}
                  </CardTitle>
                  <Button
                    onClick={() => {
                      setShowPreview(false);
                      setActiveTab("fields");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Back to Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  {/* Reuse the ReportViewer component but embedded here */}
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
                    <Tabs defaultValue="chart-0">
                      <TabsList className="mb-4">
                        {previewData.data.map((chart: any, index: number) => (
                          <TabsTrigger key={index} value={`chart-${index}`}>
                            {chart.title || `Chart ${index + 1}`}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {previewData.data.map((chart: any, index: number) => (
                        <TabsContent key={index} value={`chart-${index}`}>
                          <Card>
                            <CardHeader>
                              <CardTitle>{chart.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {/* Simplified preview of chart data */}
                              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-96">
                                {JSON.stringify(chart, null, 2)}
                              </pre>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Eye className="h-12 w-12 mb-4 opacity-50" />
              <p>Generate a preview to see how your report will look</p>
              <Button
                onClick={handlePreview}
                variant="outline"
                className="mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Generate Preview
                  </>
                )}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

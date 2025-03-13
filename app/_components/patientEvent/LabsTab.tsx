"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DatePicker from "../DatePicker";

type LabTest = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
};

function LabsTab() {
  // Basic lab info
  const [labTitle, setLabTitle] = useState("");
  const [labDate, setLabDate] = useState<Date | undefined>(new Date());
  const [labNotes, setLabNotes] = useState("");
  const [isAbnormal, setIsAbnormal] = useState(false);
  const [criticalValue, setCriticalValue] = useState(false);

  // CBC and Inflammatory Markers
  const [tlc, setTlc] = useState("");
  const [hb, setHb] = useState("");
  const [plt, setPlt] = useState("");
  const [crp, setCrp] = useState("");

  // Chemistry Panel
  const [urea, setUrea] = useState("");
  const [creat, setCreat] = useState("");
  const [na, setNa] = useState("");
  const [k, setK] = useState("");
  const [ca, setCa] = useState("");
  const [alt, setAlt] = useState("");
  const [ast, setAst] = useState("");
  const [alb, setAlb] = useState("");

  // Cardiac Enzymes
  const [ck, setCk] = useState("");
  const [ckmb, setCkmb] = useState("");
  const [trop, setTrop] = useState("");

  // Arterial Blood Gas
  const [ph, setPh] = useState("");
  const [co2, setCo2] = useState("");
  const [hco3, setHco3] = useState("");
  const [lactate, setLactate] = useState("");
  const [o2sat, setO2sat] = useState("");

  // Coagulation
  const [pt, setPt] = useState("");
  const [ptt, setPtt] = useState("");
  const [inr, setInr] = useState("");

  // Other lab fields
  const [otherLabResults, setOtherLabResults] = useState("");

  // Define test groups for rendering
  const cbcTests: LabTest[] = [
    {
      id: "tlc",
      label: "TLC (Total Leukocyte Count)",
      value: tlc,
      onChange: setTlc,
      unit: "×10³/μL",
    },
    {
      id: "hb",
      label: "Hb (Hemoglobin)",
      value: hb,
      onChange: setHb,
      unit: "g/dL",
    },
    {
      id: "plt",
      label: "PLT (Platelets)",
      value: plt,
      onChange: setPlt,
      unit: "×10³/μL",
    },
    {
      id: "crp",
      label: "CRP (C-Reactive Protein)",
      value: crp,
      onChange: setCrp,
      unit: "mg/L",
    },
  ];

  const chemistryTests: LabTest[] = [
    {
      id: "urea",
      label: "Urea",
      value: urea,
      onChange: setUrea,
      unit: "mg/dL",
    },
    {
      id: "creat",
      label: "Creatinine",
      value: creat,
      onChange: setCreat,
      unit: "mg/dL",
    },
    {
      id: "na",
      label: "Na (Sodium)",
      value: na,
      onChange: setNa,
      unit: "mEq/L",
    },
    {
      id: "k",
      label: "K (Potassium)",
      value: k,
      onChange: setK,
      unit: "mEq/L",
    },
    {
      id: "ca",
      label: "Ca (Calcium)",
      value: ca,
      onChange: setCa,
      unit: "mg/dL",
    },
    {
      id: "alt",
      label: "ALT (Alanine Transaminase)",
      value: alt,
      onChange: setAlt,
      unit: "U/L",
    },
    {
      id: "ast",
      label: "AST (Aspartate Transaminase)",
      value: ast,
      onChange: setAst,
      unit: "U/L",
    },
    {
      id: "alb",
      label: "Alb (Albumin)",
      value: alb,
      onChange: setAlb,
      unit: "g/dL",
    },
  ];

  const cardiacEnzymes: LabTest[] = [
    {
      id: "ck",
      label: "CK (Creatine Kinase)",
      value: ck,
      onChange: setCk,
      unit: "U/L",
    },
    {
      id: "ckmb",
      label: "CK-MB",
      value: ckmb,
      onChange: setCkmb,
      unit: "ng/mL",
    },
    {
      id: "trop",
      label: "Troponin",
      value: trop,
      onChange: setTrop,
      unit: "ng/mL",
    },
  ];

  const abgTests: LabTest[] = [
    {
      id: "ph",
      label: "pH",
      value: ph,
      onChange: setPh,
      unit: "",
    },
    {
      id: "co2",
      label: "CO₂",
      value: co2,
      onChange: setCo2,
      unit: "mmHg",
    },
    {
      id: "hco3",
      label: "HCO₃",
      value: hco3,
      onChange: setHco3,
      unit: "mEq/L",
    },
    {
      id: "lactate",
      label: "Lactate",
      value: lactate,
      onChange: setLactate,
      unit: "mmol/L",
    },
    {
      id: "o2sat",
      label: "O₂ Saturation",
      value: o2sat,
      onChange: setO2sat,
      unit: "%",
    },
  ];

  const coagulationTests: LabTest[] = [
    {
      id: "pt",
      label: "PT (Prothrombin Time)",
      value: pt,
      onChange: setPt,
      unit: "sec",
    },
    {
      id: "ptt",
      label: "PTT (Partial Thromboplastin Time)",
      value: ptt,
      onChange: setPtt,
      unit: "sec",
    },
    {
      id: "inr",
      label: "INR (International Normalized Ratio)",
      value: inr,
      onChange: setInr,
      unit: "",
    },
  ];

  // Function to render a group of tests
  const renderTestGroup = (testGroup: LabTest[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {testGroup.map((test) => (
        <div
          key={test.id}
          className="flex flex-col space-y-2 bg-gray-50 dark:bg-slate-800/80 p-3 rounded-md border border-gray-100 dark:border-slate-600"
        >
          <div className="space-y-2">
            <Label
              htmlFor={test.id}
              className="font-medium text-sm dark:text-gray-300"
            >
              {test.label}
            </Label>
            <div className="flex">
              <Input
                id={test.id}
                value={test.value}
                onChange={(e) => test.onChange(e.target.value)}
                placeholder={`Enter ${test.label}`}
                className="focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 text-sm"
              />
              {test.unit && (
                <span className="ml-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  {test.unit}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <TabsContent value="labs">
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Laboratory Results
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="labTitle"
                  className="font-medium dark:text-gray-300"
                >
                  Test Name
                </Label>
                <Input
                  id="labTitle"
                  value={labTitle}
                  onChange={(e) => setLabTitle(e.target.value)}
                  placeholder="e.g. Complete Blood Count"
                  className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div>
                <div className="flex flex-col  gap-3">
                  <Label
                    htmlFor="labDate"
                    className="font-medium dark:text-gray-300"
                  >
                    Collection Date
                  </Label>
                  <DatePicker date={labDate} setDate={setLabDate} />
                </div>
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isAbnormal"
                  checked={isAbnormal}
                  onCheckedChange={setIsAbnormal}
                />
                <Label
                  htmlFor="isAbnormal"
                  className="font-medium dark:text-gray-300"
                >
                  Abnormal Result
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="criticalValue"
                  checked={criticalValue}
                  onCheckedChange={setCriticalValue}
                />
                <Label
                  htmlFor="criticalValue"
                  className="font-medium text-red-600 dark:text-red-400"
                >
                  Critical Value
                </Label>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="cbc" className="dark:border-slate-600">
                <AccordionTrigger className="font-medium text-base dark:text-gray-200">
                  CBC and Inflammatory Markers
                </AccordionTrigger>
                <AccordionContent>{renderTestGroup(cbcTests)}</AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="chemistry"
                className="dark:border-slate-600"
              >
                <AccordionTrigger className="font-medium text-base dark:text-gray-200">
                  Chemistry Panel
                </AccordionTrigger>
                <AccordionContent>
                  {renderTestGroup(chemistryTests)}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cardiac" className="dark:border-slate-600">
                <AccordionTrigger className="font-medium text-base dark:text-gray-200">
                  Cardiac Enzymes
                </AccordionTrigger>
                <AccordionContent>
                  {renderTestGroup(cardiacEnzymes)}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="abg" className="dark:border-slate-600">
                <AccordionTrigger className="font-medium text-base dark:text-gray-200">
                  Arterial Blood Gas (ABG)
                </AccordionTrigger>
                <AccordionContent>{renderTestGroup(abgTests)}</AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="coagulation"
                className="dark:border-slate-600"
              >
                <AccordionTrigger className="font-medium text-base dark:text-gray-200">
                  Coagulation Profile
                </AccordionTrigger>
                <AccordionContent>
                  {renderTestGroup(coagulationTests)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div>
              <Label
                htmlFor="otherLabResults"
                className="font-medium dark:text-gray-300"
              >
                Additional Lab Results
              </Label>
              <Textarea
                id="otherLabResults"
                value={otherLabResults}
                onChange={(e) => setOtherLabResults(e.target.value)}
                placeholder="Enter any other lab results not covered above"
                className="min-h-[150px] mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div>
              <Label
                htmlFor="labNotes"
                className="font-medium dark:text-gray-300"
              >
                Notes
              </Label>
              <Textarea
                id="labNotes"
                value={labNotes}
                onChange={(e) => setLabNotes(e.target.value)}
                placeholder="Additional notes about these lab results"
                className="min-h-[100px] mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default LabsTab;

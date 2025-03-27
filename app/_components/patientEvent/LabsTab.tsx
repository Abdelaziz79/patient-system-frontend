"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useState } from "react";
import RenderInputFields from "./RenderInputFields";

type LabIds =
  | "date"
  | "tlc"
  | "hb"
  | "plt"
  | "crp"
  | "urea"
  | "creat"
  | "na"
  | "k"
  | "ca"
  | "alt"
  | "ast"
  | "alb"
  | "ck"
  | "ckmb"
  | "trop"
  | "ph"
  | "co2"
  | "hco3"
  | "lactate"
  | "o2sat"
  | "pt"
  | "ptt"
  | "inr";

// Define types for lab test records
export interface LabTestRecord {
  date: string;
  tlc: string;
  hb: string;
  plt: string;
  crp: string;
  urea: string;
  creat: string;
  na: string;
  k: string;
  ca: string;
  alt: string;
  ast: string;
  alb: string;
  ck: string;
  ckmb: string;
  trop: string;
  ph: string;
  co2: string;
  hco3: string;
  lactate: string;
  o2sat: string;
  pt: string;
  ptt: string;
  inr: string;
}

// Define types for lab tests
export interface LabTest {
  id: LabIds;
  label: string;
  unit: string;
  category?: string;
}

// Unified Table Component for displaying all lab test history
function UnifiedLabHistoryTable({
  tests,
  history,
}: {
  tests: LabTest[];
  history: LabTestRecord[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-slate-700">
            <th className="border px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
              Date
            </th>
            {tests.map((test) => (
              <th
                key={test.id}
                className="border px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300"
                title={`${test.label} (${test.category})`}
              >
                {test.id.toUpperCase()} {test.unit ? `(${test.unit})` : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((record, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-white dark:bg-slate-800"
                    : "bg-gray-50 dark:bg-slate-700/50"
                }
              >
                <td className="border px-4 py-2 font-medium">
                  {format(new Date(record.date), "MMM dd, yyyy")}
                </td>
                {tests.map((test) => (
                  <td key={test.id} className="border px-4 py-2">
                    {record[test.id as keyof LabTestRecord] || "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={tests.length + 1}
                className="border px-4 py-2 text-center text-gray-500 dark:text-gray-400"
              >
                No lab records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function LabsTab() {
  // State for CBC and Inflammatory Markers
  const [tlc, setTlc] = useState("");
  const [hb, setHb] = useState("");
  const [plt, setPlt] = useState("");
  const [crp, setCrp] = useState("");

  // State for Chemistry Panel
  const [urea, setUrea] = useState("");
  const [creat, setCreat] = useState("");
  const [na, setNa] = useState("");
  const [k, setK] = useState("");
  const [ca, setCa] = useState("");
  const [alt, setAlt] = useState("");
  const [ast, setAst] = useState("");
  const [alb, setAlb] = useState("");

  // State for Cardiac Enzymes
  const [ck, setCk] = useState("");
  const [ckmb, setCkmb] = useState("");
  const [trop, setTrop] = useState("");

  // State for Arterial Blood Gas
  const [ph, setPh] = useState("");
  const [co2, setCo2] = useState("");
  const [hco3, setHco3] = useState("");
  const [lactate, setLactate] = useState("");
  const [o2sat, setO2sat] = useState("");

  // State for Coagulation
  const [pt, setPt] = useState("");
  const [ptt, setPtt] = useState("");
  const [inr, setInr] = useState("");

  // Additional notes
  const [labNotes, setLabNotes] = useState("");

  // Lab test history
  const [labTestHistory, setLabTestHistory] = useState<LabTestRecord[]>([
    {
      date: "2025-03-15",
      tlc: "7.5",
      hb: "13.8",
      plt: "250",
      crp: "2.1",
      urea: "25",
      creat: "0.9",
      na: "140",
      k: "4.2",
      ca: "9.5",
      alt: "30",
      ast: "28",
      alb: "4.2",
      ck: "120",
      ckmb: "3.2",
      trop: "0.01",
      ph: "7.38",
      co2: "40",
      hco3: "24",
      lactate: "1.2",
      o2sat: "98",
      pt: "12",
      ptt: "30",
      inr: "1.0",
    },
    {
      date: "2025-03-16",
      tlc: "8.2",
      hb: "13.5",
      plt: "245",
      crp: "2.5",
      urea: "26",
      creat: "1.0",
      na: "139",
      k: "4.0",
      ca: "9.4",
      alt: "32",
      ast: "30",
      alb: "4.1",
      ck: "125",
      ckmb: "3.5",
      trop: "0.02",
      ph: "7.40",
      co2: "38",
      hco3: "23",
      lactate: "1.3",
      o2sat: "97",
      pt: "12.5",
      ptt: "31",
      inr: "1.1",
    },
  ]);

  // Save new lab test record
  const saveLabTests = () => {
    const today = format(new Date(), "yyyy-MM-dd");

    const newLabRecord: LabTestRecord = {
      date: today,
      tlc,
      hb,
      plt,
      crp,
      urea,
      creat,
      na,
      k,
      ca,
      alt,
      ast,
      alb,
      ck,
      ckmb,
      trop,
      ph,
      co2,
      hco3,
      lactate,
      o2sat,
      pt,
      ptt,
      inr,
    };

    setLabTestHistory([...labTestHistory, newLabRecord]);

    // Clear form fields after saving
    setTlc("");
    setHb("");
    setPlt("");
    setCrp("");
    setUrea("");
    setCreat("");
    setNa("");
    setK("");
    setCa("");
    setAlt("");
    setAst("");
    setAlb("");
    setCk("");
    setCkmb("");
    setTrop("");
    setPh("");
    setCo2("");
    setHco3("");
    setLactate("");
    setO2sat("");
    setPt("");
    setPtt("");
    setInr("");
    setLabNotes("");
  };

  // Define lab tests for input form and history tables
  const cbcTests = [
    {
      id: "tlc",
      label: "TLC (Total Leukocyte Count)",
      value: tlc,
      onChange: (value: string) => setTlc(value),
      unit: "×10³/μL",
      category: "CBC and Inflammatory Markers",
    },
    {
      id: "hb",
      label: "Hb (Hemoglobin)",
      value: hb,
      onChange: (value: string) => setHb(value),
      unit: "g/dL",
      category: "CBC and Inflammatory Markers",
    },
    {
      id: "plt",
      label: "PLT (Platelets)",
      value: plt,
      onChange: (value: string) => setPlt(value),
      unit: "×10³/μL",
      category: "CBC and Inflammatory Markers",
    },
    {
      id: "crp",
      label: "CRP (C-Reactive Protein)",
      value: crp,
      onChange: (value: string) => setCrp(value),
      unit: "mg/L",
      category: "CBC and Inflammatory Markers",
    },
  ];

  const chemistryTests = [
    {
      id: "urea",
      label: "Urea",
      value: urea,
      onChange: (value: string) => setUrea(value),
      unit: "mg/dL",
      category: "Chemistry Panel",
    },
    {
      id: "creat",
      label: "Creatinine",
      value: creat,
      onChange: (value: string) => setCreat(value),
      unit: "mg/dL",
      category: "Chemistry Panel",
    },
    {
      id: "na",
      label: "Na (Sodium)",
      value: na,
      onChange: (value: string) => setNa(value),
      unit: "mEq/L",
      category: "Chemistry Panel",
    },
    {
      id: "k",
      label: "K (Potassium)",
      value: k,
      onChange: (value: string) => setK(value),
      unit: "mEq/L",
      category: "Chemistry Panel",
    },
    {
      id: "ca",
      label: "Ca (Calcium)",
      value: ca,
      onChange: (value: string) => setCa(value),
      unit: "mg/dL",
      category: "Chemistry Panel",
    },
    {
      id: "alt",
      label: "ALT (Alanine Transaminase)",
      value: alt,
      onChange: (value: string) => setAlt(value),
      unit: "U/L",
      category: "Chemistry Panel",
    },
    {
      id: "ast",
      label: "AST (Aspartate Transaminase)",
      value: ast,
      onChange: (value: string) => setAst(value),
      unit: "U/L",
      category: "Chemistry Panel",
    },
    {
      id: "alb",
      label: "Alb (Albumin)",
      value: alb,
      onChange: (value: string) => setAlb(value),
      unit: "g/dL",
      category: "Chemistry Panel",
    },
  ];

  const cardiacEnzymes = [
    {
      id: "ck",
      label: "CK (Creatine Kinase)",
      value: ck,
      onChange: (value: string) => setCk(value),
      unit: "U/L",
      category: "Cardiac Enzymes",
    },
    {
      id: "ckmb",
      label: "CK-MB",
      value: ckmb,
      onChange: (value: string) => setCkmb(value),
      unit: "ng/mL",
      category: "Cardiac Enzymes",
    },
    {
      id: "trop",
      label: "Troponin",
      value: trop,
      onChange: (value: string) => setTrop(value),
      unit: "ng/mL",
      category: "Cardiac Enzymes",
    },
  ];

  const abgTests = [
    {
      id: "ph",
      label: "pH",
      value: ph,
      onChange: (value: string) => setPh(value),
      unit: "",
      category: "Arterial Blood Gas",
    },
    {
      id: "co2",
      label: "CO₂",
      value: co2,
      onChange: (value: string) => setCo2(value),
      unit: "mmHg",
      category: "Arterial Blood Gas",
    },
    {
      id: "hco3",
      label: "HCO₃",
      value: hco3,
      onChange: (value: string) => setHco3(value),
      unit: "mEq/L",
      category: "Arterial Blood Gas",
    },
    {
      id: "lactate",
      label: "Lactate",
      value: lactate,
      onChange: (value: string) => setLactate(value),
      unit: "mmol/L",
      category: "Arterial Blood Gas",
    },
    {
      id: "o2sat",
      label: "O₂ Saturation",
      value: o2sat,
      onChange: (value: string) => setO2sat(value),
      unit: "%",
      category: "Arterial Blood Gas",
    },
  ];

  const coagulationTests = [
    {
      id: "pt",
      label: "PT (Prothrombin Time)",
      value: pt,
      onChange: (value: string) => setPt(value),
      unit: "sec",
      category: "Coagulation Profile",
    },
    {
      id: "ptt",
      label: "PTT (Partial Thromboplastin Time)",
      value: ptt,
      onChange: (value: string) => setPtt(value),
      unit: "sec",
      category: "Coagulation Profile",
    },
    {
      id: "inr",
      label: "INR (International Normalized Ratio)",
      value: inr,
      onChange: (value: string) => setInr(value),
      unit: "",
      category: "Coagulation Profile",
    },
  ];

  // Create a unified array of all test definitions for the table
  const allTestsForTable = [
    ...cbcTests,
    ...chemistryTests,
    ...cardiacEnzymes,
    ...abgTests,
    ...coagulationTests,
  ].map(({ id, label, unit, category }) => ({
    id,
    label,
    unit,
    category,
  }));

  // Define lab section components
  const labSections = [
    {
      id: "cbc",
      title: "CBC and Inflammatory Markers",
      tests: cbcTests,
    },
    {
      id: "chemistry",
      title: "Chemistry Panel",
      tests: chemistryTests,
    },
    {
      id: "cardiac",
      title: "Cardiac Enzymes",
      tests: cardiacEnzymes,
    },
    {
      id: "abg",
      title: "Arterial Blood Gas (ABG)",
      tests: abgTests,
    },
    {
      id: "coagulation",
      title: "Coagulation Profile",
      tests: coagulationTests,
    },
  ];

  return (
    <TabsContent value="labs" className="space-y-6 mt-4">
      {/* Lab Test Category Accordions */}
      <Accordion type="single" collapsible className="space-y-4">
        {labSections.map((section, index) => (
          <AccordionItem
            key={section.id}
            value={`item-${index + 1}`}
            className="border border-gray-200 dark:border-slate-600 rounded-md overflow-hidden shadow-sm bg-white dark:bg-slate-800"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700 text-left font-semibold text-lg text-primary dark:text-blue-300">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 pt-0 bg-white dark:bg-slate-800">
              <div className="space-y-6">
                {/* Input Fields */}
                <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                  <RenderInputFields tests={section.tests} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Unified History Table */}
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Lab History
          </h3>
          <UnifiedLabHistoryTable
            tests={allTestsForTable as LabTest[]}
            history={labTestHistory}
          />
        </CardContent>
      </Card>

      {/* Lab Notes */}
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="labNotes"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Lab Notes
            </Label>
            <Textarea
              value={labNotes}
              onChange={(e) => setLabNotes(e.target.value)}
              id="labNotes"
              placeholder="Enter notes about lab results"
              className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={saveLabTests}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Save Lab Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default LabsTab;

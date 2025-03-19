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
import LabHistoryTable from "./LabHistoryTable";
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

  // Default active sections
  // const [activeSection, setActiveSection] = useState("item-1");

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
    },
    {
      id: "hb",
      label: "Hb (Hemoglobin)",
      value: hb,
      onChange: (value: string) => setHb(value),
      unit: "g/dL",
    },
    {
      id: "plt",
      label: "PLT (Platelets)",
      value: plt,
      onChange: (value: string) => setPlt(value),
      unit: "×10³/μL",
    },
    {
      id: "crp",
      label: "CRP (C-Reactive Protein)",
      value: crp,
      onChange: (value: string) => setCrp(value),
      unit: "mg/L",
    },
  ];

  const chemistryTests = [
    {
      id: "urea",
      label: "Urea",
      value: urea,
      onChange: (value: string) => setUrea(value),
      unit: "mg/dL",
    },
    {
      id: "creat",
      label: "Creatinine",
      value: creat,
      onChange: (value: string) => setCreat(value),
      unit: "mg/dL",
    },
    {
      id: "na",
      label: "Na (Sodium)",
      value: na,
      onChange: (value: string) => setNa(value),
      unit: "mEq/L",
    },
    {
      id: "k",
      label: "K (Potassium)",
      value: k,
      onChange: (value: string) => setK(value),
      unit: "mEq/L",
    },
    {
      id: "ca",
      label: "Ca (Calcium)",
      value: ca,
      onChange: (value: string) => setCa(value),
      unit: "mg/dL",
    },
    {
      id: "alt",
      label: "ALT (Alanine Transaminase)",
      value: alt,
      onChange: (value: string) => setAlt(value),
      unit: "U/L",
    },
    {
      id: "ast",
      label: "AST (Aspartate Transaminase)",
      value: ast,
      onChange: (value: string) => setAst(value),
      unit: "U/L",
    },
    {
      id: "alb",
      label: "Alb (Albumin)",
      value: alb,
      onChange: (value: string) => setAlb(value),
      unit: "g/dL",
    },
  ];

  const cardiacEnzymes = [
    {
      id: "ck",
      label: "CK (Creatine Kinase)",
      value: ck,
      onChange: (value: string) => setCk(value),
      unit: "U/L",
    },
    {
      id: "ckmb",
      label: "CK-MB",
      value: ckmb,
      onChange: (value: string) => setCkmb(value),
      unit: "ng/mL",
    },
    {
      id: "trop",
      label: "Troponin",
      value: trop,
      onChange: (value: string) => setTrop(value),
      unit: "ng/mL",
    },
  ];

  const abgTests = [
    {
      id: "ph",
      label: "pH",
      value: ph,
      onChange: (value: string) => setPh(value),
      unit: "",
    },
    {
      id: "co2",
      label: "CO₂",
      value: co2,
      onChange: (value: string) => setCo2(value),
      unit: "mmHg",
    },
    {
      id: "hco3",
      label: "HCO₃",
      value: hco3,
      onChange: (value: string) => setHco3(value),
      unit: "mEq/L",
    },
    {
      id: "lactate",
      label: "Lactate",
      value: lactate,
      onChange: (value: string) => setLactate(value),
      unit: "mmol/L",
    },
    {
      id: "o2sat",
      label: "O₂ Saturation",
      value: o2sat,
      onChange: (value: string) => setO2sat(value),
      unit: "%",
    },
  ];

  const coagulationTests = [
    {
      id: "pt",
      label: "PT (Prothrombin Time)",
      value: pt,
      onChange: (value: string) => setPt(value),
      unit: "sec",
    },
    {
      id: "ptt",
      label: "PTT (Partial Thromboplastin Time)",
      value: ptt,
      onChange: (value: string) => setPtt(value),
      unit: "sec",
    },
    {
      id: "inr",
      label: "INR (International Normalized Ratio)",
      value: inr,
      onChange: (value: string) => setInr(value),
      unit: "",
    },
  ];

  // Formats for history tables
  const cbcTestsForTable = cbcTests.map(({ id, label, unit }) => ({
    id,
    label,
    unit,
  }));

  const chemistryTestsForTable = chemistryTests.map(({ id, label, unit }) => ({
    id,
    label,
    unit,
  }));

  const cardiacEnzymesForTable = cardiacEnzymes.map(({ id, label, unit }) => ({
    id,
    label,
    unit,
  }));

  const abgTestsForTable = abgTests.map(({ id, label, unit }) => ({
    id,
    label,
    unit,
  }));

  const coagulationTestsForTable = coagulationTests.map(
    ({ id, label, unit }) => ({ id, label, unit })
  );

  // Define lab section components
  const labSections = [
    {
      id: "cbc",
      title: "CBC and Inflammatory Markers",
      tests: cbcTests,
      tableTests: cbcTestsForTable,
    },
    {
      id: "chemistry",
      title: "Chemistry Panel",
      tests: chemistryTests,
      tableTests: chemistryTestsForTable,
    },
    {
      id: "cardiac",
      title: "Cardiac Enzymes",
      tests: cardiacEnzymes,
      tableTests: cardiacEnzymesForTable,
    },
    {
      id: "abg",
      title: "Arterial Blood Gas (ABG)",
      tests: abgTests,
      tableTests: abgTestsForTable,
    },
    {
      id: "coagulation",
      title: "Coagulation Profile",
      tests: coagulationTests,
      tableTests: coagulationTestsForTable,
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

                {/* History Table */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    History
                  </h4>
                  <LabHistoryTable
                    tests={section.tableTests as LabTest[]}
                    history={labTestHistory}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

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

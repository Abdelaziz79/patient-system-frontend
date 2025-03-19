"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import RenderInputFields from "./RenderInputFields";
import VitalsHistoryTable from "./VitalsHistoryTable";

// Define types for the vital sign records
export interface VitalSignRecord {
  date: string;
  hr: string;
  bp: string;
  temp: string;
  rr: string;
  o2Sat: string;
  gcs: string;
  rbs: string;
}

export interface FluidBalanceRecord {
  date: string;
  uop: string;
  intake: string;
  balance: string;
  cvp: string;
  ivc: string;
  diuretic: string;
}

function VitalsTab() {
  // Current vitals input state
  const [hr, setHr] = useState("");
  const [bp, setBp] = useState("");
  const [temp, setTemp] = useState("");
  const [rr, setRr] = useState("");
  const [o2Sat, setO2Sat] = useState("");
  const [gcs, setGcs] = useState("");
  const [rbs, setRbs] = useState("");

  // Current fluid balance input state
  const [uop, setUop] = useState("");
  const [intake, setIntake] = useState("");
  const [balance, setBalance] = useState("");
  const [cvp, setCvp] = useState("");
  const [ivc, setIvc] = useState("");
  const [diuretic, setDiuretic] = useState("");

  // Examination notes
  const [examination, setExamination] = useState("");

  // Historical records
  const [vitalSignHistory, setVitalSignHistory] = useState<VitalSignRecord[]>([
    {
      date: "2025-03-15",
      hr: "72",
      bp: "120/80",
      temp: "36.8",
      rr: "16",
      o2Sat: "98",
      gcs: "15",
      rbs: "105",
    },
    {
      date: "2025-03-16",
      hr: "75",
      bp: "118/78",
      temp: "37.0",
      rr: "17",
      o2Sat: "97",
      gcs: "15",
      rbs: "110",
    },
  ]);

  const [fluidBalanceHistory, setFluidBalanceHistory] = useState<
    FluidBalanceRecord[]
  >([
    {
      date: "2025-03-15",
      uop: "1200",
      intake: "1500",
      balance: "300",
      cvp: "8",
      ivc: "normal",
      diuretic: "0",
    },
    {
      date: "2025-03-16",
      uop: "1300",
      intake: "1600",
      balance: "300",
      cvp: "9",
      ivc: "normal",
      diuretic: "0",
    },
  ]);

  // Update fluid balance when either intake or uop changes
  useEffect(() => {
    const intakeValue = Number(intake) || 0;
    const uopValue = Number(uop) || 0;
    setBalance(String(intakeValue - uopValue));
  }, [intake, uop]);

  // Save new vital signs record
  const saveVitalSigns = () => {
    const today = format(new Date(), "yyyy-MM-dd");

    const newVitalRecord: VitalSignRecord = {
      date: today,
      hr,
      bp,
      temp,
      rr,
      o2Sat,
      gcs,
      rbs,
    };

    setVitalSignHistory([...vitalSignHistory, newVitalRecord]);

    // Clear form fields after saving
    setHr("");
    setBp("");
    setTemp("");
    setRr("");
    setO2Sat("");
    setGcs("");
    setRbs("");
  };

  // Save new fluid balance record
  const saveFluidBalance = () => {
    const today = format(new Date(), "yyyy-MM-dd");

    const newFluidRecord: FluidBalanceRecord = {
      date: today,
      uop,
      intake,
      balance,
      cvp,
      ivc,
      diuretic,
    };

    setFluidBalanceHistory([...fluidBalanceHistory, newFluidRecord]);

    // Clear form fields after saving
    setUop("");
    setIntake("");
    setBalance("");
    setCvp("");
    setIvc("");
    setDiuretic("");
  };

  // Define vital signs for input form
  const vitalSignsData = [
    {
      id: "hr",
      label: "HR (Heart Rate)",
      value: hr,
      onChange: (value: string) => setHr(value),
      unit: "bpm",
    },
    {
      id: "bp",
      label: "BP (Blood Pressure)",
      value: bp,
      onChange: (value: string) => setBp(value),
      unit: "mmHg",
    },
    {
      id: "temp",
      label: "Temperature",
      value: temp,
      onChange: (value: string) => setTemp(value),
      unit: "°C",
    },
    {
      id: "rr",
      label: "RR (Respiratory Rate)",
      value: rr,
      onChange: (value: string) => setRr(value),
      unit: "breaths/min",
    },
    {
      id: "o2Sat",
      label: "O₂ Saturation",
      value: o2Sat,
      onChange: (value: string) => setO2Sat(value),
      unit: "%",
    },
    {
      id: "gcs",
      label: "GCS (Glasgow Coma Scale)",
      value: gcs,
      onChange: (value: string) => setGcs(value),
      unit: "",
    },
    {
      id: "rbs",
      label: "RBS (Random Blood Sugar)",
      value: rbs,
      onChange: (value: string) => setRbs(value),
      unit: "mg/dL",
    },
  ];

  // Define fluid balance parameters for input form
  const fluidParametersData = [
    {
      id: "uop",
      label: "UOP (Urine Output)",
      value: uop,
      onChange: (value: string) => setUop(value),
      unit: "mL",
    },
    {
      id: "intake",
      label: "Fluid Intake",
      value: intake,
      onChange: (value: string) => setIntake(value),
      unit: "mL",
    },
    {
      id: "balance",
      label: "Fluid Balance",
      value: balance,
      onChange: () => {}, // Read-only
      unit: "mL",
    },
    {
      id: "cvp",
      label: "CVP (Central Venous Pressure)",
      value: cvp,
      onChange: (value: string) => setCvp(value),
      unit: "cmH₂O",
    },
    {
      id: "ivc",
      label: "IVC (Inferior Vena Cava)",
      value: ivc,
      onChange: (value: string) => setIvc(value),
      unit: "",
    },
    {
      id: "diuretic",
      label: "Diuretic",
      value: diuretic,
      onChange: (value: string) => setDiuretic(value),
      unit: "mg",
    },
  ];

  // Generate units map for vital signs and fluid balance
  const vitalSignUnits = vitalSignsData.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.unit }),
    {}
  );

  const fluidBalanceUnits = fluidParametersData.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.unit }),
    {}
  );

  return (
    <TabsContent value="vitals" className="space-y-6 mt-4">
      {/* Accordion for vital signs and fluid balance */}
      <Accordion type="single" collapsible className="space-y-4">
        {/* Vital Signs Section */}
        <AccordionItem
          value="item-1"
          className="border border-gray-200 dark:border-slate-600 rounded-md overflow-hidden shadow-sm bg-white dark:bg-slate-800"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700 text-left font-semibold text-lg text-primary dark:text-blue-300">
            Vital Signs
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 pt-0 bg-white dark:bg-slate-800">
            <div className="space-y-6">
              {/* Input Fields */}
              <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                <RenderInputFields tests={vitalSignsData} />
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={saveVitalSigns}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Save Vital Signs
                  </Button>
                </div>
              </div>

              {/* History Table */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  History
                </h4>
                <VitalsHistoryTable
                  headers={[
                    "Date",
                    "HR",
                    "BP",
                    "Temp",
                    "RR",
                    "O₂ Sat",
                    "GCS",
                    "RBS",
                  ]}
                  data={vitalSignHistory}
                  recordKeys={[
                    "date",
                    "hr",
                    "bp",
                    "temp",
                    "rr",
                    "o2Sat",
                    "gcs",
                    "rbs",
                  ]}
                  units={vitalSignUnits}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Fluid Balance Section */}
        <AccordionItem
          value="item-2"
          className="border border-gray-200 dark:border-slate-600 rounded-md overflow-hidden shadow-sm bg-white dark:bg-slate-800"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700 text-left font-semibold text-lg text-primary dark:text-blue-300">
            Fluid Balance & Other Parameters
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 pt-0 bg-white dark:bg-slate-800">
            <div className="space-y-6">
              {/* Input Fields */}
              <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                <RenderInputFields tests={fluidParametersData} />
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={saveFluidBalance}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Save Fluid Balance
                  </Button>
                </div>
              </div>

              {/* History Table */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  History
                </h4>
                <VitalsHistoryTable
                  headers={[
                    "Date",
                    "UOP",
                    "Intake",
                    "Balance",
                    "CVP",
                    "IVC",
                    "Diuretic",
                  ]}
                  data={fluidBalanceHistory}
                  recordKeys={[
                    "date",
                    "uop",
                    "intake",
                    "balance",
                    "cvp",
                    "ivc",
                    "diuretic",
                  ]}
                  units={fluidBalanceUnits}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Examination Notes Section */}
        <AccordionItem
          value="item-3"
          className="border border-gray-200 dark:border-slate-600 rounded-md overflow-hidden shadow-sm bg-white dark:bg-slate-800"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700 text-left font-semibold text-lg text-primary dark:text-blue-300">
            Examination Notes
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 pt-0 bg-white dark:bg-slate-800">
            <div className="space-y-4 border-t border-gray-100 dark:border-slate-700 pt-4">
              <div className="space-y-2">
                <Label
                  htmlFor="examination"
                  className="block font-medium text-sm dark:text-gray-300"
                >
                  Physical Examination Findings
                </Label>
                <Textarea
                  value={examination}
                  onChange={(e) => setExamination(e.target.value)}
                  id="examination"
                  placeholder="Enter detailed examination findings"
                  className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>
              <div className="flex justify-end">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Save Notes
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TabsContent>
  );
}

export default VitalsTab;

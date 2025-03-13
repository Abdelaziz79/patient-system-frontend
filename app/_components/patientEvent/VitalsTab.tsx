"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

function VitalsTab() {
  // Basic vitals
  const [hr, setHr] = useState("");
  const [bp, setBp] = useState("");
  const [temp, setTemp] = useState("");
  const [rr, setRr] = useState("");
  const [o2Sat, setO2Sat] = useState("");
  const [gcs, setGcs] = useState("");
  const [rbs, setRbs] = useState("");

  // Fluid balance parameters
  const [uop, setUop] = useState("");
  const [intake, setIntake] = useState("");
  const [balance, setBalance] = useState("");
  const [cvp, setCvp] = useState("");
  const [ivc, setIvc] = useState("");
  const [diuretic, setDiuretic] = useState("");

  // Additional fields
  const [examination, setExamination] = useState("");

  // Update fluid balance when either intake or uop changes
  const updateFluidBalance = () => {
    const intakeValue = Number(intake) || 0;
    const uopValue = Number(uop) || 0;
    setBalance(String(intakeValue - uopValue));
  };

  // Define vital signs for cleaner rendering
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

  // Define fluid balance parameters
  const fluidParametersData = [
    {
      id: "uop",
      label: "UOP (Urine Output)",
      value: uop,
      onChange: (value: string) => {
        setUop(value);
        updateFluidBalance();
      },
      unit: "mL",
    },
    {
      id: "intake",
      label: "Fluid Intake",
      value: intake,
      onChange: (value: string) => {
        setIntake(value);
        updateFluidBalance();
      },
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

  return (
    <TabsContent value="vitals" className="space-y-6 mt-4">
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Vital Signs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vitalSignsData.map((sign) => (
              <div
                key={sign.id}
                className="flex flex-col space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor={sign.id}
                    className="font-medium text-sm dark:text-gray-300"
                  >
                    {sign.label}
                  </Label>
                  <div className="flex">
                    <Input
                      id={sign.id}
                      value={sign.value}
                      onChange={(e) => sign.onChange(e.target.value)}
                      placeholder={`Enter ${sign.label}`}
                      className="focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
                    />
                    {sign.unit && (
                      <span className="ml-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {sign.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Fluid Balance & Other Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fluidParametersData.map((param) => (
              <div
                key={param.id}
                className="flex flex-col space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor={param.id}
                    className="font-medium text-sm dark:text-gray-300"
                  >
                    {param.label}
                  </Label>
                  <div className="flex">
                    <Input
                      id={param.id}
                      value={param.value}
                      onChange={(e) => param.onChange(e.target.value)}
                      placeholder={`Enter ${param.label}`}
                      className="focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
                    />
                    {param.unit && (
                      <span className="ml-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {param.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="examination"
              className="block font-medium text-sm dark:text-gray-300"
            >
              Examination Notes
            </Label>
            <Textarea
              value={examination}
              onChange={(e) => setExamination(e.target.value)}
              id="examination"
              placeholder="Enter detailed examination findings"
              className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default VitalsTab;

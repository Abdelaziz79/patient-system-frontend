"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";

function VitalSignsExaminationTab() {
  // States for vital signs
  const [rbs, setRbs] = useState("");
  const [o2Sat, setO2Sat] = useState("");
  const [hr, setHr] = useState("");
  const [bp, setBp] = useState("");
  const [temp, setTemp] = useState("");
  const [gcs, setGcs] = useState("");
  const [rr, setRr] = useState("");
  const [uop, setUop] = useState("");
  const [intake, setIntake] = useState("");
  const [balance, setBalance] = useState("");
  const [cvp, setCvp] = useState("");
  const [ivc, setIvc] = useState("");
  const [diuretic, setDiuretic] = useState("");

  // Define vital signs for cleaner rendering
  const vitalSigns = [
    {
      id: "rbs",
      label: "RBS (Random Blood Sugar)",
      state: rbs,
      setState: setRbs,
      unit: "mg/dL",
    },
    {
      id: "o2Sat",
      label: "O₂ Saturation",
      state: o2Sat,
      setState: setO2Sat,
      unit: "%",
    },
    {
      id: "hr",
      label: "HR (Heart Rate)",
      state: hr,
      setState: setHr,
      unit: "bpm",
    },
    {
      id: "bp",
      label: "BP (Blood Pressure)",
      state: bp,
      setState: setBp,
      unit: "mmHg",
    },
    {
      id: "temp",
      label: "Temperature",
      state: temp,
      setState: setTemp,
      unit: "°C",
    },
    {
      id: "gcs",
      label: "GCS (Glasgow Coma Scale)",
      state: gcs,
      setState: setGcs,
      unit: "",
    },
    {
      id: "rr",
      label: "RR (Respiratory Rate)",
      state: rr,
      setState: setRr,
      unit: "breaths/min",
    },
  ];

  // Define fluid balance parameters
  const fluidParameters = [
    {
      id: "uop",
      label: "UOP (Urine Output)",
      state: uop,
      setState: setUop,
      unit: "mL",
    },
    {
      id: "intake",
      label: "Fluid Intake",
      state: intake,
      setState: setIntake,
      unit: "mL",
    },
    {
      id: "balance",
      label: "Fluid Balance",
      state: balance,
      setState: setBalance,
      unit: "mL",
    },
    {
      id: "cvp",
      label: "CVP (Central Venous Pressure)",
      state: cvp,
      setState: setCvp,
      unit: "cmH₂O",
    },
    {
      id: "ivc",
      label: "IVC (Inferior Vena Cava)",
      state: ivc,
      setState: setIvc,
      unit: "",
    },
    {
      id: "diuretic",
      label: "Diuretic",
      state: diuretic,
      setState: setDiuretic,
      unit: "mg",
    },
  ];

  return (
    <TabsContent value="vitalsigns" className="space-y-6 mt-4">
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Vital Signs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vitalSigns.map((sign) => (
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
                      value={sign.state}
                      onChange={(e) => sign.setState(e.target.value)}
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
            {fluidParameters.map((param) => (
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
                      value={param.state}
                      onChange={(e) => param.setState(e.target.value)}
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

export default VitalSignsExaminationTab;

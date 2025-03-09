"use client";

import { useVitalSigns } from "@/app/_contexts/NewPatientContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

function VitalSignsExaminationTab() {
  const { vitalSigns, updateVitalSign } = useVitalSigns();
  // Define vital signs for cleaner rendering
  const vitalSignsMap = [
    {
      id: "rbs",
      label: "RBS (Random Blood Sugar)",
      state: vitalSigns.rbs,
      setState: (value: string) => updateVitalSign("rbs", value),
      unit: "mg/dL",
    },
    {
      id: "o2Sat",
      label: "O₂ Saturation",
      state: vitalSigns.o2Sat,
      setState: (value: string) => updateVitalSign("o2Sat", value),
      unit: "%",
    },
    {
      id: "hr",
      label: "HR (Heart Rate)",
      state: vitalSigns.hr,
      setState: (value: string) => updateVitalSign("hr", value),
      unit: "bpm",
    },
    {
      id: "bp",
      label: "BP (Blood Pressure)",
      state: vitalSigns.bp,
      setState: (value: string) => updateVitalSign("bp", value),
      unit: "mmHg",
    },
    {
      id: "temp",
      label: "Temperature",
      state: vitalSigns.temp,
      setState: (value: string) => updateVitalSign("temp", value),
      unit: "°C",
    },
    {
      id: "gcs",
      label: "GCS (Glasgow Coma Scale)",
      state: vitalSigns.gcs,
      setState: (value: string) => updateVitalSign("gcs", value),
      unit: "",
    },
    {
      id: "rr",
      label: "RR (Respiratory Rate)",
      state: vitalSigns.rr,
      setState: (value: string) => updateVitalSign("rr", value),
      unit: "breaths/min",
    },
  ];

  // Define fluid balance parameters
  const fluidParameters = [
    {
      id: "uop",
      label: "UOP (Urine Output)",
      state: vitalSigns.uop,
      setState: (value: string) => updateVitalSign("uop", value),
      unit: "mL",
    },
    {
      id: "intake",
      label: "Fluid Intake",
      state: vitalSigns.intake,
      setState: (value: string) => updateVitalSign("intake", value),
      unit: "mL",
    },
    {
      id: "balance",
      label: "Fluid Balance",
      state: vitalSigns.balance,
      setState: (value: string) => updateVitalSign("balance", value),
      unit: "mL",
    },
    {
      id: "cvp",
      label: "CVP (Central Venous Pressure)",
      state: vitalSigns.cvp,
      setState: (value: string) => updateVitalSign("cvp", value),
      unit: "cmH₂O",
    },
    {
      id: "ivc",
      label: "IVC (Inferior Vena Cava)",
      state: vitalSigns.ivc,
      setState: (value: string) => updateVitalSign("ivc", value),
      unit: "",
    },
    {
      id: "diuretic",
      label: "Diuretic",
      state: vitalSigns.diuretic,
      setState: (value: string) => updateVitalSign("diuretic", value),
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
            {vitalSignsMap.map((sign) => (
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
              value={vitalSigns.examination}
              onChange={(e) => updateVitalSign("examination", e.target.value)}
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

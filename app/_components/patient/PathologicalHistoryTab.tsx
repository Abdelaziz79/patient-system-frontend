"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";

function PathologicalHistoryTab() {
  // States for medical conditions
  const [htn, setHtn] = useState(false);
  const [dm, setDm] = useState(false);
  const [ihd, setIhd] = useState(false);
  const [hf, setHf] = useState(false);
  const [arrhythmia, setArrhythmia] = useState(false);
  const [liver, setLiver] = useState(false);
  const [kidney, setKidney] = useState(false);
  const [chest, setChest] = useState(false);
  const [thyroid, setThyroid] = useState(false);
  const [cns, setCns] = useState(false);
  const [cancer, setCancer] = useState(false);
  const [surgery, setSurgery] = useState(false);

  // Define the medical conditions for cleaner rendering
  const medicalConditions = [
    { id: "htn", label: "HTN (Hypertension)", state: htn, setState: setHtn },
    { id: "dm", label: "DM (Diabetes Mellitus)", state: dm, setState: setDm },
    {
      id: "ihd",
      label: "IHD (Ischemic Heart Disease)",
      state: ihd,
      setState: setIhd,
    },
    { id: "hf", label: "HF (Heart Failure)", state: hf, setState: setHf },
    {
      id: "arrhythmia",
      label: "Arrhythmia",
      state: arrhythmia,
      setState: setArrhythmia,
    },
    { id: "liver", label: "Liver Disease", state: liver, setState: setLiver },
    {
      id: "kidney",
      label: "Kidney Disease",
      state: kidney,
      setState: setKidney,
    },
    {
      id: "chest",
      label: "Chest/Respiratory Disease",
      state: chest,
      setState: setChest,
    },
    {
      id: "thyroid",
      label: "Thyroid Disease",
      state: thyroid,
      setState: setThyroid,
    },
    {
      id: "cns",
      label: "CNS (Central Nervous System) Disease",
      state: cns,
      setState: setCns,
    },
    { id: "cancer", label: "Cancer", state: cancer, setState: setCancer },
    {
      id: "surgery",
      label: "Previous Surgery",
      state: surgery,
      setState: setSurgery,
    },
  ];

  return (
    <TabsContent value="pathological" className="space-y-6 mt-4">
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6 ">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Medical History
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicalConditions.map((condition) => (
              <div
                key={condition.id}
                className="flex flex-col space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80"
              >
                <div className="flex items-center space-x-3">
                  <Switch
                    id={condition.id}
                    checked={condition.state}
                    onCheckedChange={condition.setState}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-500"
                  />
                  <Label
                    htmlFor={condition.id}
                    className="font-medium text-sm dark:text-gray-300"
                  >
                    {condition.label}
                  </Label>
                </div>

                {condition.state && (
                  <div className="pt-1">
                    <Input
                      id={`${condition.id}-note`}
                      placeholder={`Notes about ${condition.label}`}
                      className="focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="others"
              className="block font-medium text-sm dark:text-gray-300"
            >
              Other Medical Conditions
            </Label>
            <Textarea
              id="others"
              placeholder="Enter other medical conditions"
              className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
            />
          </div>

          <div className="space-y-2 pt-2">
            <Label
              htmlFor="complaints"
              className="block font-medium text-sm dark:text-gray-300"
            >
              Complaints
            </Label>
            <Textarea
              id="complaints"
              placeholder="Enter patient complaints"
              className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default PathologicalHistoryTab;

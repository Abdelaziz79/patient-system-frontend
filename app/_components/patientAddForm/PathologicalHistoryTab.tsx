"use client";

import {
  useMedicalConditions,
  useMedicalNotes,
} from "@/app/_contexts/NewPatientContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

function PathologicalHistoryTab() {
  const {
    medicalConditions: {
      htn,
      dm,
      ihd,
      hf,
      arrhythmia,
      liver,
      kidney,
      chest,
      thyroid,
      cns,
      cancer,
      surgery,
    },
    updateMedicalCondition,
  } = useMedicalConditions();
  const {
    medicalNotes: {
      htnNotes,
      dmNotes,
      ihdNotes,
      hfNotes,
      arrhythmiaNotes,
      liverNotes,
      kidneyNotes,
      chestNotes,
      thyroidNotes,
      cnsNotes,
      cancerNotes,
      surgeryNotes,
      others,
      complaints,
    },
    updateMedicalNote,
  } = useMedicalNotes();
  // States for medical conditions

  // Define the medical conditions for cleaner rendering
  const medicalConditions = [
    {
      id: "htn",
      label: "HTN (Hypertension)",
      state: htn,
      setState: (value: boolean) => updateMedicalCondition("htn", value),
    },
    {
      id: "dm",
      label: "DM (Diabetes Mellitus)",
      state: dm,
      setState: (value: boolean) => updateMedicalCondition("dm", value),
    },
    {
      id: "ihd",
      label: "IHD (Ischemic Heart Disease)",
      state: ihd,
      setState: (value: boolean) => updateMedicalCondition("ihd", value),
    },
    {
      id: "hf",
      label: "HF (Heart Failure)",
      state: hf,
      setState: (value: boolean) => updateMedicalCondition("hf", value),
    },
    {
      id: "arrhythmia",
      label: "Arrhythmia",
      state: arrhythmia,
      setState: (value: boolean) => updateMedicalCondition("arrhythmia", value),
    },
    {
      id: "liver",
      label: "Liver Disease",
      state: liver,
      setState: (value: boolean) => updateMedicalCondition("liver", value),
    },
    {
      id: "kidney",
      label: "Kidney Disease",
      state: kidney,
      setState: (value: boolean) => updateMedicalCondition("kidney", value),
    },
    {
      id: "chest",
      label: "Chest/Respiratory Disease",
      state: chest,
      setState: (value: boolean) => updateMedicalCondition("chest", value),
    },
    {
      id: "thyroid",
      label: "Thyroid Disease",
      state: thyroid,
      setState: (value: boolean) => updateMedicalCondition("thyroid", value),
    },
    {
      id: "cns",
      label: "CNS (Central Nervous System) Disease",
      state: cns,
      setState: (value: boolean) => updateMedicalCondition("cns", value),
    },
    {
      id: "cancer",
      label: "Cancer",
      state: cancer,
      setState: (value: boolean) => updateMedicalCondition("cancer", value),
    },
    {
      id: "surgery",
      label: "Previous Surgery",
      state: surgery,
      setState: (value: boolean) => updateMedicalCondition("surgery", value),
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
                      value={
                        condition.id === "htn"
                          ? htnNotes
                          : condition.id === "dm"
                          ? dmNotes
                          : condition.id === "ihd"
                          ? ihdNotes
                          : condition.id === "hf"
                          ? hfNotes
                          : condition.id === "arrhythmia"
                          ? arrhythmiaNotes
                          : condition.id === "liver"
                          ? liverNotes
                          : condition.id === "kidney"
                          ? kidneyNotes
                          : condition.id === "chest"
                          ? chestNotes
                          : condition.id === "thyroid"
                          ? thyroidNotes
                          : condition.id === "cns"
                          ? cnsNotes
                          : condition.id === "cancer"
                          ? cancerNotes
                          : surgeryNotes
                      }
                      onChange={(e) =>
                        condition.id === "htn"
                          ? updateMedicalNote("htnNotes", e.target.value)
                          : condition.id === "dm"
                          ? updateMedicalNote("dmNotes", e.target.value)
                          : condition.id === "ihd"
                          ? updateMedicalNote("ihdNotes", e.target.value)
                          : condition.id === "hf"
                          ? updateMedicalNote("hfNotes", e.target.value)
                          : condition.id === "arrhythmia"
                          ? updateMedicalNote("arrhythmiaNotes", e.target.value)
                          : condition.id === "liver"
                          ? updateMedicalNote("liverNotes", e.target.value)
                          : condition.id === "kidney"
                          ? updateMedicalNote("kidneyNotes", e.target.value)
                          : condition.id === "chest"
                          ? updateMedicalNote("chestNotes", e.target.value)
                          : condition.id === "thyroid"
                          ? updateMedicalNote("thyroidNotes", e.target.value)
                          : condition.id === "cns"
                          ? updateMedicalNote("cnsNotes", e.target.value)
                          : condition.id === "cancer"
                          ? updateMedicalNote("cancerNotes", e.target.value)
                          : updateMedicalNote("surgeryNotes", e.target.value)
                      }
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
              value={others}
              onChange={(e) => updateMedicalNote("others", e.target.value)}
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
              value={complaints}
              onChange={(e) => updateMedicalNote("complaints", e.target.value)}
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

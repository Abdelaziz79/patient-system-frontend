"use client";

import {
  useImagingResults,
  useLabResults,
} from "@/app/_contexts/NewPatientContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type Test = {
  id: string;
  label: string;
  state: string;
  setState: (value: string) => void;
  unit?: string;
};

function LabImagingTab() {
  const {
    labResults: {
      alb,
      alt,
      ast,
      ca,
      ck,
      ckmb,
      co2,
      creat,
      crp,
      hb,
      hco3,
      inr,
      k,
      lactate,
      na,
      o2sat,
      ph,
      plt,
      pt,
      ptt,
      trop,
      urea,
      tlc,
    },
    updateLabResult,
  } = useLabResults();

  const {
    imagingResults: {
      ctBrain,
      ctChest,
      cxr,
      us,
      dupplex,
      ecg,
      echo,
      mpi,
      ctAngio,
      others,
    },
    updateImagingResult,
  } = useImagingResults();
  // Define lab tests for cleaner rendering
  const cbcTests = [
    {
      id: "tlc",
      label: "TLC (Total Leukocyte Count)",
      state: tlc,
      setState: (value: string) => updateLabResult("tlc", value),
      unit: "×10³/μL",
    },
    {
      id: "hb",
      label: "Hb (Hemoglobin)",
      state: hb,
      setState: (value: string) => updateLabResult("hb", value),
      unit: "g/dL",
    },
    {
      id: "plt",
      label: "PLT (Platelets)",
      state: plt,
      setState: (value: string) => updateLabResult("plt", value),
      unit: "×10³/μL",
    },
    {
      id: "crp",
      label: "CRP (C-Reactive Protein)",
      state: crp,
      setState: (value: string) => updateLabResult("crp", value),
      unit: "mg/L",
    },
  ];

  const chemistryTests = [
    {
      id: "urea",
      label: "Urea",
      state: urea,
      setState: (value: string) => updateLabResult("urea", value),
      unit: "mg/dL",
    },
    {
      id: "creat",
      label: "Creatinine",
      state: creat,
      setState: (value: string) => updateLabResult("creat", value),
      unit: "mg/dL",
    },
    {
      id: "na",
      label: "Na (Sodium)",
      state: na,
      setState: (value: string) => updateLabResult("na", value),
      unit: "mEq/L",
    },
    {
      id: "k",
      label: "K (Potassium)",
      state: k,
      setState: (value: string) => updateLabResult("k", value),
      unit: "mEq/L",
    },
    {
      id: "ca",
      label: "Ca (Calcium)",
      state: ca,
      setState: (value: string) => updateLabResult("ca", value),
      unit: "mg/dL",
    },
    {
      id: "alt",
      label: "ALT (Alanine Transaminase)",
      state: alt,
      setState: (value: string) => updateLabResult("alt", value),
      unit: "U/L",
    },
    {
      id: "ast",
      label: "AST (Aspartate Transaminase)",
      state: ast,
      setState: (value: string) => updateLabResult("ast", value),
      unit: "U/L",
    },
    {
      id: "alb",
      label: "Alb (Albumin)",
      state: alb,
      setState: (value: string) => updateLabResult("alb", value),
      unit: "g/dL",
    },
  ];

  const cardiacEnzymes = [
    {
      id: "ck",
      label: "CK (Creatine Kinase)",
      state: ck,
      setState: (value: string) => updateLabResult("ck", value),
      unit: "U/L",
    },
    {
      id: "ckmb",
      label: "CK-MB",
      state: ckmb,
      setState: (value: string) => updateLabResult("ckmb", value),
      unit: "ng/mL",
    },
    {
      id: "trop",
      label: "Troponin",
      state: trop,
      setState: (value: string) => updateLabResult("trop", value),
      unit: "ng/mL",
    },
  ];

  const abgTests = [
    {
      id: "ph",
      label: "pH",
      state: ph,
      setState: (value: string) => updateLabResult("ph", value),
      unit: "",
    },
    {
      id: "co2",
      label: "CO₂",
      state: co2,
      setState: (value: string) => updateLabResult("co2", value),
      unit: "mmHg",
    },
    {
      id: "hco3",
      label: "HCO₃",
      state: hco3,
      setState: (value: string) => updateLabResult("hco3", value),
      unit: "mEq/L",
    },
    {
      id: "lactate",
      label: "Lactate",
      state: lactate,
      setState: (value: string) => updateLabResult("lactate", value),
      unit: "mmol/L",
    },
    {
      id: "o2sat",
      label: "O₂ Saturation",
      state: o2sat,
      setState: (value: string) => updateLabResult("o2sat", value),
      unit: "%",
    },
  ];

  const coagulationTests = [
    {
      id: "pt",
      label: "PT (Prothrombin Time)",
      state: pt,
      setState: (value: string) => updateLabResult("pt", value),
      unit: "sec",
    },
    {
      id: "ptt",
      label: "PTT (Partial Thromboplastin Time)",
      state: ptt,
      setState: (value: string) => updateLabResult("ptt", value),
      unit: "sec",
    },
    {
      id: "inr",
      label: "INR (International Normalized Ratio)",
      state: inr,
      setState: (value: string) => updateLabResult("inr", value),
      unit: "",
    },
  ];

  // Define imaging studies
  const imagingStudies = [
    {
      id: "ctBrain",
      label: "CT Brain",
      state: ctBrain,
      setState: (value: string) => updateImagingResult("ctBrain", value),
    },
    {
      id: "ctChest",
      label: "CT Chest",
      state: ctChest,
      setState: (value: string) => updateImagingResult("ctChest", value),
    },
    {
      id: "cxr",
      label: "CXR (Chest X-Ray)",
      state: cxr,
      setState: (value: string) => updateImagingResult("cxr", value),
    },
    {
      id: "us",
      label: "U/S (Ultrasound)",
      state: us,
      setState: (value: string) => updateImagingResult("us", value),
    },
    {
      id: "dupplex",
      label: "Duplex",
      state: dupplex,
      setState: (value: string) => updateImagingResult("dupplex", value),
    },
    {
      id: "ecg",
      label: "ECG",
      state: ecg,
      setState: (value: string) => updateImagingResult("ecg", value),
    },
    {
      id: "echo",
      label: "ECHO",
      state: echo,
      setState: (value: string) => updateImagingResult("echo", value),
    },
    {
      id: "mpi",
      label: "MPI (Myocardial Perfusion Imaging)",
      state: mpi,
      setState: (value: string) => updateImagingResult("mpi", value),
    },
    {
      id: "ctAngio",
      label: "CT Angiography",
      state: ctAngio,
      setState: (value: string) => updateImagingResult("ctAngio", value),
    },
  ];

  // Render input fields for a group of tests
  const renderTestGroup = (testGroup: Test[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {testGroup.map((test) => (
        <div
          key={test.id}
          className="flex flex-col space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80"
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
                value={test.state}
                onChange={(e) => test.setState(e.target.value)}
                placeholder={`Enter ${test.label}`}
                className="focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
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
    <TabsContent value="labimaging" className="space-y-6 mt-4">
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Laboratory Tests
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium text-base dark:text-gray-200">
                CBC and Inflammatory Markers
              </h4>
              {renderTestGroup(cbcTests)}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-base dark:text-gray-200">
                Chemistry Panel
              </h4>
              {renderTestGroup(chemistryTests)}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-base dark:text-gray-200">
                Cardiac Enzymes
              </h4>
              {renderTestGroup(cardiacEnzymes)}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-base dark:text-gray-200">
                Arterial Blood Gas (ABG)
              </h4>
              {renderTestGroup(abgTests)}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-base dark:text-gray-200">
                Coagulation Profile
              </h4>
              {renderTestGroup(coagulationTests)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Imaging Studies
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imagingStudies.map((study) => (
              <div
                key={study.id}
                className="flex flex-col space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor={study.id}
                    className="font-medium text-sm dark:text-gray-300"
                  >
                    {study.label}
                  </Label>
                  <Textarea
                    id={study.id}
                    value={study.state}
                    onChange={(e) => study.setState(e.target.value)}
                    placeholder={`Enter ${study.label} findings`}
                    className="h-20 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="space-y-2">
              <Label
                htmlFor="others"
                className="font-medium text-sm dark:text-gray-300"
              >
                Other Imaging Studies
              </Label>
              <Textarea
                id="others"
                value={others}
                onChange={(e) => updateImagingResult("others", e.target.value)}
                placeholder="Enter any additional imaging studies and findings"
                className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default LabImagingTab;

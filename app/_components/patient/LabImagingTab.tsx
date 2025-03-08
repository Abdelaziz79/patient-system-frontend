"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

type Test = {
  id: string;
  label: string;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  unit?: string;
};

function LabImagingTab() {
  // States for lab results - CBC
  const [tlc, setTlc] = useState("");
  const [hb, setHb] = useState("");
  const [plt, setPlt] = useState("");
  const [crp, setCrp] = useState("");

  // States for lab results - Chemistry
  const [urea, setUrea] = useState("");
  const [creat, setCreat] = useState("");
  const [na, setNa] = useState("");
  const [k, setK] = useState("");
  const [ca, setCa] = useState("");
  const [alt, setAlt] = useState("");
  const [ast, setAst] = useState("");
  const [alb, setAlb] = useState("");

  // States for lab results - Cardiac enzymes
  const [ck, setCk] = useState("");
  const [ckmb, setCkmb] = useState("");
  const [trop, setTrop] = useState("");

  // States for lab results - ABG
  const [ph, setPh] = useState("");
  const [co2, setCo2] = useState("");
  const [hco3, setHco3] = useState("");
  const [lactate, setLactate] = useState("");
  const [o2sat, setO2sat] = useState("");

  // States for lab results - Coagulation
  const [pt, setPt] = useState("");
  const [ptt, setPtt] = useState("");
  const [inr, setInr] = useState("");

  // States for imaging results
  const [ctBrain, setCtBrain] = useState("");
  const [ctChest, setCtChest] = useState("");
  const [cxr, setCxr] = useState("");
  const [us, setUs] = useState("");
  const [dupplex, setDupplex] = useState("");
  const [ecg, setEcg] = useState("");
  const [echo, setEcho] = useState("");
  const [mpi, setMpi] = useState("");
  const [ctAngio, setCtAngio] = useState("");
  const [others, setOthers] = useState("");

  // Define lab tests for cleaner rendering
  const cbcTests = [
    {
      id: "tlc",
      label: "TLC (Total Leukocyte Count)",
      state: tlc,
      setState: setTlc,
      unit: "×10³/μL",
    },
    {
      id: "hb",
      label: "Hb (Hemoglobin)",
      state: hb,
      setState: setHb,
      unit: "g/dL",
    },
    {
      id: "plt",
      label: "PLT (Platelets)",
      state: plt,
      setState: setPlt,
      unit: "×10³/μL",
    },
    {
      id: "crp",
      label: "CRP (C-Reactive Protein)",
      state: crp,
      setState: setCrp,
      unit: "mg/L",
    },
  ];

  const chemistryTests = [
    {
      id: "urea",
      label: "Urea",
      state: urea,
      setState: setUrea,
      unit: "mg/dL",
    },
    {
      id: "creat",
      label: "Creatinine",
      state: creat,
      setState: setCreat,
      unit: "mg/dL",
    },
    {
      id: "na",
      label: "Na (Sodium)",
      state: na,
      setState: setNa,
      unit: "mEq/L",
    },
    {
      id: "k",
      label: "K (Potassium)",
      state: k,
      setState: setK,
      unit: "mEq/L",
    },
    {
      id: "ca",
      label: "Ca (Calcium)",
      state: ca,
      setState: setCa,
      unit: "mg/dL",
    },
    {
      id: "alt",
      label: "ALT (Alanine Transaminase)",
      state: alt,
      setState: setAlt,
      unit: "U/L",
    },
    {
      id: "ast",
      label: "AST (Aspartate Transaminase)",
      state: ast,
      setState: setAst,
      unit: "U/L",
    },
    {
      id: "alb",
      label: "Alb (Albumin)",
      state: alb,
      setState: setAlb,
      unit: "g/dL",
    },
  ];

  const cardiacEnzymes = [
    {
      id: "ck",
      label: "CK (Creatine Kinase)",
      state: ck,
      setState: setCk,
      unit: "U/L",
    },
    {
      id: "ckmb",
      label: "CK-MB",
      state: ckmb,
      setState: setCkmb,
      unit: "ng/mL",
    },
    {
      id: "trop",
      label: "Troponin",
      state: trop,
      setState: setTrop,
      unit: "ng/mL",
    },
  ];

  const abgTests = [
    {
      id: "ph",
      label: "pH",
      state: ph,
      setState: setPh,
      unit: "",
    },
    {
      id: "co2",
      label: "CO₂",
      state: co2,
      setState: setCo2,
      unit: "mmHg",
    },
    {
      id: "hco3",
      label: "HCO₃",
      state: hco3,
      setState: setHco3,
      unit: "mEq/L",
    },
    {
      id: "lactate",
      label: "Lactate",
      state: lactate,
      setState: setLactate,
      unit: "mmol/L",
    },
    {
      id: "o2sat",
      label: "O₂ Saturation",
      state: o2sat,
      setState: setO2sat,
      unit: "%",
    },
  ];

  const coagulationTests = [
    {
      id: "pt",
      label: "PT (Prothrombin Time)",
      state: pt,
      setState: setPt,
      unit: "sec",
    },
    {
      id: "ptt",
      label: "PTT (Partial Thromboplastin Time)",
      state: ptt,
      setState: setPtt,
      unit: "sec",
    },
    {
      id: "inr",
      label: "INR (International Normalized Ratio)",
      state: inr,
      setState: setInr,
      unit: "",
    },
  ];

  // Define imaging studies
  const imagingStudies = [
    {
      id: "ctBrain",
      label: "CT Brain",
      state: ctBrain,
      setState: setCtBrain,
    },
    {
      id: "ctChest",
      label: "CT Chest",
      state: ctChest,
      setState: setCtChest,
    },
    {
      id: "cxr",
      label: "CXR (Chest X-Ray)",
      state: cxr,
      setState: setCxr,
    },
    {
      id: "us",
      label: "U/S (Ultrasound)",
      state: us,
      setState: setUs,
    },
    {
      id: "dupplex",
      label: "Duplex",
      state: dupplex,
      setState: setDupplex,
    },
    {
      id: "ecg",
      label: "ECG",
      state: ecg,
      setState: setEcg,
    },
    {
      id: "echo",
      label: "ECHO",
      state: echo,
      setState: setEcho,
    },
    {
      id: "mpi",
      label: "MPI (Myocardial Perfusion Imaging)",
      state: mpi,
      setState: setMpi,
    },
    {
      id: "ctAngio",
      label: "CT Angiography",
      state: ctAngio,
      setState: setCtAngio,
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
                onChange={(e) => setOthers(e.target.value)}
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

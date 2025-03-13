"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import DatePicker from "../DatePicker";

function ImagingTab() {
  // Date state
  const [imagingDate, setImagingDate] = useState<Date | undefined>(new Date());

  // Imaging study states
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

  // Define imaging studies for consistent structure with LabImagingTab
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

  return (
    <TabsContent value="imaging">
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Imaging Results
          </h3>

          <div className="mb-4 flex items-center gap-2">
            <Label htmlFor="imagingDate" className="font-medium">
              Date Performed
            </Label>

            <DatePicker date={imagingDate} setDate={setImagingDate} />
          </div>

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

export default ImagingTab;

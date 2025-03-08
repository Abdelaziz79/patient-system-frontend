"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

function DiagnosisTreatmentTab() {
  // States for diagnosis and treatment
  const [diagnosis, setDiagnosis] = useState("");
  const [differentialDiagnosis, setDifferentialDiagnosis] = useState("");
  const [treatmentApproach, setTreatmentApproach] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [ivFluids, setIvFluids] = useState("");
  const [antibiotics, setAntibiotics] = useState("");
  const [oxygenTherapy, setOxygenTherapy] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [followUpPlan, setFollowUpPlan] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <TabsContent value="diagnosistreatment" className="space-y-6 mt-4">
      {/* Diagnosis Section */}
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Diagnosis
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="diagnosis"
                className="block font-medium text-sm dark:text-gray-300"
              >
                Primary Diagnosis
              </Label>
              <Textarea
                id="diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter primary diagnosis"
                className="h-20 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="differentialDiagnosis"
                className="block font-medium text-sm dark:text-gray-300"
              >
                Differential Diagnosis
              </Label>
              <Textarea
                id="differentialDiagnosis"
                value={differentialDiagnosis}
                onChange={(e) => setDifferentialDiagnosis(e.target.value)}
                placeholder="Enter differential diagnoses"
                className="h-20 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Section */}
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Treatment
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="treatmentApproach"
                className="block font-medium text-sm dark:text-gray-300"
              >
                Treatment Approach
              </Label>
              <Textarea
                id="treatmentApproach"
                value={treatmentApproach}
                onChange={(e) => setTreatmentApproach(e.target.value)}
                placeholder="Enter overall treatment approach"
                className="h-20 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="currentMedications"
                  className="block font-medium text-sm dark:text-gray-300"
                >
                  Current Medications
                </Label>
                <Textarea
                  id="currentMedications"
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  placeholder="List current medications with dosages"
                  className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="ivFluids"
                  className="block font-medium text-sm dark:text-gray-300"
                >
                  IV Fluids & Electrolytes
                </Label>
                <Textarea
                  id="ivFluids"
                  value={ivFluids}
                  onChange={(e) => setIvFluids(e.target.value)}
                  placeholder="Specify IV fluids type, rate, and additives"
                  className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="antibiotics"
                  className="block font-medium text-sm dark:text-gray-300"
                >
                  Antibiotics/Antimicrobials
                </Label>
                <Textarea
                  id="antibiotics"
                  value={antibiotics}
                  onChange={(e) => setAntibiotics(e.target.value)}
                  placeholder="Specify antimicrobial regimen, duration"
                  className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="oxygenTherapy"
                  className="block font-medium text-sm dark:text-gray-300"
                >
                  Respiratory Support/Oxygen
                </Label>
                <Textarea
                  id="oxygenTherapy"
                  value={oxygenTherapy}
                  onChange={(e) => setOxygenTherapy(e.target.value)}
                  placeholder="Specify oxygen delivery method, ventilator settings, etc."
                  className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Plan Section */}
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Treatment Plan
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="treatmentPlan"
                className="block font-medium text-sm dark:text-gray-300"
              >
                Detailed Treatment Plan
              </Label>
              <Textarea
                id="treatmentPlan"
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                placeholder="Outline comprehensive treatment plan and goals"
                className="h-32 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="followUpPlan"
                className="block font-medium text-sm dark:text-gray-300"
              >
                Follow-up Plan
              </Label>
              <Textarea
                id="followUpPlan"
                value={followUpPlan}
                onChange={(e) => setFollowUpPlan(e.target.value)}
                placeholder="Specify follow-up schedule and monitoring plan"
                className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Notes
          </h3>

          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="block font-medium text-sm dark:text-gray-300"
            >
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional information, concerns, or special instructions"
              className="h-32 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default DiagnosisTreatmentTab;

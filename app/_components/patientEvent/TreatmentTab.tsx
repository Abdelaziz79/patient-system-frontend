"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "../DatePicker";

function TreatmentTab() {
  // Treatment action for the original medication change section
  const [treatmentAction, setTreatmentAction] = useState("add");
  const [medicationName, setMedicationName] = useState("");
  const [medicationDosage, setMedicationDosage] = useState("");
  const [medicationRoute, setMedicationRoute] = useState("");
  const [medicationFrequency, setMedicationFrequency] = useState("");
  const [medicationStartDate, setMedicationStartDate] = useState<
    Date | undefined
  >(new Date());
  const [medicationEndDate, setMedicationEndDate] = useState<Date | undefined>(
    undefined
  );
  const [medicationReason, setMedicationReason] = useState("");
  const [medicationNotes, setMedicationNotes] = useState("");

  // Additional states to match DiagnosisTreatmentTab structure
  const [currentMedications, setCurrentMedications] = useState("");
  const [antibiotics, setAntibiotics] = useState("");
  const [ivFluids, setIvFluids] = useState("");
  const [oxygenTherapy, setOxygenTherapy] = useState("");
  const [infusions, setInfusions] = useState("");
  const [sedations, setSedations] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <TabsContent value="treatment">
      {/* Original Treatment Changes Card */}
      <Card className="shadow-md border border-slate-200 dark:border-slate-700 dark:bg-slate-800 mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-primary dark:text-slate-200">
              Treatment Changes
            </h3>

            <RadioGroup
              value={treatmentAction}
              onValueChange={setTreatmentAction}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="add" id="add" />
                <Label
                  htmlFor="add"
                  className="text-green-600 dark:text-green-400"
                >
                  Add
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="modify" id="modify" />
                <Label
                  htmlFor="modify"
                  className="text-amber-600 dark:text-amber-400"
                >
                  Modify
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="discontinue" id="discontinue" />
                <Label
                  htmlFor="discontinue"
                  className="text-red-600 dark:text-red-400"
                >
                  Discontinue
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="mb-4 dark:bg-slate-600" />

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="medicationName"
                  className="font-medium dark:text-slate-300"
                >
                  Medication/Treatment
                </Label>
                <Input
                  id="medicationName"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="e.g. Lisinopril"
                  className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400"
                />
              </div>

              <div>
                <Label
                  htmlFor="medicationDosage"
                  className="font-medium dark:text-slate-300"
                >
                  Dosage
                </Label>
                <Input
                  id="medicationDosage"
                  value={medicationDosage}
                  onChange={(e) => setMedicationDosage(e.target.value)}
                  placeholder="e.g. 10mg"
                  className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="medicationRoute"
                  className="font-medium dark:text-slate-300"
                >
                  Route
                </Label>
                <Select
                  value={medicationRoute}
                  onValueChange={setMedicationRoute}
                >
                  <SelectTrigger className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
                    <SelectItem value="oral" className="dark:text-slate-200">
                      Oral
                    </SelectItem>
                    <SelectItem value="iv" className="dark:text-slate-200">
                      Intravenous (IV)
                    </SelectItem>
                    <SelectItem value="im" className="dark:text-slate-200">
                      Intramuscular (IM)
                    </SelectItem>
                    <SelectItem value="sc" className="dark:text-slate-200">
                      Subcutaneous
                    </SelectItem>
                    <SelectItem value="topical" className="dark:text-slate-200">
                      Topical
                    </SelectItem>
                    <SelectItem value="inhaled" className="dark:text-slate-200">
                      Inhaled
                    </SelectItem>
                    <SelectItem value="rectal" className="dark:text-slate-200">
                      Rectal
                    </SelectItem>
                    <SelectItem value="other" className="dark:text-slate-200">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="medicationFrequency"
                  className="font-medium dark:text-slate-300"
                >
                  Frequency
                </Label>
                <Input
                  id="medicationFrequency"
                  value={medicationFrequency}
                  onChange={(e) => setMedicationFrequency(e.target.value)}
                  placeholder="e.g. Once daily"
                  className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="medicationStartDate"
                  className="font-medium dark:text-slate-300"
                >
                  Start Date
                </Label>
                <DatePicker
                  date={medicationStartDate}
                  setDate={setMedicationStartDate}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label
                  htmlFor="medicationEndDate"
                  className="font-medium dark:text-slate-300"
                >
                  End Date (if applicable)
                </Label>
                <DatePicker
                  date={medicationEndDate}
                  setDate={setMedicationEndDate}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="medicationReason"
                className="font-medium dark:text-slate-300"
              >
                Reason for Change
              </Label>
              <Input
                id="medicationReason"
                value={medicationReason}
                onChange={(e) => setMedicationReason(e.target.value)}
                placeholder="e.g. Controlling hypertension"
                className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400"
              />
            </div>

            <div>
              <Label
                htmlFor="medicationNotes"
                className="font-medium dark:text-slate-300"
              >
                Additional Notes
              </Label>
              <Textarea
                id="medicationNotes"
                value={medicationNotes}
                onChange={(e) => setMedicationNotes(e.target.value)}
                placeholder="Additional notes about this treatment"
                className="min-h-[100px] mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Section (from DiagnosisTreatmentTab) */}
      <Card className="shadow-md border border-slate-200 dark:border-slate-700 dark:bg-slate-800 mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-slate-200">
            Treatment
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="oxygenTherapy"
                  className="block font-medium text-sm dark:text-slate-300"
                >
                  O2 Therapy
                </Label>
                <Textarea
                  id="oxygenTherapy"
                  value={oxygenTherapy}
                  onChange={(e) => setOxygenTherapy(e.target.value)}
                  placeholder="Specify oxygen delivery method, ventilator settings, etc."
                  className="h-24 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400 text-sm resize-none focus:ring-slate-500 focus:border-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="infusions"
                  className="block font-medium text-sm dark:text-slate-300"
                >
                  Infusions / Supports
                </Label>
                <Textarea
                  id="infusions"
                  value={infusions}
                  onChange={(e) => setInfusions(e.target.value)}
                  placeholder="Specify infusion details"
                  className="h-24 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400 text-sm resize-none focus:ring-slate-500 focus:border-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="ivFluids"
                  className="block font-medium text-sm dark:text-slate-300"
                >
                  IV Fluids & Electrolytes
                </Label>
                <Textarea
                  id="ivFluids"
                  value={ivFluids}
                  onChange={(e) => setIvFluids(e.target.value)}
                  placeholder="Specify IV fluids type, rate, and additives"
                  className="h-24 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400 text-sm resize-none focus:ring-slate-500 focus:border-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sedations"
                  className="block font-medium text-sm dark:text-slate-300"
                >
                  Sedations
                </Label>
                <Textarea
                  id="sedations"
                  value={sedations}
                  onChange={(e) => setSedations(e.target.value)}
                  placeholder="Specify sedation regimen"
                  className="h-24 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400 text-sm resize-none focus:ring-slate-500 focus:border-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="antibiotics"
                  className="block font-medium text-sm dark:text-slate-300"
                >
                  Antibiotics/Antimicrobials
                </Label>
                <Textarea
                  id="antibiotics"
                  value={antibiotics}
                  onChange={(e) => setAntibiotics(e.target.value)}
                  placeholder="Specify antimicrobial regimen, duration"
                  className="h-24 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400 text-sm resize-none focus:ring-slate-500 focus:border-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="currentMedications"
                  className="block font-medium text-sm dark:text-slate-300"
                >
                  Medications
                </Label>
                <Textarea
                  id="currentMedications"
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  placeholder="List medications with dosages"
                  className="h-24 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400 text-sm resize-none focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Plan Section */}
      <Card className="shadow-md border border-slate-200 dark:border-slate-700 dark:bg-slate-800 mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-slate-200">
            Treatment Plan
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                id="treatmentPlan"
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                placeholder="• Treatment point 1&#10;• Treatment point 2&#10;• Treatment point 3&#10;• etc."
                className="h-48 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400 text-sm resize-none focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card className="shadow-md border border-slate-200 dark:border-slate-700 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-slate-200">
            Notes
          </h3>

          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="block font-medium text-sm dark:text-slate-300"
            >
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional information, concerns, or special instructions"
              className="h-32 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400 text-sm resize-none focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default TreatmentTab;

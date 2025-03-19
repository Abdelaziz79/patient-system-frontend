"use client";

import DatePicker from "@/app/_components/DatePicker";
import { useDiagnosisTreatment } from "@/app/_contexts/PatientContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

function DiagnosisTreatmentTab() {
  const {
    diagnosisAndTreatment: {
      diagnosis,
      differentialDiagnosis,
      problemList,
      solutionList,
      currentMedications,
      antibiotics,
      ivFluids,
      oxygenTherapy,
      infusions,
      sedations,
      notes,
      treatmentPlans,
    },
    updateDiagnosisTreatment,
  } = useDiagnosisTreatment();

  // Function to add a new treatment plan
  const addTreatmentPlan = () => {
    const newPlanNumber =
      treatmentPlans.length > 0
        ? Math.max(...treatmentPlans.map((plan) => plan.planNumber)) + 1
        : 1;

    const newTreatmentPlans = [
      ...treatmentPlans,
      { planNumber: newPlanNumber, plan: "", reminder: undefined },
    ];

    updateDiagnosisTreatment("treatmentPlans", newTreatmentPlans);
  };

  // Function to update a specific treatment plan
  const updateTreatmentPlan = (
    index: number,
    field: string,
    value: string | Date | undefined
  ) => {
    const updatedPlans = [...treatmentPlans];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    updateDiagnosisTreatment("treatmentPlans", updatedPlans);
  };

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
                onChange={(e) =>
                  updateDiagnosisTreatment("diagnosis", e.target.value)
                }
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
                onChange={(e) =>
                  updateDiagnosisTreatment(
                    "differentialDiagnosis",
                    e.target.value
                  )
                }
                placeholder="Enter differential diagnoses"
                className="h-20 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="problemList"
                  className="block font-medium text-sm dark:text-gray-300"
                >
                  Problem List
                </Label>
                <Textarea
                  id="problemList"
                  value={problemList}
                  onChange={(e) =>
                    updateDiagnosisTreatment("problemList", e.target.value)
                  }
                  placeholder="List identified problems"
                  className="h-32 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="solutionList"
                  className="block font-medium text-sm dark:text-gray-300"
                >
                  Solution List
                </Label>
                <Textarea
                  id="solutionList"
                  value={solutionList}
                  onChange={(e) =>
                    updateDiagnosisTreatment("solutionList", e.target.value)
                  }
                  placeholder="List proposed solutions"
                  className="h-32 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="oxygenTherapy"
                  className="block font-medium text-sm dark:text-gray-300"
                >
                  O2 Therapy
                </Label>
                <Textarea
                  id="oxygenTherapy"
                  value={oxygenTherapy}
                  onChange={(e) =>
                    updateDiagnosisTreatment("oxygenTherapy", e.target.value)
                  }
                  placeholder="Specify oxygen delivery method, ventilator settings, etc."
                  className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="infusions"
                  className="block font-medium text-sm dark:text-gray-300"
                >
                  Infusions / Supports
                </Label>
                <Textarea
                  id="infusions"
                  value={infusions}
                  onChange={(e) =>
                    updateDiagnosisTreatment("infusions", e.target.value)
                  }
                  placeholder="Specify infusion details"
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
                  onChange={(e) =>
                    updateDiagnosisTreatment("ivFluids", e.target.value)
                  }
                  placeholder="Specify IV fluids type, rate, and additives"
                  className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sedations"
                  className="block font-medium text-sm dark:text-gray-300"
                >
                  Sedations
                </Label>
                <Textarea
                  id="sedations"
                  value={sedations}
                  onChange={(e) =>
                    updateDiagnosisTreatment("sedations", e.target.value)
                  }
                  placeholder="Specify sedation regimen"
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
                  onChange={(e) =>
                    updateDiagnosisTreatment("antibiotics", e.target.value)
                  }
                  placeholder="Specify antimicrobial regimen, duration"
                  className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="currentMedications"
                  className="block font-medium text-sm dark:text-gray-300"
                >
                  Medications
                </Label>
                <Textarea
                  id="currentMedications"
                  value={currentMedications}
                  onChange={(e) =>
                    updateDiagnosisTreatment(
                      "currentMedications",
                      e.target.value
                    )
                  }
                  placeholder="List medications with dosages"
                  className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Plan Section */}
      {treatmentPlans.map((plan, index) => (
        <Card
          key={index}
          className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800"
        >
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <h3 className="font-semibold text-lg text-primary dark:text-blue-300 mb-2 sm:mb-0">
                Treatment Plan {plan.planNumber}
              </h3>
              <div className="flex items-center">
                <Label
                  htmlFor={`reminderDate-${index}`}
                  className="font-medium text-sm mr-2 dark:text-gray-300"
                >
                  Reminder:
                </Label>
                <DatePicker
                  date={plan.reminder ? new Date(plan.reminder) : undefined}
                  setDate={(date) =>
                    updateTreatmentPlan(index, "reminder", date)
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  id={`treatmentPlan-${index}`}
                  value={plan.plan}
                  onChange={(e) =>
                    updateTreatmentPlan(index, "plan", e.target.value)
                  }
                  placeholder="• Treatment point "
                  className="h-24 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="w-full flex items-center justify-center">
        <Button
          onClick={addTreatmentPlan}
          className=" bg-primary hover:bg-primary/90 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white font-medium text-sm px-4 py-2 rounded-md flex items-center"
        >
          Add new Treatment plan <Plus className="ml-1 h-4 w-4" />
        </Button>
      </div>
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
              onChange={(e) =>
                updateDiagnosisTreatment("notes", e.target.value)
              }
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

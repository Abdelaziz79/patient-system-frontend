"use client";

import InfoItem from "@/app/_components/InfoItem";
import { DiagnosisAndTreatment } from "@/app/_types/Patient";
import { TabsContent } from "@/components/ui/tabs";
import {
  // CalendarIcon,
  ClipboardEditIcon,
  FileTextIcon,
  PillIcon,
  StethoscopeIcon,
} from "lucide-react";

type Props = {
  diagnosisAndTreatment: DiagnosisAndTreatment;
};

function DiagnosisAndTreatmentTab({ diagnosisAndTreatment }: Props) {
  return (
    <TabsContent value="treatment" className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
          <StethoscopeIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Diagnosis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={StethoscopeIcon}
            label="Primary Diagnosis"
            value={diagnosisAndTreatment.diagnosis}
          />
          <InfoItem
            icon={FileTextIcon}
            label="Differential Diagnosis"
            value={diagnosisAndTreatment.differentialDiagnosis}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
          <PillIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Treatment Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={StethoscopeIcon}
            label="Treatment Approach"
            value={diagnosisAndTreatment.treatmentApproach}
          />
          <InfoItem
            icon={PillIcon}
            label="Current Medications"
            value={diagnosisAndTreatment.currentMedications}
          />
          <InfoItem
            icon={PillIcon}
            label="IV Fluids"
            value={diagnosisAndTreatment.ivFluids}
          />
          <InfoItem
            icon={PillIcon}
            label="Antibiotics"
            value={diagnosisAndTreatment.antibiotics}
          />
          <InfoItem
            icon={PillIcon}
            label="Oxygen Therapy"
            value={diagnosisAndTreatment.oxygenTherapy}
          />
          <InfoItem
            icon={FileTextIcon}
            label="Treatment Plan"
            value={diagnosisAndTreatment?.treatmentPlans?.at(0)?.plan || ""}
            fullWidth={true}
          />
          {/* <InfoItem
            icon={CalendarIcon}
            label="Follow-up Plan"
            value={diagnosisAndTreatment.followUpPlan}
            fullWidth={true}
          /> */}
          <InfoItem
            icon={ClipboardEditIcon}
            label="Additional Notes"
            value={diagnosisAndTreatment.notes}
            fullWidth={true}
          />
        </div>
      </div>
    </TabsContent>
  );
}

export default DiagnosisAndTreatmentTab;

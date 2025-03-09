"use client";

import InfoItem from "@/app/_components/InfoItem";
import { TabsContent } from "@/components/ui/tabs";
import {
  ActivityIcon,
  BrainIcon,
  FileTextIcon,
  HeartPulseIcon,
} from "lucide-react";

type Props = {
  medicalConditions: {
    htn: boolean;
    dm: boolean;
    ihd: boolean;
    hf: boolean;
    arrhythmia: boolean;
    liver: boolean;
    kidney: boolean;
    chest: boolean;
    thyroid: boolean;
    cns: boolean;
    cancer: boolean;
    surgery: boolean;
  };
  medicalNotes: {
    htnNotes: string;
    dmNotes: string;
    ihdNotes: string;
    hfNotes: string;
    arrhythmiaNotes: string;
    liverNotes: string;
    kidneyNotes: string;
    chestNotes: string;
    thyroidNotes: string;
    cnsNotes: string;
    cancerNotes: string;
    surgeryNotes: string;
    others: string;
  };
};

function MedicalConditions({ medicalConditions, medicalNotes }: Props) {
  return (
    <TabsContent value="conditions" className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
          <FileTextIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Medical Conditions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medicalConditions.htn && (
            <InfoItem
              icon={HeartPulseIcon}
              label="Hypertension"
              value={medicalNotes.htnNotes}
            />
          )}
          {medicalConditions.dm && (
            <InfoItem
              icon={ActivityIcon}
              label="Diabetes"
              value={medicalNotes.dmNotes}
            />
          )}
          {medicalConditions.ihd && (
            <InfoItem
              icon={HeartPulseIcon}
              label="Ischemic Heart Disease"
              value={medicalNotes.ihdNotes}
            />
          )}
          {medicalConditions.hf && (
            <InfoItem
              icon={HeartPulseIcon}
              label="Heart Failure"
              value={medicalNotes.hfNotes}
            />
          )}
          {medicalConditions.arrhythmia && (
            <InfoItem
              icon={HeartPulseIcon}
              label="Arrhythmia"
              value={medicalNotes.arrhythmiaNotes}
            />
          )}
          {medicalConditions.liver && (
            <InfoItem
              icon={ActivityIcon}
              label="Liver Disease"
              value={medicalNotes.liverNotes}
            />
          )}
          {medicalConditions.kidney && (
            <InfoItem
              icon={ActivityIcon}
              label="Kidney Disease"
              value={medicalNotes.kidneyNotes}
            />
          )}
          {medicalConditions.chest && (
            <InfoItem
              icon={ActivityIcon}
              label="Chest Condition"
              value={medicalNotes.chestNotes}
            />
          )}
          {medicalConditions.thyroid && (
            <InfoItem
              icon={ActivityIcon}
              label="Thyroid Disease"
              value={medicalNotes.thyroidNotes}
            />
          )}
          {medicalConditions.cns && (
            <InfoItem
              icon={BrainIcon}
              label="CNS Disorders"
              value={medicalNotes.cnsNotes}
            />
          )}
          {medicalConditions.cancer && (
            <InfoItem
              icon={ActivityIcon}
              label="Cancer"
              value={medicalNotes.cancerNotes}
            />
          )}
          {medicalConditions.surgery && (
            <InfoItem
              icon={ActivityIcon}
              label="Surgical History"
              value={medicalNotes.surgeryNotes}
            />
          )}
          <InfoItem
            icon={FileTextIcon}
            label="Other Medical Notes"
            value={medicalNotes.others}
            fullWidth={true}
          />
        </div>
      </div>
    </TabsContent>
  );
}

export default MedicalConditions;

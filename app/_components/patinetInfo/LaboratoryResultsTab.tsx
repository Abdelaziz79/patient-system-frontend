"use client";

import InfoItem from "@/app/_components/InfoItem";
import { TabsContent } from "@/components/ui/tabs";
import { FlaskConicalIcon } from "lucide-react";

type Props = {
  labResults: {
    hb: string;
    tlc: string;
    plt: string;
    creat: string;
    na: string;
    k: string;
    alt: string;
    crp: string;
    urea: string;
    ca: string;
    alb: string;
    ck: string;
    ckmb: string;
    trop: string;
    ph: string;
    co2: string;
    hco3: string;
    lactate: string;
    o2sat: string;
    pt: string;
    ptt: string;
    inr: string;
    ast: string;
  };
};

function LaboratoryResultsTab({ labResults }: Props) {
  return (
    <TabsContent value="labs" className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
          <FlaskConicalIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Hematology
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem
            icon={FlaskConicalIcon}
            label="Hemoglobin"
            value={labResults.hb}
          />
          <InfoItem
            icon={FlaskConicalIcon}
            label="White Blood Cells"
            value={labResults.tlc}
          />
          <InfoItem
            icon={FlaskConicalIcon}
            label="Platelets"
            value={labResults.plt}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
          <FlaskConicalIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Chemistry
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem
            icon={FlaskConicalIcon}
            label="C-Reactive Protein"
            value={labResults.crp}
          />
          <InfoItem
            icon={FlaskConicalIcon}
            label="Urea"
            value={labResults.urea}
          />
          <InfoItem
            icon={FlaskConicalIcon}
            label="Creatinine"
            value={labResults.creat}
          />
          <InfoItem
            icon={FlaskConicalIcon}
            label="Sodium"
            value={labResults.na}
          />
          <InfoItem
            icon={FlaskConicalIcon}
            label="Potassium"
            value={labResults.k}
          />
          <InfoItem
            icon={FlaskConicalIcon}
            label="Calcium"
            value={labResults.ca}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
          <FlaskConicalIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Specialized Tests
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem
            icon={FlaskConicalIcon}
            label="Liver Function"
            value={`ALT: ${labResults.alt}, AST: ${labResults.ast}, Albumin: ${labResults.alb}`}
          />
          <InfoItem
            icon={FlaskConicalIcon}
            label="Cardiac Markers"
            value={`Troponin: ${labResults.trop}, CK: ${labResults.ck}, CK-MB: ${labResults.ckmb}`}
          />
          <InfoItem
            icon={FlaskConicalIcon}
            label="Arterial Blood Gas"
            value={`pH: ${labResults.ph}, CO2: ${labResults.co2}, HCO3: ${labResults.hco3}, Lactate: ${labResults.lactate}`}
          />
          <InfoItem
            icon={FlaskConicalIcon}
            label="Coagulation Profile"
            value={`PT: ${labResults.pt}, PTT: ${labResults.ptt}, INR: ${labResults.inr}`}
          />
        </div>
      </div>
    </TabsContent>
  );
}

export default LaboratoryResultsTab;

"use client";

import InfoItem from "@/app/_components/InfoItem";
import { TabsContent } from "@/components/ui/tabs";
import { BrainIcon, HeartPulseIcon, ImageIcon } from "lucide-react";

type Props = {
  imagingResults: {
    cxr: string;
    ctChest: string;
    ctBrain: string;
    us: string;
    dupplex: string;
    ecg: string;
    echo: string;
    mpi: string;
    ctAngio: string;
    others: string;
  };
};

function ImagingResultsTab({ imagingResults }: Props) {
  return (
    <TabsContent value="imaging" className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
          <ImageIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Imaging Studies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={ImageIcon}
            label="Chest X-Ray"
            value={imagingResults.cxr}
          />
          <InfoItem
            icon={ImageIcon}
            label="CT Chest"
            value={imagingResults.ctChest}
          />
          <InfoItem
            icon={BrainIcon}
            label="CT Brain"
            value={imagingResults.ctBrain}
          />
          <InfoItem
            icon={ImageIcon}
            label="Ultrasound"
            value={imagingResults.us}
          />
          <InfoItem
            icon={HeartPulseIcon}
            label="ECG"
            value={imagingResults.ecg}
          />
          <InfoItem
            icon={HeartPulseIcon}
            label="Echocardiogram"
            value={imagingResults.echo}
          />
          <InfoItem
            icon={ImageIcon}
            label="Duplex"
            value={imagingResults.dupplex}
          />
          <InfoItem
            icon={HeartPulseIcon}
            label="MPI"
            value={imagingResults.mpi}
          />
          <InfoItem
            icon={ImageIcon}
            label="CT Angiography"
            value={imagingResults.ctAngio}
          />
          <InfoItem
            icon={ImageIcon}
            label="Other Imaging"
            value={imagingResults.others}
          />
        </div>
      </div>
    </TabsContent>
  );
}

export default ImagingResultsTab;

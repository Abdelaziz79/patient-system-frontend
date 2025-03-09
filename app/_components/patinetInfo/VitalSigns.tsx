import { TabsContent } from "@/components/ui/tabs";
import { ActivityIcon, HeartPulseIcon } from "lucide-react";
import InfoItem from "../InfoItem";

type Props = {
  vitalSigns: {
    bp: string;
    hr: string;
    temp: string;
    rr: string;
    o2Sat: string;
    gcs: string;
    rbs: string;
    intake: string;
    balance: string;
    cvp: string;
    examination: string;
  };
};

function VitalSigns({
  vitalSigns: {
    bp,
    hr,
    temp,
    rr,
    o2Sat,
    gcs,
    rbs,
    intake,
    balance,
    cvp,
    examination,
  },
}: Props) {
  return (
    <TabsContent value="vitals" className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
          <ActivityIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Vital Signs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem icon={HeartPulseIcon} label="Blood Pressure" value={bp} />
          <InfoItem icon={ActivityIcon} label="Heart Rate" value={hr} />
          <InfoItem icon={ActivityIcon} label="Temperature" value={temp} />
          <InfoItem icon={ActivityIcon} label="Respiratory Rate" value={rr} />
          <InfoItem
            icon={ActivityIcon}
            label="Oxygen Saturation"
            value={o2Sat}
          />
          <InfoItem
            icon={ActivityIcon}
            label="Glasgow Coma Scale"
            value={gcs}
          />
          <InfoItem icon={ActivityIcon} label="Blood Sugar" value={rbs} />
          <InfoItem
            icon={ActivityIcon}
            label="Fluid Balance"
            value={`Intake: ${intake}, Balance: ${balance}`}
          />
          <InfoItem
            icon={ActivityIcon}
            label="Central Venous Pressure"
            value={cvp}
          />
          <InfoItem
            icon={ActivityIcon}
            label="Physical Examination"
            value={examination}
            fullWidth={true}
          />
        </div>
      </div>
    </TabsContent>
  );
}

export default VitalSigns;

"use client";

import InfoItem from "@/app/_components/InfoItem";
import { PersonalInfo } from "@/app/_types/Patient";
import { TabsContent } from "@/components/ui/tabs";
import {
  BadgeIcon,
  CalendarIcon,
  FileTextIcon,
  HeartHandshakeIcon,
  MapPinIcon,
  PhoneIcon,
  StethoscopeIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";

type Props = {
  personalInfo: PersonalInfo;
  id: string;
  complaints: string;
  diagnosis: string;
};

function OverviewTab({
  id,
  complaints,
  diagnosis,
  personalInfo: {
    patientName,
    phone,
    date,
    address,
    companion,
    companionPhone,
  },
}: Props) {
  return (
    <TabsContent value="overview" className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
          <UserIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={UserIcon} label="Patient Name" value={patientName} />
          <InfoItem icon={BadgeIcon} label="Patient ID" value={id || "N/A"} />
          <InfoItem icon={PhoneIcon} label="Phone Number" value={phone} />
          <InfoItem
            icon={CalendarIcon}
            label="Visit Date"
            value={date?.toISOString() ?? "N/A"}
          />
          <InfoItem
            icon={MapPinIcon}
            label="Address"
            value={address}
            fullWidth={true}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
          <HeartHandshakeIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={UserPlusIcon}
            label="Companion Name"
            value={companion}
          />
          <InfoItem
            icon={PhoneIcon}
            label="Companion Phone"
            value={companionPhone}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
          <FileTextIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Chief Complaint
        </h3>
        <InfoItem
          icon={FileTextIcon}
          label="Current Complaints"
          value={complaints}
          fullWidth={true}
        />
      </div>

      <div>
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
          <StethoscopeIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Current Diagnosis
        </h3>
        <InfoItem
          icon={FileTextIcon}
          label="Diagnosis"
          value={diagnosis}
          fullWidth={true}
        />
      </div>
    </TabsContent>
  );
}

export default OverviewTab;

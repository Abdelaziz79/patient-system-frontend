"use client";

import { usePersonalInfo } from "@/app/_contexts/PatientContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { PhoneIcon, UserIcon, UserPlusIcon } from "lucide-react";

function BasicInfoTab() {
  const { personalInfo, updatePersonalInfo } = usePersonalInfo();

  return (
    <TabsContent value="basic" className="space-y-6 mt-4">
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary dark:text-blue-300">
            Patient Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80">
              <Label
                htmlFor="patientName"
                className="font-medium text-sm dark:text-gray-300"
              >
                Patient Name
              </Label>
              <div className="relative">
                <Input
                  id="patientName"
                  placeholder="Enter patient's full name"
                  className="pl-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
                  required
                  value={personalInfo.patientName}
                  onChange={(e) =>
                    updatePersonalInfo("patientName", e.target.value)
                  }
                />
                <UserPlusIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
              </div>
            </div>

            <div className="space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80">
              <Label
                htmlFor="patientNumber"
                className="font-medium text-sm dark:text-gray-300"
              >
                Patient&apos;s Number
              </Label>
              <div className="relative">
                <Input
                  value={personalInfo.phone}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  id="patientNumber"
                  placeholder="Enter patient phone number"
                  className="pl-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
                  required
                />
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
              </div>
            </div>

            <div className="space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80">
              <Label
                htmlFor="age"
                className="font-medium text-sm dark:text-gray-300"
              >
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={personalInfo.age}
                onChange={(e) => updatePersonalInfo("age", e.target.value)}
                min={0}
                max={150}
                placeholder="Enter patient's age"
                className="focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
                required
              />
            </div>

            <div className="space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80">
              <Label
                htmlFor="gender"
                className="font-medium text-sm dark:text-gray-300"
              >
                Gender
              </Label>
              <select
                value={personalInfo.gender}
                onChange={(e) => updatePersonalInfo("gender", e.target.value)}
                id="gender"
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80">
              <Label
                htmlFor="bloodType"
                className="font-medium text-sm dark:text-gray-300"
              >
                Blood Group
              </Label>
              <select
                value={personalInfo.bloodType || ""}
                onChange={(e) =>
                  updatePersonalInfo("bloodType", e.target.value)
                }
                id="bloodType"
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div className="space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80 sm:col-span-2">
              <Label
                htmlFor="address"
                className="font-medium text-sm dark:text-gray-300"
              >
                Address
              </Label>
              <Input
                value={personalInfo.address}
                onChange={(e) => updatePersonalInfo("address", e.target.value)}
                id="address"
                placeholder="Enter patient's address"
                className="focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
              />
            </div>

            <div className="space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80">
              <Label
                htmlFor="date"
                className="font-medium text-sm dark:text-gray-300"
              >
                Visit Date
              </Label>
              <Input
                value={personalInfo.date}
                onChange={(e) => updatePersonalInfo("date", e.target.value)}
                id="date"
                type="date"
                className="focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
                required
              />
            </div>

            <div className="space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80">
              <Label
                htmlFor="companion"
                className="font-medium text-sm dark:text-gray-300"
              >
                Companion
              </Label>
              <div className="relative">
                <Input
                  value={personalInfo.companion}
                  onChange={(e) =>
                    updatePersonalInfo("companion", e.target.value)
                  }
                  id="companion"
                  placeholder="Enter companion's name"
                  className="pl-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
                />
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
              </div>
            </div>

            <div className="space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80">
              <Label
                htmlFor="companionPhone"
                className="font-medium text-sm dark:text-gray-300"
              >
                Companion&apos;s Phone
              </Label>
              <div className="relative">
                <Input
                  value={personalInfo.companionPhone}
                  onChange={(e) =>
                    updatePersonalInfo("companionPhone", e.target.value)
                  }
                  id="companionPhone"
                  placeholder="Enter companion's phone number"
                  className="pl-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
                />
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
              </div>
            </div>

            <div className="flex flex-col space-y-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-md border border-gray-100 dark:border-slate-600/80">
              <div className="flex items-center space-x-3">
                <Switch
                  id="smoker-status"
                  checked={personalInfo.isSmoker}
                  onCheckedChange={(e) => updatePersonalInfo("isSmoker", e)}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-500"
                />
                <Label
                  htmlFor="smoker-status"
                  className="font-medium text-sm dark:text-gray-300"
                >
                  Patient is a smoker
                </Label>
              </div>

              {personalInfo.isSmoker && (
                <div className="pt-1">
                  <Input
                    value={personalInfo.smokingDetails}
                    onChange={(e) =>
                      updatePersonalInfo("smokingDetails", e.target.value)
                    }
                    id="smoking-details"
                    placeholder="Notes about smoking habits"
                    className="focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600/70 dark:border-slate-500 dark:text-white dark:placeholder-gray-400 text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default BasicInfoTab;

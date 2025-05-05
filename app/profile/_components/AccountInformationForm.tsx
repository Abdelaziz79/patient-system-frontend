import { ProfileFormData } from "@/app/_hooks/profile/profileApi";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { User } from "@/app/_types/User";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BriefcaseIcon,
  MailIcon,
  PhoneIcon,
  SaveIcon,
  UserIcon,
} from "lucide-react";
import React from "react";

interface AccountInformationFormProps {
  user: User;
  formData: ProfileFormData;
  isEditing: boolean;
  isSaving: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => Promise<void>;
}

export function AccountInformationForm({
  user,
  formData,
  isEditing,
  isSaving,
  handleChange,
  handleSave,
}: AccountInformationFormProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
          {t("accountInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2"
            >
              <UserIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              {t("fullName")}
            </Label>
            {isEditing ? (
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 dark:bg-slate-700/70 border-gray-300 dark:border-slate-600 focus:border-green-500 focus:ring-green-500 dark:focus:border-green-400 dark:focus:ring-green-400"
              />
            ) : (
              <div className="mt-2 p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-md border border-gray-200 dark:border-gray-700">
                {user.name}
              </div>
            )}
          </div>

          {/* Email Address */}
          <div className="relative">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2"
            >
              <MailIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              {t("emailAddress")}
            </Label>
            {/* Email is generally not editable */}
            <div className="mt-2 p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-md border border-gray-200 dark:border-gray-700 flex items-center">
              {user.email}
            </div>
          </div>

          {/* Contact Number */}
          <div className="relative">
            <Label
              htmlFor="contactNumber"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2"
            >
              <PhoneIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              {t("contactNumber")}
            </Label>
            {isEditing ? (
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder={t("notProvided")}
                className="mt-2 dark:bg-slate-700/70 border-gray-300 dark:border-slate-600 focus:border-green-500 focus:ring-green-500 dark:focus:border-green-400 dark:focus:ring-green-400"
              />
            ) : (
              <div className="mt-2 p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {user.contactNumber || t("notProvided")}
              </div>
            )}
          </div>

          {/* Specialization */}
          <div className="relative">
            <Label
              htmlFor="specialization"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2"
            >
              <BriefcaseIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              {t("specialization")}
            </Label>
            {isEditing ? (
              <Input
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder={t("notProvided")}
                className="mt-2 dark:bg-slate-700/70 border-gray-300 dark:border-slate-600 focus:border-green-500 focus:ring-green-500 dark:focus:border-green-400 dark:focus:ring-green-400"
              />
            ) : (
              <div className="mt-2 p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {user.specialization || t("notProvided")}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter className="border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="flex justify-end w-full">
            <Button
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-700 dark:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-2"></div>
                  <span>{t("saving")}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <SaveIcon className="mx-2 h-4 w-4" />
                  <span>{t("saveChanges")}</span>
                </div>
              )}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

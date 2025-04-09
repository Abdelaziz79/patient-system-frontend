import { User } from "@/app/_hooks/useAuth";
import { ProfileFormData } from "@/app/_hooks/useUserProfile";
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
import { MailIcon, SaveIcon } from "lucide-react";
import React from "react";

interface AccountInformationFormProps {
  user: User;
  formData: ProfileFormData;
  isEditing: boolean;
  isSaving: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => Promise<void>; // Adjusted return type based on original handleSave
}

export function AccountInformationForm({
  user,
  formData,
  isEditing,
  isSaving,
  handleChange,
  handleSave,
}: AccountInformationFormProps) {
  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <Label htmlFor="name" className="text-gray-600 dark:text-gray-300">
              Full Name
            </Label>
            {isEditing ? (
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 dark:bg-slate-700 border-gray-300 dark:border-slate-600"
              />
            ) : (
              <div className=" mt-1 p-2 bg-gray-100 dark:bg-slate-700 rounded-md">
                {user.name}
              </div>
            )}
          </div>

          {/* Email Address */}
          <div>
            <Label htmlFor="email" className="text-gray-600 dark:text-gray-300">
              Email Address
            </Label>
            {/* Email is generally not editable */}
            <div className="mt-1 p-2 bg-gray-100 dark:bg-slate-700 rounded-md flex items-center">
              <MailIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              {user.email}
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <Label
              htmlFor="contactNumber"
              className="text-gray-600 dark:text-gray-300"
            >
              Contact Number
            </Label>
            {isEditing ? (
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Add contact number"
                className="mt-1 dark:bg-slate-700 border-gray-300 dark:border-slate-600"
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 dark:bg-slate-700 rounded-md text-gray-500 dark:text-gray-400">
                {user.contactNumber || "Not provided"}
              </div>
            )}
          </div>

          {/* Specialization */}
          <div>
            <Label
              htmlFor="specialization"
              className="text-gray-600 dark:text-gray-300"
            >
              Specialization
            </Label>
            {isEditing ? (
              <Input
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Add specialization"
                className="mt-1 dark:bg-slate-700 border-gray-300 dark:border-slate-600"
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 dark:bg-slate-700 rounded-md text-gray-500 dark:text-gray-400">
                {user.specialization || "Not provided"}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter className="border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="flex justify-end w-full">
            <Button
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <SaveIcon className="mr-2 h-4 w-4" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

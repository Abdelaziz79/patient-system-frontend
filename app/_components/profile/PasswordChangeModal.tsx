import { useUserProfile } from "@/app/_hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordChangeModal({
  isOpen,
  onClose,
}: PasswordChangeModalProps) {
  const {
    isSubmittingPassword: isSubmitting,
    changePassword,
    passwordData,
    handlePasswordChange,
  } = useUserProfile();

  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
    } = {};

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
      toast.error("Current password is required");
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      toast.error("New password is required");
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
      toast.error("Password must be at least 6 characters");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      await changePassword();
    } catch (error) {
      toast.error("Failed to change password");
      console.error("Error changing password:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
            <KeyIcon className="mr-2 h-5 w-5" />
            Change Password
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Update your account password
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="currentPassword"
                className="text-right font-medium text-gray-700 dark:text-gray-300"
              >
                Current Password
              </Label>
              <div className="col-span-3">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange(e)}
                  className={`focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 ${
                    errors.currentPassword
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="••••••"
                />
                {errors.currentPassword && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="newPassword"
                className="text-right font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </Label>
              <div className="col-span-3">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange(e)}
                  className={`focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 ${
                    errors.newPassword
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="••••••"
                />
                {errors.newPassword && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Changing...
                </span>
              ) : (
                "Change Password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

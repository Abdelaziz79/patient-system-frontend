import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useUserProfile } from "@/app/_hooks/profile/useUserProfile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyIcon, Loader2 } from "lucide-react";
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
  const { t, dir } = useLanguage();
  const {
    isSubmittingPassword: isSubmitting,
    changePassword,
    passwordData,
    handlePasswordChange,
  } = useUserProfile();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = t("error");
      toast.error(t("currentPasswordRequired"));
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = t("error");
      toast.error(t("newPasswordRequired"));
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = t("error");
      toast.error(t("passwordMinLength"));
    }

    if (passwordData.newPassword !== confirmPassword) {
      newErrors.confirmPassword = t("error");
      toast.error(t("passwordsDoNotMatch"));
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
      const res = await changePassword();
      toast(res.message);
      if (res.success) {
        handleClose();
      }
    } catch (error) {
      toast.error(t("failedToChangePassword"));
      console.error("Error changing password:", error);
    }
  };

  const handleClose = () => {
    // Reset form state when closing
    setConfirmPassword("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg"
        dir={dir}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <KeyIcon className="h-5 w-5" />
            {t("changePassword")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="currentPassword"
                className="text-right font-medium text-gray-700 dark:text-gray-300"
              >
                {t("currentPassword")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
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
                {t("newPassword")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="confirmPassword"
                className="text-right font-medium text-gray-700 dark:text-gray-300"
              >
                {t("confirmPassword")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }
                  }}
                  className={`focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 ${
                    errors.confirmPassword
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("changing")}
                </span>
              ) : (
                t("changePassword")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

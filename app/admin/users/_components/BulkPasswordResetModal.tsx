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
import { useLanguage } from "@/app/_contexts/LanguageContext";

interface BulkPasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUserCount: number;
  onReset: (newPassword: string) => Promise<void>;
  isResetting: boolean;
  isRTL?: boolean;
}

export function BulkPasswordResetModal({
  isOpen,
  onClose,
  selectedUserCount,
  onReset,
  isResetting,
  isRTL,
}: BulkPasswordResetModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const { t } = useLanguage();

  const validateForm = () => {
    const newErrors: {
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      toast.error("New password is required");
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
      toast.error("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      toast.error("Passwords do not match");
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
      await onReset(newPassword);
      handleClose();
    } catch (error) {
      toast.error("Failed to reset user passwords");
      console.error("Error resetting passwords:", error);
    }
  };

  const handleClose = () => {
    // Reset form state when closing
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Clear any focus traps
          document.body.style.pointerEvents = "";
          // Small delay to ensure DOM updates before releasing focus
          setTimeout(() => {
            handleClose();
            // Force focus back to the body
            if (document.body) {
              document.body.focus();
            }
          }, 10);
        }
      }}
    >
      <DialogContent
        className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
            <KeyIcon className={`${isRTL ? "mx-2" : "mx-2"} h-5 w-5`} />
            {t("changePassword")}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Reset password for{" "}
            <span className="font-medium">{selectedUserCount}</span> selected
            {selectedUserCount !== 1 ? " " + t("users") : " " + t("user")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="newPassword"
                className={`${
                  isRTL ? "text-left" : "text-right"
                } font-medium text-gray-700 dark:text-gray-300`}
              >
                New Password
              </Label>
              <div className="col-span-3">
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        newPassword: undefined,
                      }));
                    }
                  }}
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
                className={`${
                  isRTL ? "text-left" : "text-right"
                } font-medium text-gray-700 dark:text-gray-300`}
              >
                Confirm Password
              </Label>
              <div className="col-span-3">
                <Input
                  id="confirmPassword"
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
          <DialogFooter
            className={`gap-2 pt-2 border-t border-gray-200 dark:border-gray-800 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
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
              disabled={isResetting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-200"
            >
              {isResetting ? (
                <span className="flex items-center">
                  <svg
                    className={`animate-spin ${
                      isRTL ? "-mx-1 mx-2" : "-mx-1 mx-2"
                    } h-4 w-4 text-white`}
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
                  Resetting...
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

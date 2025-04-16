import { useAuth } from "@/app/_hooks/useAuth";
import { User, UserCreateData } from "@/app/_types/User";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserCreateData | User) => Promise<void>;
  isSubmitting: boolean;
  user?: User | null; // For editing mode
  mode: "create" | "update";
}

export function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  user,
  mode,
}: UserFormModalProps) {
  const [userData, setUserData] = useState<UserCreateData | User>({
    name: "",
    email: "",
    password: mode === "create" ? "" : undefined,
    role: "staff",
    contactNumber: "",
    specialization: "",
  });
  const { user: currentUser } = useAuth();
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  // Populate form with user data when editing
  useEffect(() => {
    if (mode === "update" && user) {
      setUserData({
        ...user,
        password: undefined, // Don't include password when updating
      });
    } else {
      // Reset form for create mode
      setUserData({
        name: "",
        email: "",
        password: "",
        role: "staff",
        contactNumber: "",
        specialization: "",
      });
    }
  }, [mode, user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleRoleChange = (value: string) => {
    setUserData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (!userData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Only validate password in create mode
    if (mode === "create") {
      if (!(userData as UserCreateData).password?.trim()) {
        newErrors.password = "Password is required";
      } else if (((userData as UserCreateData).password ?? "").length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(userData);

    // Form will be reset when modal is reopened due to the useEffect
  };

  const modalTitle = mode === "create" ? "Create New User" : "Update User";
  const modalDescription =
    mode === "create"
      ? "Add a new user to the healthcare system"
      : "Update user information";
  const submitButtonText = mode === "create" ? "Create User" : "Update User";
  const loadingText = mode === "create" ? "Creating..." : "Updating...";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Clear any focus traps
          document.body.style.pointerEvents = "";
          // Small delay to ensure DOM updates before releasing focus
          setTimeout(() => {
            onClose();
            // Force focus back to the body
            if (document.body) {
              document.body.focus();
            }
          }, 10);
        }
      }}
    >
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {modalTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {modalDescription}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="name"
                className="text-right font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className={`focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 ${
                    errors.name
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Full name"
                />
                {errors.name && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.name}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="email"
                className="text-right font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={mode === "update"}
                  className={`focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 ${
                    errors.email
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            {mode === "create" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="password"
                  className="text-right font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                <div className="col-span-3">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={(userData as UserCreateData).password || ""}
                    onChange={handleChange}
                    className={`focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 ${
                      errors.password
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="••••••"
                  />
                  {errors.password && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="role"
                className="text-right font-medium text-gray-700 dark:text-gray-300"
              >
                Role
              </Label>
              <div className="col-span-3">
                <Select value={userData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-emerald-500">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {currentUser?.role === "super_admin" && (
                      <SelectItem
                        value="admin"
                        className="dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        Admin
                      </SelectItem>
                    )}
                    <SelectItem
                      value="doctor"
                      className="dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      Doctor
                    </SelectItem>
                    <SelectItem
                      value="nurse"
                      className="dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      Nurse
                    </SelectItem>
                    <SelectItem
                      value="staff"
                      className="dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      Staff
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="contactNumber"
                className="text-right font-medium text-gray-700 dark:text-gray-300"
              >
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                className="col-span-3 focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                value={userData.contactNumber || ""}
                onChange={handleChange}
                placeholder="+20 1234567890"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="specialization"
                className="text-right font-medium text-gray-700 dark:text-gray-300"
              >
                Specialization
              </Label>
              <Input
                id="specialization"
                name="specialization"
                className="col-span-3 focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                value={userData.specialization || ""}
                onChange={handleChange}
                placeholder="e.g. Cardiology, Pediatrics"
              />
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
                  {loadingText}
                </span>
              ) : (
                submitButtonText
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

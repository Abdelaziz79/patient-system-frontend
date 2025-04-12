import { ISubscription } from "@/app/_hooks/useAuth";
import { SubscriptionUpdateData } from "@/app/_hooks/useUserAdmin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CalendarIcon, ZapIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface SubscriptionUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  currentSubscription?: ISubscription;
  onUpdate: (
    userId: string,
    subscriptionData: SubscriptionUpdateData
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  isUpdating: boolean;
}

export function SubscriptionUpdateModal({
  isOpen,
  onClose,
  userId,
  userName,
  currentSubscription,
  onUpdate,
  isUpdating,
}: SubscriptionUpdateModalProps) {
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionUpdateData>({
      type: "basic",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      isActive: true,
      features: [],
    });

  const [errors, setErrors] = useState<{
    type?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  // Available features
  const availableFeatures = [
    "Reports Export",
    "Patient Management",
    "Advanced Analytics",
    "Multiple Users",
    "API Access",
    "24/7 Support",
    "Custom Integration",
  ];

  useEffect(() => {
    // Initialize with current subscription data if available
    if (currentSubscription) {
      setSubscriptionData({
        type: currentSubscription.type,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(currentSubscription.endDate)
          .toISOString()
          .split("T")[0],
        isActive: currentSubscription.isActive,
        features: currentSubscription.features || [],
      });
    }
  }, [currentSubscription, isOpen]);

  const handleTypeChange = (value: string) => {
    let features: string[] = [];

    // Set default features based on subscription type
    switch (value) {
      case "free_trial":
        features = ["Reports Export", "Patient Management"];
        break;
      case "basic":
        features = ["Reports Export", "Patient Management", "Multiple Users"];
        break;
      case "premium":
        features = [
          "Reports Export",
          "Patient Management",
          "Advanced Analytics",
          "Multiple Users",
          "API Access",
        ];
        break;
      case "enterprise":
        features = availableFeatures;
        break;
      default:
        features = [];
    }

    setSubscriptionData((prev) => ({
      ...prev,
      type: value,
      features: features,
    }));

    // Clear error when user makes a selection
    if (errors.type) {
      setErrors((prev) => ({
        ...prev,
        type: undefined,
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubscriptionData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user makes a change
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFeatureChange = (feature: string) => {
    setSubscriptionData((prev) => {
      const features = prev.features || [];

      if (features.includes(feature)) {
        return {
          ...prev,
          features: features.filter((f) => f !== feature),
        };
      } else {
        return {
          ...prev,
          features: [...features, feature],
        };
      }
    });
  };

  const validateForm = () => {
    const newErrors: {
      type?: string;
      startDate?: string;
      endDate?: string;
    } = {};

    if (!subscriptionData.type) {
      newErrors.type = "Subscription type is required";
      toast.error("Subscription type is required");
    }

    if (!subscriptionData.startDate) {
      newErrors.startDate = "Start date is required";
      toast.error("Start date is required");
    }

    if (!subscriptionData.endDate) {
      newErrors.endDate = "End date is required";
      toast.error("End date is required");
    } else if (
      new Date(subscriptionData.endDate) <= new Date(subscriptionData.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
      toast.error("End date must be after start date");
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
      const result = await onUpdate(userId, subscriptionData);
      if (result.success) {
        toast.success(result.message || "Subscription updated successfully");
        handleClose();
      } else {
        toast.error(result.message || "Failed to update subscription");
      }
    } catch (error) {
      toast.error("Failed to update subscription");
      console.error("Error updating subscription:", error);
    }
  };

  const handleClose = () => {
    // Reset form state when closing
    setSubscriptionData({
      type: "basic",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      isActive: true,
      features: [],
    });
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
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
            <ZapIcon className="mr-2 h-5 w-5" />
            Update Subscription
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Update subscription for user:{" "}
            <span className="font-medium">{userName}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="type"
                className="text-right font-medium text-gray-700 dark:text-gray-300"
              >
                Subscription Type
              </Label>
              <div className="col-span-3">
                <Select
                  value={subscriptionData.type}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger
                    className={`focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 ${
                      errors.type
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <SelectValue placeholder="Select subscription type" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem
                      value="free_trial"
                      className="dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      Free Trial
                    </SelectItem>
                    <SelectItem
                      value="basic"
                      className="dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      Basic
                    </SelectItem>
                    <SelectItem
                      value="premium"
                      className="dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      Premium
                    </SelectItem>
                    <SelectItem
                      value="enterprise"
                      className="dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      Enterprise
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.type}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="startDate"
                className="text-right font-medium text-gray-700 dark:text-gray-300"
              >
                Start Date
              </Label>
              <div className="col-span-3 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={
                    typeof subscriptionData.startDate === "string"
                      ? subscriptionData.startDate
                      : subscriptionData.startDate.toISOString().split("T")[0]
                  }
                  onChange={handleDateChange}
                  className={`pl-10 focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 ${
                    errors.startDate
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="endDate"
                className="text-right font-medium text-gray-700 dark:text-gray-300"
              >
                End Date
              </Label>
              <div className="col-span-3 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={
                    typeof subscriptionData.endDate === "string"
                      ? subscriptionData.endDate
                      : subscriptionData.endDate.toISOString().split("T")[0]
                  }
                  onChange={handleDateChange}
                  className={`pl-10 focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 ${
                    errors.endDate
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.endDate && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right font-medium text-gray-700 dark:text-gray-300 pt-1">
                Status
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={subscriptionData.isActive}
                  onCheckedChange={(checked) => {
                    setSubscriptionData((prev) => ({
                      ...prev,
                      isActive: !!checked,
                    }));
                  }}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <Label
                  htmlFor="isActive"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Active Subscription
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right font-medium text-gray-700 dark:text-gray-300 pt-1">
                Features
              </Label>
              <div className="col-span-3 space-y-2">
                {availableFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={(subscriptionData.features || []).includes(
                        feature
                      )}
                      onCheckedChange={() => handleFeatureChange(feature)}
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Label
                      htmlFor={`feature-${feature}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {feature}
                    </Label>
                  </div>
                ))}
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-200"
            >
              {isUpdating ? (
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
                  Updating...
                </span>
              ) : (
                "Update Subscription"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

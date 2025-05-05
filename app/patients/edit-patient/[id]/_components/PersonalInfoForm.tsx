import { IPersonalInfo } from "@/app/_types/Patient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Heart, Phone, Shield, UsersRound } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useState, memo, useMemo, useCallback } from "react";
import { CustomCalendar } from "@/app/_components/CustomCalendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/app/_contexts/LanguageContext";

interface PersonalInfoFormProps {
  form: UseFormReturn<any>;
  initialData?: IPersonalInfo;
}

const PersonalInfoForm = memo(function PersonalInfoForm({
  form,
  initialData,
}: PersonalInfoFormProps) {
  const { t, dir } = useLanguage();

  // State for date of birth and popover
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // State for gender
  const [gender, setGender] = useState<string>("");

  // Get form errors only when they change using useMemo
  const formErrors = useMemo(
    () => form.formState.errors,
    [form.formState.errors]
  );

  // Watch the form values
  const watchDateOfBirth = form.watch("personalInfo.dateOfBirth");
  const watchGender = form.watch("personalInfo.gender");

  // Initialize and update date when form value changes
  useEffect(() => {
    if (watchDateOfBirth) {
      try {
        const dateValue = new Date(watchDateOfBirth);
        if (!isNaN(dateValue.getTime())) {
          setDateOfBirth(dateValue);
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    }
  }, [watchDateOfBirth]);

  // Initialize and update gender when form value changes
  useEffect(() => {
    // Update gender state whenever the form value changes
    if (watchGender) {
      setGender(watchGender);
    }
  }, [watchGender]);

  // Initial setup from initialData when the component mounts
  useEffect(() => {
    // Set initial values from initialData if form values are not set
    if (initialData) {
      // Initialize gender from initialData if not already set in form
      if (initialData.gender && !form.getValues("personalInfo.gender")) {
        setGender(initialData.gender);
        form.setValue("personalInfo.gender", initialData.gender, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }

      // Initialize date of birth from initialData if not already set in form
      if (
        initialData.dateOfBirth &&
        !form.getValues("personalInfo.dateOfBirth")
      ) {
        try {
          const dateValue = new Date(initialData.dateOfBirth);
          if (!isNaN(dateValue.getTime())) {
            setDateOfBirth(dateValue);
            form.setValue("personalInfo.dateOfBirth", dateValue, {
              shouldValidate: false,
              shouldDirty: false,
            });
          }
        } catch (error) {
          console.error("Error parsing initialData date:", error);
        }
      }
    }
  }, [initialData, form]);

  // Helper function to safely check for nested errors - memoized
  const hasError = useCallback(
    (path: string): boolean => {
      const parts = path.split(".");
      let current: any = formErrors;

      for (const part of parts) {
        if (!current[part]) return false;
        current = current[part];
      }

      return true;
    },
    [formErrors]
  );

  const formSectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  // Handle date selection from calendar
  const handleDateSelect = useCallback(
    (date: Date) => {
      setDateOfBirth(date);
      setPopoverOpen(false);

      form.setValue("personalInfo.dateOfBirth", date, {
        shouldValidate: false,
        shouldDirty: true,
      });
    },
    [form]
  );

  // Handle gender change
  const handleGenderChange = useCallback(
    (value: string) => {
      setGender(value);
      form.setValue("personalInfo.gender", value as "male" | "female", {
        shouldValidate: false,
        shouldDirty: true,
      });
    },
    [form]
  );

  // Format date for display
  const formatDateForDisplay = useCallback((date: Date | undefined) => {
    if (!date) return "";
    try {
      return format(date, "PPP");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  }, []);

  return (
    <div className="space-y-8" dir={dir}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir={dir}>
        <motion.div
          className="space-y-4"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={formSectionVariants}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-green-100 dark:bg-green-800/50 p-1.5 rounded-md shadow-sm">
              <UsersRound className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
            <h4 className="font-medium text-sm text-green-700 dark:text-green-300">
              {t("basicInfo")}
            </h4>
          </div>

          <div className="space-y-2 relative">
            <Label
              htmlFor="firstName"
              className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
            >
              {t("firstName")} <span className="text-red-500 mx-1">*</span>
            </Label>
            <Input
              id="firstName"
              placeholder="First Name"
              {...form.register("personalInfo.firstName", {
                required: true,
              })}
              className={`transition-all duration-200 focus:border-green-500 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white ${
                hasError("personalInfo.firstName")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-600 dark:focus:ring-red-600"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            />
            {hasError("personalInfo.firstName") && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {t("firstNameRequired")}
              </p>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label
              htmlFor="lastName"
              className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
            >
              {t("lastName")} <span className="text-red-500 mx-1">*</span>
            </Label>
            <Input
              id="lastName"
              placeholder="Last Name"
              {...form.register("personalInfo.lastName", {
                required: true,
              })}
              className={`transition-all duration-200 focus:border-green-500 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white ${
                hasError("personalInfo.lastName")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-600 dark:focus:ring-red-600"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            />
            {hasError("personalInfo.lastName") && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {t("lastNameRequired")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="dateOfBirth"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("selectDateOfBirth")}
            </Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="dateOfBirth"
                  className={`w-full justify-start text-left font-normal focus:ring-green-500 focus:border-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white ${
                    !dateOfBirth ? "text-gray-500 dark:text-gray-400" : ""
                  }`}
                >
                  <CalendarIcon className="mx-2 h-4 w-4" />
                  {dateOfBirth
                    ? formatDateForDisplay(dateOfBirth)
                    : "Select date of birth"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CustomCalendar
                  selected={dateOfBirth}
                  onSelect={handleDateSelect}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="gender"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("gender")}
            </Label>
            <Select
              onValueChange={handleGenderChange}
              value={gender}
              defaultValue={gender}
            >
              <SelectTrigger className="focus:ring-green-500 focus:border-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                <SelectItem
                  value="male"
                  className="dark:text-white dark:focus:bg-slate-700"
                >
                  {t("male")}
                </SelectItem>
                <SelectItem
                  value="female"
                  className="dark:text-white dark:focus:bg-slate-700"
                >
                  {t("female")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="medicalRecordNumber"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("medicalRecordNumber")}
            </Label>
            <Input
              id="medicalRecordNumber"
              placeholder="MRN"
              className="focus:border-green-500 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white"
              {...form.register("personalInfo.medicalRecordNumber")}
            />
          </div>
        </motion.div>

        <motion.div
          className="space-y-4"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={formSectionVariants}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-green-100 dark:bg-green-800/50 p-1.5 rounded-md shadow-sm">
              <Phone className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
            <h4 className="font-medium text-sm text-green-700 dark:text-green-300">
              {t("contactInformation")}
            </h4>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="contactNumber"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("contactNumber")}
            </Label>
            <Input
              id="contactNumber"
              placeholder={t("phoneTranslate")}
              className="focus:border-green-500 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white"
              {...form.register("personalInfo.contactNumber")}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("emailName")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailAddress")}
              className="focus:border-green-500 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white"
              {...form.register("personalInfo.email")}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("addressName")}
            </Label>
            <Input
              id="address"
              placeholder={t("addressName")}
              className="focus:border-green-500 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white"
              {...form.register("personalInfo.address")}
            />
          </div>

          <div className="flex items-center gap-2 mb-2 mt-6">
            <div className="bg-green-100 dark:bg-green-800/50 p-1.5 rounded-md shadow-sm">
              <Heart className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
            <h4 className="font-medium text-sm text-green-700 dark:text-green-300">
              {t("emergencyContact")}
            </h4>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="emergencyName"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("emergencyContact")}
            </Label>
            <Input
              id="emergencyName"
              placeholder={t("name")}
              className="focus:border-green-500 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white"
              {...form.register("personalInfo.emergencyContact.name")}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label
                htmlFor="emergencyRelationship"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("relation")}
              </Label>
              <Input
                id="emergencyRelationship"
                placeholder={t("relation")}
                className="focus:border-green-500 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white"
                {...form.register("personalInfo.emergencyContact.relationship")}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="emergencyPhone"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("phoneTranslate")}
              </Label>
              <Input
                id="emergencyPhone"
                placeholder={t("phoneTranslate")}
                className="focus:border-green-500 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white"
                {...form.register("personalInfo.emergencyContact.phone")}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-4 md:col-span-2 bg-green-50/50 dark:bg-green-900/10 p-6 rounded-lg border border-green-100 dark:border-green-900/30"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={formSectionVariants}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-green-100 dark:bg-green-800/50 p-1.5 rounded-md shadow-sm">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
            <h4 className="font-medium text-sm text-green-700 dark:text-green-300">
              {t("insuranceInformation")}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="provider"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("provider")}
              </Label>
              <Input
                id="provider"
                placeholder={t("provider")}
                className="focus:border-green-500 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white"
                {...form.register("personalInfo.insuranceInfo.provider")}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="policyNumber"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("policyNumber")}
              </Label>
              <Input
                id="policyNumber"
                placeholder={t("policyNumber")}
                className="focus:border-green-500 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white"
                {...form.register("personalInfo.insuranceInfo.policyNumber")}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="groupNumber"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("groupNumber")}
              </Label>
              <Input
                id="groupNumber"
                placeholder={t("groupNumber")}
                className="focus:border-green-500 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-green-600 dark:focus:ring-green-600 dark:text-white"
                {...form.register("personalInfo.insuranceInfo.groupNumber")}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export { PersonalInfoForm };

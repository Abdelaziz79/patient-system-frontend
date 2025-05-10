import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IStatus } from "@/app/_types/Patient";
import { PatientTemplate } from "@/app/_types/Template";
import { FormFields } from "@/app/patients/add-patient/_components/FormFields";
import { PatientStatus } from "@/app/patients/add-patient/_components/PatientStatus";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { memo, useCallback, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

interface PatientFormData {
  patientStatus?: string;
  patientStatusData?: IStatus;
  [key: string]: any;
}

interface PatientFormProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  patientTemplate: PatientTemplate;
  form: UseFormReturn<PatientFormData>;
  patientStatusOptions?: any[];
}

// Memo wrapper for the PatientForm to prevent unnecessary rerenders
export const PatientForm = memo(function PatientForm({
  activeTab,
  setActiveTab,
  patientTemplate,
  form,
  patientStatusOptions = [],
}: PatientFormProps) {
  const { t, dir } = useLanguage();

  // Use callback for tab change to prevent function recreation
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);
    },
    [setActiveTab]
  );

  // Memoize sections rendering to prevent unnecessary recalculations
  const tabsContent = useMemo(() => {
    return patientTemplate.sections.map((section) => (
      <TabsContent key={section.name} value={section.name}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-800/90 rounded-lg p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm"
          dir={dir}
        >
          <h3 className="font-medium text-lg text-green-700 dark:text-green-400 mb-4 pb-2 border-b border-green-100 dark:border-green-900/50">
            {section.label}
            {section.description && (
              <span className="block text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
                {section.description}
              </span>
            )}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {section.fields.map((field) => (
              <FormFields
                key={field.name}
                field={field}
                control={form.control}
              />
            ))}
          </div>
        </motion.div>
      </TabsContent>
    ));
  }, [patientTemplate.sections, form.control, dir]);

  // Memoize tabs triggers
  const tabsTriggers = useMemo(() => {
    return patientTemplate.sections.map((section, index) => (
      <TabsTrigger
        key={section.name}
        value={section.name}
        className="data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300 rounded-md transition-all duration-200 data-[state=active]:shadow-md mx-1 px-4 min-w-fit"
      >
        <span className="mx-1 opacity-70">{index + 1}.</span> {section.label}
      </TabsTrigger>
    ));
  }, [patientTemplate.sections]);

  // Memoize patient status options to prevent unnecessary rerenders
  const memoizedStatusOptions = useMemo(() => {
    return patientStatusOptions;
  }, [patientStatusOptions]);

  return (
    <Form {...form}>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="relative mb-4" dir={dir}>
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg -z-10" />
          <TabsList className="mb-2 overflow-x-auto flex no-scrollbar whitespace-nowrap p-2 rounded-lg bg-transparent justify-start">
            {tabsTriggers}
          </TabsList>
          <div className="h-1 bg-gradient-to-r from-green-200 to-green-100 dark:from-green-800/70 dark:to-green-700/70 rounded-full mb-4" />
        </div>

        {tabsContent}
      </Tabs>

      {/* Patient Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-white dark:bg-slate-800/90 rounded-lg p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm"
      >
        <h3 className="font-medium text-lg text-green-700 dark:text-green-400 mb-4 pb-2 dark:border-green-900/50">
          {t("patientStatus")}
        </h3>
        <PatientStatus form={form} statusOptions={memoizedStatusOptions} />
      </motion.div>
    </Form>
  );
});

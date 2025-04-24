import { IStatus } from "@/app/_types/Patient";
import { PatientTemplate } from "@/app/_types/Template";
import { FormFields } from "@/app/patients/add-patient/_components/FormFields";
import { PatientStatus } from "@/app/patients/add-patient/_components/PatientStatus";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
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
}

export function PatientForm({
  activeTab,
  setActiveTab,
  patientTemplate,
  form,
}: PatientFormProps) {
  return (
    <Form {...form}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-green-50 dark:bg-slate-800 border dark:border-green-900 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {patientTemplate.sections.map((section) => (
            <TabsTrigger
              key={section.name}
              value={section.name}
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {patientTemplate.sections.map((section) => (
          <TabsContent key={section.name} value={section.name}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
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
        ))}
      </Tabs>

      {/* Patient Status */}
      <div className="mt-8">
        <PatientStatus selectedTemplate={patientTemplate} form={form} />
      </div>
    </Form>
  );
}

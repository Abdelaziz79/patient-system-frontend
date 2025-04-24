import { useTemplates } from "@/app/_hooks/useTemplates";
import { PatientTemplate } from "@/app/_types/Template";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList, FileCheck, Loader2 } from "lucide-react";

interface TemplateSelectionProps {
  selectedTemplate: PatientTemplate | null;
  setSelectedTemplate: (template: PatientTemplate) => void;
}

export const TemplateSelection = ({
  selectedTemplate,
  setSelectedTemplate,
}: TemplateSelectionProps) => {
  const { templates, isLoading: loadingTemplates } = useTemplates();

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
          <ClipboardList className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Select Patient Template
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Choose a template to use for this patient record
        </p>
      </div>

      {loadingTemplates ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {templates &&
            templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  "cursor-pointer p-5 rounded-lg border-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1",
                  selectedTemplate?.id === template.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700"
                    : "border-gray-200 hover:border-blue-300 dark:border-slate-700 dark:hover:border-blue-600"
                )}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {template.name}
                    </h3>
                    {template.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {template.description}
                      </p>
                    )}
                  </div>
                  {selectedTemplate?.id === template.id ? (
                    <CheckCircle2 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  ) : (
                    <FileCheck className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                  >
                    {template.sections.length}{" "}
                    {template.sections.length === 1 ? "Section" : "Sections"}
                  </Badge>
                  {template.isDefault && (
                    <Badge className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                      Default
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
};

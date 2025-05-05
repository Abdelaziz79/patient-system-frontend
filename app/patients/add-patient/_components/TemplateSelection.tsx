import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useTemplates } from "@/app/_hooks/template/useTemplates";
import { PatientTemplate } from "@/app/_types/Template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck,
  Loader2,
  RefreshCcw,
} from "lucide-react";

interface TemplateSelectionProps {
  selectedTemplate: PatientTemplate | null;
  setSelectedTemplate: (template: PatientTemplate) => void;
  onNext?: () => void;
}

export const TemplateSelection = ({
  selectedTemplate,
  setSelectedTemplate,
  onNext,
}: TemplateSelectionProps) => {
  const { t, isRTL } = useLanguage();
  const {
    templates,
    isLoading: loadingTemplates,
    error,
    refetch,
  } = useTemplates();

  // Make sure templates exists and has items
  const hasTemplates = Array.isArray(templates) && templates.length > 0;

  return (
    <div className="space-y-6 py-4">
      <div className={cn("space-y-2", isRTL && "text-right")}>
        <h2
          className={cn(
            "text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center",
            isRTL && "flex-row-reverse"
          )}
        >
          <ClipboardList className="h-5 w-5 mx-2 text-blue-600 dark:text-blue-400" />
          {t("selectPatientTemplate") || "Select Patient Template"}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t("chooseTemplateDescription") ||
            "Choose a template to use for this patient record"}
        </p>
      </div>

      {loadingTemplates ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400" />
        </div>
      ) : error ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center py-10 text-center",
            isRTL && "text-right"
          )}
        >
          <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
            {t("errorLoadingTemplates") || "Error Loading Templates"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-4">
            {error?.toString() ||
              t("failedToLoadTemplates") ||
              "Failed to load templates. Please try again."}
          </p>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}
          >
            <RefreshCcw className="h-4 w-4" />
            {t("tryAgain") || "Try Again"}
          </Button>
        </div>
      ) : !hasTemplates ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center py-10 text-center",
            isRTL && "text-right"
          )}
        >
          <FileCheck className="h-10 w-10 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
            {t("noTemplatesAvailable") || "No Templates Available"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-4">
            {t("noTemplatesFoundDescription") ||
              "No patient templates found. Please create a template first or contact your administrator."}
          </p>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}
          >
            <RefreshCcw className="h-4 w-4" />
            {t("refresh") || "Refresh"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {templates.map((template, index) => (
            <motion.div
              key={template.id || index}
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
              <div
                className={cn(
                  "flex items-start justify-between",
                  isRTL && "flex-row-reverse"
                )}
              >
                <div className={isRTL ? "text-right" : ""}>
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

              <div
                className={cn(
                  "mt-3 flex flex-wrap gap-2",
                  isRTL && "flex-row-reverse"
                )}
              >
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                >
                  {template.sections?.length || 0}{" "}
                  {!template.sections?.length || template.sections.length === 1
                    ? t("section")
                    : t("sections")}
                </Badge>
                {template.isDefault && (
                  <Badge className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                    {t("default")}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedTemplate && onNext && (
        <div
          className={cn("flex justify-end mt-6", isRTL && "flex-row-reverse")}
        >
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onNext}
          >
            {isRTL ? (
              <>
                <ArrowRight className="mx-2 h-4 w-4 rotate-180" />
                {t("continueToPatientInfo") || "Continue to Patient Info"}
              </>
            ) : (
              <>
                {t("continueToPatientInfo") || "Continue to Patient Info"}{" "}
                <ArrowRight className="mx-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

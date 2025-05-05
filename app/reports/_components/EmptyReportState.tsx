import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileBarChart } from "lucide-react";
import React from "react";

interface EmptyReportStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  noAction?: boolean;
  icon?: React.ReactNode;
  onCreateNew?: () => void;
}

export const EmptyReportState: React.FC<EmptyReportStateProps> = ({
  title = "No Reports Found",
  description = "You don't have any reports yet. Create your first report to get started.",
  actionLabel = "Create Report",
  onAction,
  noAction = false,
  icon,
  onCreateNew,
}) => {
  const { t, isRTL } = useLanguage();

  const handleAction = onAction || onCreateNew;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full shadow-inner">
        {icon || (
          <FileBarChart className="h-16 w-16 text-blue-300 dark:text-blue-600" />
        )}
      </div>
      <h3 className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-md">
        {description}
      </p>
      {!noAction && actionLabel && handleAction && (
        <Button
          onClick={handleAction}
          variant="default"
          size="sm"
          className="mt-6 bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

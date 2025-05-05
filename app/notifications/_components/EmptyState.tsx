import React from "react";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  const { isRTL } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mb-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-full">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-md">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
};

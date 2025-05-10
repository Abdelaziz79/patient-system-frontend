import { useLanguage } from "@/app/_contexts/LanguageContext";
import { PatientTemplate } from "@/app/_types/Template";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  Copy,
  EyeIcon,
  GlobeIcon,
  Layers,
  LockIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

const TemplateCard = ({
  template,
  onDelete,
  onDuplicate,
  handleViewTemplate,
  handleEditTemplate,
  userId,
  userRole,
}: {
  template: PatientTemplate;
  onDelete: (id: string) => void;
  onDuplicate: (template: PatientTemplate) => void;
  handleViewTemplate: (id: string) => void;
  handleEditTemplate: (id: string) => void;
  userId: string;
  userRole: string;
}) => {
  const { t, isRTL, dir } = useLanguage();
  // Ensure the template has a valid ID to use
  const templateId = (template.id || template._id || "").toString();

  if (!templateId) {
    console.error("Template without ID:", template);
    return null;
  }

  // Check if user has permission to edit/delete this template
  const hasPermission =
    userRole === "super_admin" ||
    (template.createdBy &&
      (typeof template.createdBy === "string"
        ? template.createdBy === userId
        : template.createdBy.id === userId));

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className=" bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100/60 dark:border-gray-700/60 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      transition={{ duration: 0.5, type: "tween", ease: "easeOut" }}
      dir={dir}
    >
      <div className="relative p-5">
        {/* Colored accent bar at top of card */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>

        <div className={`flex flex-wrap gap-1 items-start`}>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              {template.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
              {template.description || t("noDescriptionProvided")}
            </p>
          </div>
          <div className={`flex flex-col space-y-1`}>
            {template.isDefault && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 px-2 py-0.5 rounded-full flex items-center">
                <GlobeIcon className={`h-3 w-3 ${isRTL ? "mx-1" : "mx-1"}`} />
                {t("default")}
              </Badge>
            )}
            {template.isPrivate && (
              <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700/60 dark:text-gray-300 px-2 py-0.5 rounded-full flex items-center">
                <LockIcon className={`h-3 w-3 ${isRTL ? "mx-1" : "mx-1"}`} />
                {t("private")}
              </Badge>
            )}
          </div>
        </div>

        <div
          className={`mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400 ${
            isRTL ? "gap-x-reverse gap-x-4" : "gap-x-4"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-green-500 dark:text-green-400" />
            <span>
              {template.sections?.length || 0}{" "}
              {template.sections?.length === 1 ? t("section") : t("sections")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <span>
              {new Date(template.createdAt || new Date()).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                }
              )}
            </span>
          </div>
        </div>

        <motion.div
          className="mt-6 flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700/50"
          initial={{ opacity: 0.8 }}
          transition={{ duration: 0.4 }}
        >
          <div className={`flex ${isRTL ? "flex-row-reverse gap-1" : "gap-1"}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30 rounded-lg transition-all duration-200"
              onClick={() => handleViewTemplate(templateId)}
            >
              <EyeIcon className={`h-4 w-4 ${isRTL ? "mx-1" : "mx-1"}`} />
              {t("view")}
            </Button>

            {hasPermission && (
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                onClick={() => handleEditTemplate(templateId)}
              >
                <PencilIcon className={`h-4 w-4 ${isRTL ? "mx-1" : "mx-1"}`} />
                {t("edit")}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/30 rounded-lg transition-all duration-200"
              onClick={() => onDuplicate(template)}
            >
              <Copy className={`h-4 w-4 ${isRTL ? "mx-1" : "mx-1"}`} />
              {t("duplicate")}
            </Button>
          </div>

          {hasPermission && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
              onClick={() => onDelete(templateId)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </motion.div>

        {/* Visual elements to enhance the card */}
      </div>
    </motion.div>
  );
};

export default TemplateCard;

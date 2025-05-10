"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useTemplates } from "@/app/_hooks/template/useTemplates";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { PatientTemplate } from "@/app/_types/Template";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import {
  BrainCircuitIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AITemplateDialog } from "./dialogs/AITemplateDialog";
import TemplateCard from "./TemplateCard";

export default function TemplatesPage() {
  const router = useRouter();
  const [showAIDialog, setShowAIDialog] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuthContext();

  const {
    templates,
    isLoading: apiLoading,
    searchTerm,
    setSearchTerm,
    createTemplate,
    deleteTemplate,
  } = useTemplates();

  const handleCreateTemplate = () => {
    router.push("/templates/new");
  };

  const handleEditTemplate = (id: string) => {
    router.push(`/templates/${id}`);
  };

  const handleViewTemplate = (id: string) => {
    router.push(`/templates/${id}?view=true`);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!id) return;

    try {
      const result = await deleteTemplate(id);
      if (result.success) {
        toast.success(t("templateDeletedSuccess"));
      } else {
        toast.error(result.error || t("failedToDeleteTemplate"));
      }
    } catch (error) {
      toast.error(t("errorDeletingTemplate"));
      console.error("Delete error:", error);
    }
  };

  const handleDuplicateTemplate = async (template: PatientTemplate) => {
    // Remove ID and modify name for the duplicate
    const { ...templateData } = template;
    const duplicateData = {
      ...templateData,
      name: `${template.name} (${t("copy")})`,
      isDefault: false,
      isPrivate: true, // Set isPrivate to true for duplicated templates
    };

    try {
      const result = await createTemplate(
        duplicateData as Partial<PatientTemplate>
      );
      if (result.success) {
        toast.success(t("templateDuplicatedSuccess"));
      } else {
        toast.error(result.error || t("failedToDuplicateTemplate"));
        console.error("Failed to duplicate template:", result.error);
      }
    } catch (error) {
      toast.error(t("errorDuplicatingTemplate"));
      console.error("Duplication error:", error);
    }
  };

  const handleAIGenerate = () => {
    setShowAIDialog(false);
    router.push("/templates/new");
  };

  // Staggered animation for the template cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        {/* Background decorative elements */}
        <div className="absolute top-20 -left-20 w-64 h-64 bg-green-400 rounded-full filter blur-3xl opacity-10 dark:opacity-5 -z-10"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-10 dark:opacity-5 -z-10"></div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-500 to-blue-600 dark:from-green-400 dark:to-blue-500 bg-clip-text text-transparent mb-3">
              {t("templates")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t("manageTemplates")}
            </p>
          </motion.div>
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 dark:from-green-600 dark:to-green-800 dark:hover:from-green-500 dark:hover:to-green-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl px-6 py-2.5 rounded-lg flex items-center"
              onClick={handleCreateTemplate}
            >
              <PlusIcon className="mx-2 h-4 w-4" />
              <span>{t("createTemplate")}</span>
              <ChevronRightIcon className="mx-1 h-4 w-4 opacity-70" />
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl px-6 py-2.5 rounded-lg flex items-center"
              onClick={() => setShowAIDialog(true)}
            >
              <BrainCircuitIcon className="mx-2 h-4 w-4" />
              <span>{t("aiGenerate")}</span>
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
                className="mx-2"
              >
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </motion.div>
            </Button>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="relative rounded-xl overflow-hidden shadow-md transition-all duration-300 focus-within:shadow-lg dark:shadow-gray-900/30">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder={t("searchTemplates")}
              className="px-12 py-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500 dark:focus:border-green-400 dark:focus:ring-green-400 rounded-xl text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <motion.div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-30 dark:opacity-20"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Templates grid */}
        <motion.div
          className="rounded-xl border border-gray-100/80 dark:border-gray-800/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-600 dark:from-green-400 dark:to-blue-500 bg-clip-text text-transparent">
              {t("availableTemplates")}
            </h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <UserIcon className="h-4 w-4 mx-1.5 text-blue-500 dark:text-blue-400" />
              <span>
                {templates.length}{" "}
                {templates.length === 1 ? t("template") : t("templates")}
              </span>
            </div>
          </div>

          {apiLoading ? (
            <div className="text-center py-16">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-16 h-16 mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full border-t-2 border-b-2 border-green-500"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full border-r-2 border-l-2 border-blue-500"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                  {t("loadingTemplates")}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  {t("preparingYourContent")}
                </p>
              </motion.div>
            </div>
          ) : templates.length === 0 ? (
            <motion.div
              className="col-span-full flex flex-col items-center justify-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <PlusIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-6">
                {t("noTemplatesFound")}
              </p>
              <Button
                onClick={handleCreateTemplate}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 dark:from-green-600 dark:to-green-800 dark:hover:from-green-500 dark:hover:to-green-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl px-6 py-2.5 rounded-lg"
              >
                <PlusIcon className="mx-2 h-4 w-4" />
                {t("createTemplate")}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {templates.map((template) => {
                  // Ensure template has a valid ID
                  const templateId = (
                    template.id ||
                    template._id ||
                    ""
                  ).toString();
                  if (!templateId) return null;

                  return (
                    <TemplateCard
                      key={templateId}
                      template={template}
                      onDelete={handleDeleteTemplate}
                      onDuplicate={handleDuplicateTemplate}
                      handleViewTemplate={handleViewTemplate}
                      handleEditTemplate={handleEditTemplate}
                      userId={user?.id || ""}
                      userRole={user?.role || ""}
                    />
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* AI Template Dialog */}
      <AITemplateDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
}

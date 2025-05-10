import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, SaveIcon } from "lucide-react";

interface FormFooterProps {
  isSaving: boolean;
  handleGoBack: () => void;
  handlePrevTab?: () => void;
  handleNextTab?: () => void;
  isFirstTab?: boolean;
  isLastSection?: boolean;
}

export function FormFooter({
  isSaving,
  handleGoBack,
  handlePrevTab,
  handleNextTab,
  isFirstTab = false,
  isLastSection = false,
}: FormFooterProps) {
  const { t, dir } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="w-full px-6 py-5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-sm"
      dir={dir}
    >
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoBack}
          className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-all duration-200"
        >
          {t("cancel")}
        </Button>

        {handlePrevTab && !isFirstTab && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevTab}
            className="border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> {t("back")}
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {handleNextTab && !isLastSection && (
          <motion.div whileHover={{ translateX: 3 }}>
            <Button
              type="button"
              onClick={handleNextTab}
              className="bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/50 dark:hover:bg-green-800/50 dark:text-green-300 flex items-center gap-1 shadow-sm transition-all duration-200"
            >
              {t("nextStep")}
            </Button>
          </motion.div>
        )}

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-wrap"
        >
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("saving")}
              </>
            ) : (
              <>
                <SaveIcon className="h-4 w-4" />
                {t("saveChanges")}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

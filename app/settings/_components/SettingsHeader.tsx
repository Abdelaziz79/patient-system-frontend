import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Settings } from "lucide-react";

export function SettingsHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <Settings className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent">
          {t("settings")}
        </h1>
      </div>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        {t("customizeSettings")}
      </p>
    </div>
  );
}

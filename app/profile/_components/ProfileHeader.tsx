import { useLanguage } from "@/app/_contexts/LanguageContext";

export function ProfileHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
        {t("myProfile")}
      </h1>
      <p className="text-green-600 dark:text-green-400">
        {t("viewManageAccount")}
      </p>
    </div>
  );
}

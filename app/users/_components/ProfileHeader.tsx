import { useLanguage } from "@/app/_contexts/LanguageContext";

export function ProfileHeader() {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
        {t("userProfile")}
      </h1>
      <p className="text-green-600 dark:text-green-400 mt-1">
        {t("viewManageAccount")}
      </p>
    </div>
  );
}

import ExportButtons from "@/app/_components/ExportButtons";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExportSettings() {
  const { t } = useLanguage();

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-emerald-100 dark:border-emerald-900 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent">
          {t("exportData")}
        </CardTitle>
      </CardHeader>
      <CardContent className={"pt-6"}>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t("exportDescription")}
        </p>
        <div className={"flex flex-wrap gap-3"}>
          <ExportButtons showAllOptions={true} />
        </div>
      </CardContent>
    </Card>
  );
}

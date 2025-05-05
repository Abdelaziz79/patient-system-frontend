import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CalendarDays, Edit, Printer } from "lucide-react";
import { FooterActionsProps } from "./types";
import { useLanguage } from "@/app/_contexts/LanguageContext";

export function FooterActions({
  handleGoBack,
  handlePrintPatient,
  handleEditPatient,
  setIsVisitDialogOpen,
}: FooterActionsProps) {
  const { t, dir } = useLanguage();

  return (
    <Card className="mt-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-indigo-100 dark:border-indigo-900 shadow-xl hover:shadow-indigo-100/30 dark:hover:shadow-indigo-900/30 transition-all duration-300">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="w-full sm:w-auto border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
          >
            <ArrowLeft className="h-4 w-4 mx-2" /> {t("backToPatients")}
          </Button>

          <div className={`flex flex-wrap gap-2  w-full sm:w-auto`} dir={dir}>
            <Button
              variant="outline"
              onClick={handlePrintPatient}
              className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <Printer className="h-4 w-4 mx-2" /> {t("print")}
            </Button>

            <Button
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white shadow transition-all duration-200"
              onClick={handleEditPatient}
            >
              <Edit className="h-4 w-4 mx-2" /> {t("editPatient")}
            </Button>

            <Button
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white shadow transition-all duration-200"
              onClick={() => setIsVisitDialogOpen(true)}
            >
              <CalendarDays className="h-4 w-4 mx-2" /> {t("addVisit")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
    <Card className="mt-3 sm:mt-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-indigo-100 dark:border-indigo-900 shadow-xl hover:shadow-indigo-100/30 dark:hover:shadow-indigo-900/30 transition-all duration-300">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="w-full xs:w-auto h-9 sm:h-10 text-xs sm:text-sm border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2" />{" "}
            {t("backToPatients")}
          </Button>

          <div
            className={`flex flex-wrap gap-1 sm:gap-2 w-full xs:w-auto`}
            dir={dir}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintPatient}
              className="h-9 sm:h-10 text-xs sm:text-sm bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <Printer className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2" />
              <span className="hidden xs:inline">{t("print")}</span>
              <span className="xs:hidden">Print</span>
            </Button>

            <Button
              size="sm"
              className="h-9 sm:h-10 text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white shadow transition-all duration-200"
              onClick={handleEditPatient}
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2" />
              <span className="hidden xs:inline">{t("editPatient")}</span>
              <span className="xs:hidden">Edit</span>
            </Button>

            <Button
              size="sm"
              className="h-9 sm:h-10 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white shadow transition-all duration-200"
              onClick={() => setIsVisitDialogOpen(true)}
            >
              <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2" />
              <span className="hidden xs:inline">{t("addVisit")}</span>
              <span className="xs:hidden">Visit</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

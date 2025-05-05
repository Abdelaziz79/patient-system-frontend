import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, FileText, Shield, Pill } from "lucide-react";
import { PatientTabsProps } from "./types";
import { PatientInfoTab, StatusTab, TreatmentTab, VisitsTab } from "./tabs";
import { useLanguage } from "@/app/_contexts/LanguageContext";

export function PatientTabs({
  patient,
  formatDate,
  handleDeleteVisit,
  handleRestoreVisit,
  isDeletingVisit,
  setIsVisitDialogOpen,
}: PatientTabsProps) {
  const { t, dir } = useLanguage();

  return (
    <Tabs defaultValue="sections" className="w-full" dir={dir as "ltr" | "rtl"}>
      <TabsList className="mb-6 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 shadow-md rounded-lg p-1 flex flex-wrap">
        <TabsTrigger
          value="sections"
          className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 rounded-md transition-all duration-200 flex-grow text-sm sm:text-base"
        >
          <FileText className="h-4 w-4 mx-1 sm:mx-2" />
          <span className="hidden xs:inline">{t("patientInformation")}</span>
          <span className="xs:hidden">{t("info")}</span>
        </TabsTrigger>
        <TabsTrigger
          value="visits"
          className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 rounded-md transition-all duration-200 flex-grow text-sm sm:text-base"
        >
          <CalendarDays className="h-4 w-4 mx-1 sm:mx-2" />
          <span className="hidden xs:inline">
            {t("visits")} ({patient?.visits?.length || 0})
          </span>
          <span className="xs:hidden">{t("visits")}</span>
        </TabsTrigger>
        <TabsTrigger
          value="status"
          className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 rounded-md transition-all duration-200 flex-grow text-sm sm:text-base"
        >
          <Shield className="h-4 w-4 mx-1 sm:mx-2" />
          <span className="hidden xs:inline">{t("statusHistory")}</span>
          <span className="xs:hidden">{t("status")}</span>
        </TabsTrigger>
        <TabsTrigger
          value="treatment"
          className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 rounded-md transition-all duration-200 flex-grow text-sm sm:text-base"
        >
          <Pill className="h-4 w-4 mx-1 sm:mx-2" />
          <span className="hidden xs:inline">{t("treatmentSuggestions")}</span>
          <span className="xs:hidden">{t("treatment")}</span>
        </TabsTrigger>
      </TabsList>

      {/* Patient Information Tab */}
      <TabsContent
        value="sections"
        className="animate-in fade-in-50 duration-300"
      >
        <PatientInfoTab patient={patient} formatDate={formatDate} />
      </TabsContent>

      {/* Visits Tab */}
      <TabsContent
        value="visits"
        className="animate-in fade-in-50 duration-300"
      >
        <VisitsTab
          patient={patient}
          formatDate={formatDate}
          handleDeleteVisit={handleDeleteVisit}
          handleRestoreVisit={handleRestoreVisit}
          isDeletingVisit={isDeletingVisit}
          setIsVisitDialogOpen={setIsVisitDialogOpen}
        />
      </TabsContent>

      {/* Status History Tab */}
      <TabsContent
        value="status"
        className="animate-in fade-in-50 duration-300"
      >
        <StatusTab patient={patient} formatDate={formatDate} />
      </TabsContent>

      {/* Treatment Suggestions Tab */}
      <TabsContent
        value="treatment"
        className="animate-in fade-in-50 duration-300"
      >
        <TreatmentTab patient={patient} formatDate={formatDate} />
      </TabsContent>
    </Tabs>
  );
}

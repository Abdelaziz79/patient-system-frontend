import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Pill } from "lucide-react";
import { TreatmentSuggestions } from "../TreatmentSuggestions";
import { PatientTreatmentTabProps } from "./types";

export function TreatmentTab({ patient }: PatientTreatmentTabProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-indigo-100 dark:border-slate-800 shadow-xl transition-all duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-indigo-800 dark:text-slate-300 flex items-center gap-2">
          <Pill className="h-5 w-5 text-indigo-600 dark:text-slate-400" />
          {t("treatmentSuggestions")}
        </CardTitle>
        <CardDescription className="text-indigo-600 dark:text-slate-400">
          {t("aiPoweredTreatmentSuggestions")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <TreatmentSuggestions patientId={patient?.id || ""} />
      </CardContent>
    </Card>
  );
}

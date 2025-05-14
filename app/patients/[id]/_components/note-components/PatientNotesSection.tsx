import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IPatient } from "@/app/_types/Patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { StickyNote } from "lucide-react";
import { NotesList } from "./NotesList";

interface PatientNotesSectionProps {
  patient: IPatient;
  onNotesUpdate?: () => void;
}

export function PatientNotesSection({
  patient,
  onNotesUpdate,
}: PatientNotesSectionProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-indigo-100 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 mb-3 sm:mb-6 rounded-lg overflow-hidden">
        <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 bg-gradient-to-r from-indigo-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 border-b border-indigo-50 dark:border-slate-800">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
            <CardTitle className="text-lg sm:text-xl text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5 sm:gap-2 font-semibold">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-md">
                <StickyNote className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              {t("patientNotes")}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="px-3 sm:px-6 py-3 sm:py-5">
          <NotesList patient={patient} onNoteUpdate={onNotesUpdate} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

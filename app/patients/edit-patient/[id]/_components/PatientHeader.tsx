import { IPatient } from "@/app/_types/Patient";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ArrowLeft, ClipboardEdit, User } from "lucide-react";
import { useLanguage } from "@/app/_contexts/LanguageContext";

interface PatientHeaderProps {
  patient: IPatient;
  formProgress: number;
  handleGoBack: () => void;
}

export function PatientHeader({
  patient,
  formProgress,
  handleGoBack,
}: PatientHeaderProps) {
  const { t, dir } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-900 dark:to-emerald-950 text-white px-6 py-5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl" />

      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-1 rounded-full"
                  onClick={handleGoBack}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </motion.div>
              <div className="flex items-center">
                <ClipboardEdit className="h-5 w-5 mx-2 text-green-200" />
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {t("editPatient")}
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-green-100 mt-1 opacity-90 px-9">
              {patient.sectionData?.personalinfo?.full_name ||
                `${patient.personalInfo?.firstName || ""} ${
                  patient.personalInfo?.lastName || ""
                }`}
              {(patient.personalInfo?.firstName ||
                patient.personalInfo?.lastName) &&
                " - "}
              {patient.templateId?.name || t("standardTemplate")}
            </CardDescription>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(255,255,255,0.2)",
            }}
            className="bg-white/20 p-3 rounded-full backdrop-blur-sm"
          >
            <User className="h-8 w-8 text-white" />
          </motion.div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs text-green-100 mb-2 font-medium">
            <span>{t("formProgress")}</span>
            <span>
              {formProgress}% {t("complete")}
            </span>
          </div>
          <div className="relative h-2 bg-green-800/40 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${formProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

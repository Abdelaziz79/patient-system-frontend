import { IPatient } from "@/app/_types/Patient";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";

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
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-900 dark:to-emerald-950 text-white px-6 py-5">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-1"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Edit Patient
            </CardTitle>
          </div>
          <CardDescription className="text-green-100 mt-1 opacity-90">
            {patient.sectionData?.personalinfo?.full_name || "Patient"} -{" "}
            {patient.templateId?.name || "Template"}
          </CardDescription>
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 p-3 rounded-full backdrop-blur-sm"
        >
          <User className="h-8 w-8 text-white" />
        </motion.div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-green-100 mb-1">
          <span>Progress</span>
          <span>{formProgress}%</span>
        </div>
        <Progress
          value={formProgress}
          className="h-1.5 bg-green-800/40 [&>div]:bg-white"
        />
      </div>
    </div>
  );
}

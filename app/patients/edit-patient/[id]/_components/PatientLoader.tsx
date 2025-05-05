import ErrorComp from "@/app/_components/ErrorComp";
import { IPatient } from "@/app/_types/Patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, FileX } from "lucide-react";
import { useLanguage } from "@/app/_contexts/LanguageContext";

interface PatientLoaderProps {
  loading: boolean;
  error: string | null;
  patient: IPatient | null;
  handleGoBack: () => void;
}

export function PatientLoader({
  loading,
  error,
  patient,
  handleGoBack,
}: PatientLoaderProps) {
  const { t, dir } = useLanguage();

  // Loading state
  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-white to-green-50 dark:from-slate-950 dark:to-slate-900"
        dir={dir}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border border-green-100 dark:border-green-900 overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-900 dark:to-emerald-950 p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                {t("loadingPatientData")}
              </h2>
              <p className="text-green-100 text-sm text-center">
                {t("pleaseWaitWhileWeRetrievePatient")}
              </p>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center">
              <LoadingSpinner size="lg" />
              <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
                {t("loadingPatientRecords")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-white to-green-50 dark:from-slate-950 dark:to-slate-900"
        dir={dir}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border border-red-100 dark:border-red-900 overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-900 dark:to-red-800 p-6 flex flex-col items-center">
              <AlertTriangle className="h-12 w-12 text-white mb-2" />
              <h2 className="text-xl font-semibold text-white">
                {t("errorLoadingPatient")}
              </h2>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
                {error}
              </p>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30"
                  onClick={handleGoBack}
                >
                  <ArrowLeft className="h-4 w-4" /> {t("goBack")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // No patient data
  if (!patient) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-white to-green-50 dark:from-slate-950 dark:to-slate-900"
        dir={dir}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-800 dark:to-gray-700 p-6 flex flex-col items-center">
              <FileX className="h-12 w-12 text-white mb-2" />
              <h2 className="text-xl font-semibold text-white">
                Patient Not Found
              </h2>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                {t("patientNotFoundDescription")}
              </p>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleGoBack}
                >
                  <ArrowLeft className="h-4 w-4" /> {t("backToPatients")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // If we have a patient, return null so the main component renders
  return null;
}

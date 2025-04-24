import ErrorComp from "@/app/_components/ErrorComp";
import Loading from "@/app/_components/Loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PatientLoaderProps } from "./types";

export function PatientLoader({
  loading,
  error,
  patient,
  handleGoBack,
}: PatientLoaderProps) {
  // Loading state
  if (loading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return <ErrorComp message={error} />;
  }

  // No patient data
  if (!patient) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Button
          variant="outline"
          className="mb-6 flex items-center gap-2"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Patients
        </Button>
        <Alert className="dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
          <AlertDescription>
            Patient not found. The ID might be invalid or the patient record may
            have been deleted.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If we have a patient, return null so the main component renders
  return null;
}

import ErrorComp from "@/app/_components/ErrorComp";
import { IPatient } from "@/app/_types/Patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft } from "lucide-react";

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
  // Loading state
  if (loading) {
    return <LoadingSpinner />;
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
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Patient not found. The ID might be invalid or the patient record
              may have been deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If we have a patient, return null so the main component renders
  return null;
}

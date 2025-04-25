import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAI } from "@/app/_hooks/useAI";
import LoadingInsights from "@/app/_components/ai/LoadingInsights";
import { Pill, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { TreatmentSuggestionsInput } from "@/app/_api/AIApi";

interface TreatmentSuggestionsProps {
  patientId: string;
}

export function TreatmentSuggestions({ patientId }: TreatmentSuggestionsProps) {
  const { getTreatmentSuggestions, isLoadingTreatment } = useAI();

  const [treatmentSuggestions, setTreatmentSuggestions] = useState<
    string | null
  >(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<TreatmentSuggestionsInput>({
    symptoms: "",
    currentTreatments: "",
    medicalHistory: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateSuggestions = async () => {
    if (!formData.symptoms) {
      toast.error("Please enter the symptoms");
      return;
    }

    try {
      setIsGenerating(true);
      const result = await getTreatmentSuggestions(patientId, formData);

      if (result.success) {
        setTreatmentSuggestions(result.data.suggestions);
        toast.success("Treatment suggestions generated successfully");
      } else {
        toast.error(result.message);
        console.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to generate treatment suggestions");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-700 dark:text-green-400">
            <Pill className="h-5 w-5 mr-2" />
            Treatment Suggestions Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symptoms">
              Symptoms <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="symptoms"
              name="symptoms"
              placeholder="Describe the patient's symptoms"
              value={formData.symptoms}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentTreatments">Current Treatments</Label>
            <Textarea
              id="currentTreatments"
              name="currentTreatments"
              placeholder="List current treatments and medications (optional)"
              value={formData.currentTreatments}
              onChange={handleInputChange}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              name="medicalHistory"
              placeholder="Enter relevant medical history (optional)"
              value={formData.medicalHistory}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <Button
            onClick={handleGenerateSuggestions}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={isGenerating || isLoadingTreatment}
          >
            <Stethoscope className="h-4 w-4 mr-2" />
            {isGenerating || isLoadingTreatment
              ? "Generating Suggestions..."
              : "Generate Treatment Suggestions"}
          </Button>
        </CardContent>
      </Card>

      <LoadingInsights
        isLoading={isLoadingTreatment}
        isGenerating={isGenerating}
        insights={treatmentSuggestions}
        title="AI Treatment Suggestions"
        loadingText="Analyzing and generating treatment options..."
        loadingSubtext="This may take a moment while we consider the patient's symptoms and medical history"
      />
    </div>
  );
}

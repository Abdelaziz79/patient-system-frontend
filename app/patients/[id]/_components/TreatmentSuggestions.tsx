import LoadingInsights from "@/app/_components/LoadingInsights";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { TreatmentSuggestionsInput } from "@/app/_hooks/AI/AIApi";
import { useAI } from "@/app/_hooks/AI/useAI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Pill, Sparkles, Star, Stethoscope } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface TreatmentSuggestionsProps {
  patientId: string;
}

export function TreatmentSuggestions({ patientId }: TreatmentSuggestionsProps) {
  const { t, dir, language } = useLanguage();
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
      toast.error(t("pleaseEnterSymptoms"));
      return;
    }

    try {
      setIsGenerating(true);
      const result = await getTreatmentSuggestions(
        patientId,
        formData,
        language === "ar" ? "arabic" : "english"
      );

      if (result.success) {
        setTreatmentSuggestions(result.data.suggestions);
        toast.success(t("treatmentSuggestionsGenerated"));
      } else {
        toast.error(result.message);
        console.error(result.message);
      }
    } catch (error) {
      toast.error(t("failedToGenerateTreatmentSuggestions"));
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Check if symptoms field is empty for button disabling
  const isSymptomsEmpty = !formData.symptoms || formData.symptoms.trim() === "";

  return (
    <div className="space-y-6" dir={dir}>
      <Card className="border-2 border-green-100 dark:border-green-900/50 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-green-50/90 to-white dark:from-slate-800/90 dark:to-slate-900/90">
        <CardHeader className="pb-2 border-b border-green-100 dark:border-green-900/50 bg-green-50/80 dark:bg-green-900/20 rounded-t-lg">
          <CardTitle className="flex items-center text-green-700 dark:text-green-400 text-lg">
            <Pill className="h-5 w-5 mx-2" />
            {t("treatmentSuggestionsGenerator")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-4">
          <div className="space-y-2">
            <Label
              htmlFor="symptoms"
              className="text-green-700 dark:text-green-400 font-medium flex items-center"
            >
              {t("symptoms")} <span className="text-red-500 mx-1">*</span>
              <AlertCircle className="h-3.5 w-3.5 mx-1 text-amber-500" />
            </Label>
            <Textarea
              id="symptoms"
              name="symptoms"
              placeholder={t("describePatientSymptoms")}
              value={formData.symptoms}
              onChange={handleInputChange}
              rows={3}
              required
              className="border-green-200 dark:border-green-900/50 focus:ring-green-500 dark:focus:ring-green-700"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("provideSymptomsAccurateSuggestions")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="currentTreatments"
                className="text-blue-600 dark:text-blue-400 font-medium flex items-center"
              >
                {t("currentTreatments")}
                <Star className="h-3.5 w-3.5 mx-1 text-blue-500" />
              </Label>
              <Textarea
                id="currentTreatments"
                name="currentTreatments"
                placeholder={t("listCurrentTreatments")}
                value={formData.currentTreatments}
                onChange={handleInputChange}
                rows={3}
                className="border-blue-200 dark:border-blue-900/50 focus:ring-blue-400 dark:focus:ring-blue-700"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="medicalHistory"
                className="text-purple-600 dark:text-purple-400 font-medium flex items-center"
              >
                {t("medicalHistory")}
                <Stethoscope className="h-3.5 w-3.5 mx-1 text-purple-500" />
              </Label>
              <Textarea
                id="medicalHistory"
                name="medicalHistory"
                placeholder={t("enterRelevantMedicalHistory")}
                value={formData.medicalHistory}
                onChange={handleInputChange}
                rows={3}
                className="border-purple-200 dark:border-purple-900/50 focus:ring-purple-400 dark:focus:ring-purple-700"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerateSuggestions}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-700 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-500 text-white shadow-md hover:shadow-lg transition-all duration-200 mt-4"
            disabled={isGenerating || isLoadingTreatment || isSymptomsEmpty}
          >
            <Sparkles className="h-4 w-4 mx-2" />
            {isGenerating || isLoadingTreatment
              ? t("generatingSuggestions")
              : t("generateTreatmentSuggestions")}
          </Button>
        </CardContent>
      </Card>

      <LoadingInsights
        isLoading={isLoadingTreatment}
        isGenerating={isGenerating}
        insights={treatmentSuggestions}
        title={t("aiTreatmentSuggestions")}
        loadingText={t("analyzingGeneratingTreatment")}
        loadingSubtext={t("treatmentConsideringPatientSymptoms")}
      />
    </div>
  );
}

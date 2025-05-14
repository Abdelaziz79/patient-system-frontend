import {
  aiApi,
  Template,
  TemplateGenerationInput,
  TreatmentSuggestionsInput,
  VisitNotesInput,
} from "@/app/_hooks/AI/AIApi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const useAI = () => {
  // State for errors
  const [error, setError] = useState<string | null>(null);

  // Patient insights mutation
  const insightsMutation = useMutation({
    mutationFn: ({
      patientId,
      language,
    }: {
      patientId: string;
      language?: string;
    }) => aiApi.getPatientInsights(patientId, language),
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Treatment suggestions mutation
  const treatmentMutation = useMutation({
    mutationFn: ({
      patientId,
      data,
      language,
    }: {
      patientId: string;
      data: TreatmentSuggestionsInput;
      language?: string;
    }) => aiApi.getTreatmentSuggestions(patientId, data, language),
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Template generation mutation
  const templateMutation = useMutation({
    mutationFn: ({
      data,
      language,
    }: {
      data: TemplateGenerationInput;
      language?: string;
    }) => aiApi.generateTemplate(data, language),
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Demographics summary mutation
  const demographicsMutation = useMutation({
    mutationFn: ({ language }: { language?: string } = {}) =>
      aiApi.getDemographicsSummary(language),
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Visit notes mutation
  const visitNotesMutation = useMutation({
    mutationFn: ({
      data,
      language,
    }: {
      data: VisitNotesInput;
      language?: string;
    }) => aiApi.generateVisitNotes(data, language),
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Get patient insights
  const getPatientInsights = async (
    patientId: string,
    language: string = "english"
  ): Promise<{ success: boolean; data?: any; message: string }> => {
    try {
      const data = await insightsMutation.mutateAsync({ patientId, language });
      return {
        success: true,
        data,
        message: "Patient insights generated successfully",
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "An error occurred while generating patient insights";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Get treatment suggestions
  const getTreatmentSuggestions = async (
    patientId: string,
    data: TreatmentSuggestionsInput,
    language: string = "english"
  ): Promise<{ success: boolean; data?: any; message: string }> => {
    try {
      const result = await treatmentMutation.mutateAsync({
        patientId,
        data,
        language,
      });
      return {
        success: true,
        data: result,
        message: "Treatment suggestions generated successfully",
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "An error occurred while generating treatment suggestions";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Generate template for condition
  const generateTemplate = async (
    data: TemplateGenerationInput,
    language: string = "english"
  ): Promise<{ success: boolean; data?: Template; message: string }> => {
    try {
      const template = await templateMutation.mutateAsync({ data, language });
      return {
        success: true,
        data: template,
        message: "Template generated successfully",
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "An error occurred while generating template";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Get demographics summary
  const getDemographicsSummary = async (
    language: string = "english"
  ): Promise<{
    success: boolean;
    data?: any;
    message: string;
  }> => {
    try {
      const data = await demographicsMutation.mutateAsync({ language });
      return {
        success: true,
        data,
        message: "Demographics summary generated successfully",
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "An error occurred while generating demographics summary";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Generate visit notes
  const generateVisitNotes = async (
    data: VisitNotesInput,
    language: string = "english"
  ): Promise<{ success: boolean; data?: any; message: string }> => {
    try {
      const result = await visitNotesMutation.mutateAsync({ data, language });
      return {
        success: true,
        data: result,
        message: "Visit notes generated successfully",
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "An error occurred while generating visit notes";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Clear errors
  const clearError = () => setError(null);

  return {
    // Methods
    getPatientInsights,
    getTreatmentSuggestions,
    generateTemplate,
    getDemographicsSummary,
    generateVisitNotes,
    clearError,

    // Loading states
    isLoadingInsights: insightsMutation.isPending,
    isLoadingTreatment: treatmentMutation.isPending,
    isLoadingTemplate: templateMutation.isPending,
    isLoadingDemographics: demographicsMutation.isPending,
    isLoadingVisitNotes: visitNotesMutation.isPending,

    // Error state
    error,

    // Raw mutation objects for advanced usage
    insightsMutation,
    treatmentMutation,
    templateMutation,
    demographicsMutation,
    visitNotesMutation,
  };
};

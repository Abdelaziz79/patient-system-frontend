import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  aiApi,
  Template,
  TemplateGenerationInput,
  TreatmentSuggestionsInput,
  VisitNotesInput,
} from "../_api/AIApi";

export const useAI = () => {
  // States for errors and loading
  const [error, setError] = useState<string | null>(null);

  // Patient insights mutation
  const insightsMutation = useMutation({
    mutationFn: aiApi.getPatientInsights,
    onSuccess: () => {
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Treatment suggestions mutation
  const treatmentMutation = useMutation({
    mutationFn: ({
      patientId,
      data,
    }: {
      patientId: string;
      data: TreatmentSuggestionsInput;
    }) => aiApi.getTreatmentSuggestions(patientId, data),
    onSuccess: () => {
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Template generation mutation
  const templateMutation = useMutation({
    mutationFn: aiApi.generateTemplate,
    onSuccess: () => {
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Demographics summary mutation
  const demographicsMutation = useMutation({
    mutationFn: aiApi.getDemographicsSummary,
    onSuccess: () => {
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Visit notes mutation
  const visitNotesMutation = useMutation({
    mutationFn: aiApi.generateVisitNotes,
    onSuccess: () => {
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Get patient insights
  const getPatientInsights = async (
    patientId: string
  ): Promise<{ success: boolean; data?: any; message: string }> => {
    setError(null);

    try {
      const data = await insightsMutation.mutateAsync(patientId);
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
      return { success: false, message: errorMsg };
    }
  };

  // Get treatment suggestions
  const getTreatmentSuggestions = async (
    patientId: string,
    data: TreatmentSuggestionsInput
  ): Promise<{ success: boolean; data?: any; message: string }> => {
    setError(null);

    try {
      const result = await treatmentMutation.mutateAsync({ patientId, data });
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
      return { success: false, message: errorMsg };
    }
  };

  // Generate template for condition
  const generateTemplate = async (
    data: TemplateGenerationInput
  ): Promise<{ success: boolean; data?: Template; message: string }> => {
    setError(null);

    try {
      const template = await templateMutation.mutateAsync(data);
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
      return { success: false, message: errorMsg };
    }
  };

  // Get demographics summary
  const getDemographicsSummary = async (): Promise<{
    success: boolean;
    data?: any;
    message: string;
  }> => {
    setError(null);

    try {
      const data = await demographicsMutation.mutateAsync();
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
      return { success: false, message: errorMsg };
    }
  };

  // Generate visit notes
  const generateVisitNotes = async (
    data: VisitNotesInput
  ): Promise<{ success: boolean; data?: any; message: string }> => {
    setError(null);

    try {
      const result = await visitNotesMutation.mutateAsync(data);
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
      return { success: false, message: errorMsg };
    }
  };

  return {
    // Methods
    getPatientInsights,
    getTreatmentSuggestions,
    generateTemplate,
    getDemographicsSummary,
    generateVisitNotes,

    // Loading states
    isLoadingInsights: insightsMutation.isPending,
    isLoadingTreatment: treatmentMutation.isPending,
    isLoadingTemplate: templateMutation.isPending,
    isLoadingDemographics: demographicsMutation.isPending,
    isLoadingVisitNotes: visitNotesMutation.isPending,

    // Error state
    error,
    setError,

    // Raw mutation objects for advanced usage
    insightsMutation,
    treatmentMutation,
    templateMutation,
    demographicsMutation,
    visitNotesMutation,
  };
};

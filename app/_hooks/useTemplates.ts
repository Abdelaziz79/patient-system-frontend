import { PatientTemplate } from "@/app/_types/Template";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { templateApi } from "../_api/templateApi";

export interface TemplatesState {
  templates: PatientTemplate[];
  isLoading: boolean;
  error: string | null;
}

export const useTemplates = (initialFetch = true) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Query for fetching all templates
  const {
    data: templates,
    isPending,
    error,
    failureReason,
    refetch,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: templateApi.getTemplates,
    enabled: initialFetch, // Only fetch on mount if initialFetch is true
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Mutation for creating a template
  const createMutation = useMutation({
    mutationFn: templateApi.createTemplate,
    onSuccess: (newTemplate) => {
      queryClient.setQueryData(
        ["templates"],
        (oldData: PatientTemplate[] | undefined) =>
          oldData ? [...oldData, newTemplate] : [newTemplate]
      );
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  // Mutation for updating a template
  const updateMutation = useMutation({
    mutationFn: templateApi.updateTemplate,
    onSuccess: (updatedTemplate) => {
      // Update specific template in cache
      queryClient.setQueryData(
        ["templates", updatedTemplate.id],
        updatedTemplate
      );

      // Update template in the list
      queryClient.setQueryData(
        ["templates"],
        (oldData: PatientTemplate[] | undefined) => {
          if (!oldData) return [updatedTemplate];
          return oldData.map((template) =>
            template.id === updatedTemplate.id ? updatedTemplate : template
          );
        }
      );

      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  // Mutation for deleting a template
  const deleteMutation = useMutation({
    mutationFn: templateApi.deleteTemplate,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(
        ["templates"],
        (oldData: PatientTemplate[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((template) => template.id !== deletedId);
        }
      );
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  // Query function to get a single template by ID
  const getTemplate = async (id: string) => {
    // First check if it's in the cache
    const cachedTemplate = queryClient.getQueryData<PatientTemplate>([
      "templates",
      id,
    ]);
    if (cachedTemplate) return cachedTemplate;

    // If not in cache, fetch it
    try {
      const template = await templateApi.getTemplateById(id);
      queryClient.setQueryData(["templates", id], template);
      return template;
    } catch (error) {
      console.error("Error fetching template:", error);
      throw error;
    }
  };

  // Filter templates based on search term
  const filteredTemplates =
    templates && searchTerm
      ? templates.filter(
          (template) =>
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            false
        )
      : templates || [];

  // Helper functions
  const createTemplate = async (templateData: Partial<PatientTemplate>) => {
    try {
      const data = await createMutation.mutateAsync(templateData);
      return { success: true, data };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to create template";
      return { success: false, error: errorMsg };
    }
  };

  const updateTemplate = async (id: string, data: Partial<PatientTemplate>) => {
    try {
      const updatedData = await updateMutation.mutateAsync({ id, data });
      return { success: true, data: updatedData };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update template";
      return { success: false, error: errorMsg };
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete template";
      return { success: false, error: errorMsg };
    }
  };

  // Extract error message from failureReason
  const errorMessage = failureReason
    ? failureReason instanceof Error
      ? failureReason.message
      : "An error occurred"
    : null;

  return {
    templates: filteredTemplates,
    allTemplates: templates || [],
    isLoading: isPending,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error: errorMessage,
    searchTerm,
    setSearchTerm,
    isFiltering,
    setIsFiltering,
    refetch,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};

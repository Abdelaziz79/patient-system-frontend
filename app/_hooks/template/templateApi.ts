import { PatientTemplate } from "@/app/_types/Template";
import axios from "axios";
import { createAuthConfig } from "../utils/authUtils";

const templatesUrl =
  process.env.NEXT_PUBLIC_BACK_URL + "/api/patient-templates";

// API functions for template operations
export const templateApi = {
  // Get all templates
  getTemplates: async (): Promise<PatientTemplate[]> => {
    const response = await axios.get<{
      success: boolean;
      data: PatientTemplate[];
      count: number;
    }>(templatesUrl, createAuthConfig());

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to fetch templates");
  },

  // Get template by ID
  getTemplateById: async (id: string): Promise<PatientTemplate> => {
    const response = await axios.get<{
      success: boolean;
      data: PatientTemplate;
    }>(`${templatesUrl}/${id}`, createAuthConfig());

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to fetch template");
  },

  // Create new template
  createTemplate: async (
    templateData: Partial<PatientTemplate>
  ): Promise<PatientTemplate> => {
    const response = await axios.post<{
      success: boolean;
      data: PatientTemplate;
    }>(templatesUrl, templateData, createAuthConfig());

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to create template");
  },

  // Create default template
  createDefaultTemplate: async (name?: string): Promise<PatientTemplate> => {
    const response = await axios.post<{
      success: boolean;
      data: PatientTemplate;
    }>(`${templatesUrl}/default`, { name }, createAuthConfig());

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to create default template");
  },

  // Update template
  updateTemplate: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<PatientTemplate>;
  }): Promise<PatientTemplate> => {
    const response = await axios.put<{
      success: boolean;
      data: PatientTemplate;
    }>(`${templatesUrl}/${id}`, data, createAuthConfig());

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to update template");
  },

  // Delete template
  deleteTemplate: async (id: string): Promise<void> => {
    const response = await axios.delete<{ success: boolean }>(
      `${templatesUrl}/${id}`,
      createAuthConfig()
    );

    if (!response.data.success) {
      throw new Error("Failed to delete template");
    }
  },
};

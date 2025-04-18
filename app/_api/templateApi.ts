import axios from "axios";
import { PatientTemplate } from "../_types/Template";

const templatesUrl =
  process.env.NEXT_PUBLIC_BACK_URL + "/api/patient-templates";

// API functions for template operations
export const templateApi = {
  // Get all templates
  getTemplates: async (): Promise<PatientTemplate[]> => {
    const res = await axios.get(`${templatesUrl}`, { withCredentials: true });
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.message || "Failed to fetch templates");
  },

  // Get a single template by ID
  getTemplateById: async (id: string): Promise<PatientTemplate> => {
    const res = await axios.get(`${templatesUrl}/${id}`, {
      withCredentials: true,
    });
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.message || "Failed to fetch template");
  },

  // Create a new template
  createTemplate: async (
    templateData: Partial<PatientTemplate>
  ): Promise<PatientTemplate> => {
    const res = await axios.post(`${templatesUrl}`, templateData, {
      withCredentials: true,
    });
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.message || "Failed to create template");
  },

  // Update an existing template
  updateTemplate: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<PatientTemplate>;
  }): Promise<PatientTemplate> => {
    const res = await axios.put(`${templatesUrl}/${id}`, data, {
      withCredentials: true,
    });
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.message || "Failed to update template");
  },

  // Delete a template
  deleteTemplate: async (id: string): Promise<void> => {
    const res = await axios.delete(`${templatesUrl}/${id}`, {
      withCredentials: true,
    });
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to delete template");
    }
  },
};

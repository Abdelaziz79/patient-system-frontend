import axios from "axios";
import { createAuthConfig } from "../utils/authUtils";

// Base URL for AI endpoints
const aiUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/ai";

// Interface for template fields
interface TemplateField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  description?: string;
  order: number;
}

// Interface for template sections
interface TemplateSection {
  name: string;
  label: string;
  description?: string;
  order: number;
  fields: TemplateField[];
}

// Interface for template structure
export interface Template {
  name: string;
  description: string;
  sections: TemplateSection[];
  createdBy?: any;
  lastUpdatedBy?: any;
  isPrivate?: boolean;
}

// Interface for treatment suggestions input
export interface TreatmentSuggestionsInput {
  symptoms?: string;
  currentTreatments?: string;
  medicalHistory?: string;
}

// Interface for visit notes input
export interface VisitNotesInput {
  symptoms?: string;
  observations?: string;
  patientResponses?: string;
  patientId: string;
}

// Interface for template generation input
export interface TemplateGenerationInput {
  condition: string;
  specialization?: string;
}

// API functions
export const aiApi = {
  // Get patient insights
  getPatientInsights: async (
    patientId: string,
    language: string = "english"
  ): Promise<any> => {
    const response = await axios.get(
      `${aiUrl}/patients/${patientId}/insights?language=${language}`,
      createAuthConfig()
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to get patient insights");
  },

  // Get treatment suggestions
  getTreatmentSuggestions: async (
    patientId: string,
    data: TreatmentSuggestionsInput,
    language: string = "english"
  ): Promise<any> => {
    const response = await axios.post(
      `${aiUrl}/patients/${patientId}/treatment-suggestions?language=${language}`,
      data,
      createAuthConfig()
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to get treatment suggestions"
    );
  },

  // Generate template for condition
  generateTemplate: async (
    data: TemplateGenerationInput,
    language: string = "english"
  ): Promise<Template> => {
    const response = await axios.post(
      `${aiUrl}/generate-template?language=${language}`,
      data,
      createAuthConfig()
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to generate template");
  },

  // Get demographics summary
  getDemographicsSummary: async (
    language: string = "english"
  ): Promise<any> => {
    const response = await axios.get(
      `${aiUrl}/demographics-summary?language=${language}`,
      createAuthConfig()
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to get demographics summary"
    );
  },

  // Generate visit notes
  generateVisitNotes: async (
    data: VisitNotesInput,
    language: string = "english"
  ): Promise<any> => {
    const response = await axios.post(
      `${aiUrl}/visit-notes-assistant?language=${language}`,
      data,
      createAuthConfig()
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to generate visit notes");
  },
};

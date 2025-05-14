import axios from "axios";
import { createAuthConfig } from "../utils/authUtils";
import { IEvent, IEventInput } from "@/app/_types/Patient";

const baseUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api";

// Interface for event analysis request
export interface IEventAnalysisRequest {
  eventIds: string[];
  patientId: string;
  analysisType?: "impact" | "correlation" | "recommendation" | "overview";
  timeframe?: string;
  includedFactors?: string[];
}

// Interface for event analysis response
export interface IEventAnalysisResponse {
  analysis: string;
  recommendations?: string[];
  relatedEvents?: Array<{
    eventId: string;
    relation: string;
    confidence: number;
  }>;
  metrics?: Record<string, any>;
  generatedAt: Date;
}

// Interface for event timeline response
export interface IEventTimelineResponse {
  events: IEvent[];
  timelineMetrics: {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsByImportance: Record<string, number>;
    timeDistribution: Array<{
      period: string;
      count: number;
    }>;
  };
}

// Interface for event insights response
export interface IEventInsightsResponse {
  insights: string;
  patientName: string;
  eventsAnalyzed: number;
}

// Interface for event recommendations response
export interface IEventRecommendationsResponse {
  recommendations: string;
  patientName: string;
  eventsAnalyzed: number;
}

// Interface for event correlation response
export interface IEventCorrelationResponse {
  correlation: string;
  patientName: string;
  eventsAnalyzed: number;
}

// Events API methods
export const eventsApi = {
  // Get all events for a patient
  getPatientEvents: async (
    patientId: string,
    params?: {
      query?: string;
      eventType?: string;
      importance?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      page?: number;
    }
  ): Promise<IEvent[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${baseUrl}/events/${patientId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await axios.get(url, createAuthConfig());
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch events");
  },

  // Add a new event
  addEvent: async ({
    patientId,
    eventData,
  }: {
    patientId: string;
    eventData: IEventInput;
  }): Promise<IEvent> => {
    const response = await axios.post(
      `${baseUrl}/events/${patientId}`,
      eventData,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to add event");
  },

  // Update an event
  updateEvent: async ({
    patientId,
    eventId,
    eventData,
  }: {
    patientId: string;
    eventId: string;
    eventData: Partial<IEvent>;
  }): Promise<IEvent> => {
    const response = await axios.put(
      `${baseUrl}/events/${patientId}/${eventId}`,
      eventData,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update event");
  },

  // Delete an event
  deleteEvent: async ({
    patientId,
    eventId,
  }: {
    patientId: string;
    eventId: string;
  }): Promise<boolean> => {
    const response = await axios.delete(
      `${baseUrl}/events/${patientId}/${eventId}`,
      createAuthConfig()
    );
    if (response.data.success) {
      return true;
    }
    throw new Error(response.data.message || "Failed to delete event");
  },

  // Restore a deleted event
  restoreEvent: async ({
    patientId,
    eventId,
  }: {
    patientId: string;
    eventId: string;
  }): Promise<IEvent> => {
    const response = await axios.patch(
      `${baseUrl}/events/${patientId}/${eventId}/restore`,
      {},
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to restore event");
  },

  // Get a specific event by ID
  getEventById: async ({
    patientId,
    eventId,
  }: {
    patientId: string;
    eventId: string;
  }): Promise<IEvent> => {
    const response = await axios.get(
      `${baseUrl}/events/${patientId}/${eventId}`,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch event");
  },

  // Get event timeline
  getEventTimeline: async (
    patientId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      eventTypes?: string[];
    }
  ): Promise<IEventTimelineResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(`${key}[]`, v));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    const url = `${baseUrl}/events/${patientId}/timeline${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await axios.get(url, createAuthConfig());
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch event timeline");
  },

  // AI-powered event analysis
  analyzeEvents: async (
    request: IEventAnalysisRequest
  ): Promise<IEventAnalysisResponse> => {
    const response = await axios.post(
      `${baseUrl}/events/ai/analyze`,
      request,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to analyze events");
  },

  // Get AI-generated event insights
  getEventInsights: async (
    patientId: string,
    language: string = "english"
  ): Promise<IEventInsightsResponse> => {
    const response = await axios.get(
      `${baseUrl}/events/ai/insights/${patientId}?language=${language}`,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to get event insights");
  },

  // Get AI-generated event recommendations
  getEventRecommendations: async (
    patientId: string,
    eventType?: string,
    language: string = "english"
  ): Promise<IEventRecommendationsResponse> => {
    const queryParams = new URLSearchParams();
    if (eventType) {
      queryParams.append("eventType", eventType);
    }
    queryParams.append("language", language);

    const url = `${baseUrl}/events/ai/recommendations/${patientId}?${queryParams.toString()}`;

    const response = await axios.get(url, createAuthConfig());
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to get event recommendations"
    );
  },

  // Get AI-generated event correlation analysis
  getEventCorrelation: async (
    patientId: string,
    language: string = "english"
  ): Promise<IEventCorrelationResponse> => {
    const response = await axios.get(
      `${baseUrl}/events/ai/correlation/${patientId}?language=${language}`,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to get event correlation analysis"
    );
  },

  // Get critical events that need attention
  getCriticalEvents: async (params?: {
    adminId?: string;
    limit?: number;
    unaddressedOnly?: boolean;
  }): Promise<IEvent[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${baseUrl}/events/critical${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await axios.get(url, createAuthConfig());
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch critical events");
  },

  // Mark event as addressed
  markEventAsAddressed: async (eventId: string): Promise<boolean> => {
    const response = await axios.put(
      `${baseUrl}/events/${eventId}/mark-addressed`,
      {},
      createAuthConfig()
    );
    if (response.data.success) {
      return true;
    }
    throw new Error(
      response.data.message || "Failed to mark event as addressed"
    );
  },
};

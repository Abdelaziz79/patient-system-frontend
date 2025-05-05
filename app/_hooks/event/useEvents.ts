import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  eventsApi,
  IEventAnalysisRequest,
  IEventInsightsResponse,
  IEventRecommendationsResponse,
  IEventCorrelationResponse,
} from "@/app/_hooks/event/eventsApi";
import { IEvent, IEventInput } from "@/app/_types/Patient";
import axios from "axios";
import { toast } from "react-hot-toast";

interface UseEventsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useEvents = (options: UseEventsOptions = {}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Query for fetching patient events
  const usePatientEvents = (
    patientId: string,
    params?: {
      query?: string;
      eventType?: string;
      importance?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      page?: number;
    },
    enabled = true
  ) => {
    return useQuery({
      queryKey: ["patientEvents", patientId, params],
      queryFn: () => eventsApi.getPatientEvents(patientId, params),
      enabled: !!patientId && enabled,
    });
  };

  // Query for fetching a specific event
  const useEvent = (patientId: string, eventId: string, enabled = true) => {
    return useQuery({
      queryKey: ["event", patientId, eventId],
      queryFn: () => eventsApi.getEventById({ patientId, eventId }),
      enabled: !!patientId && !!eventId && enabled,
    });
  };

  // Query for fetching event timeline
  const useEventTimeline = (
    patientId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      eventTypes?: string[];
    },
    enabled = true
  ) => {
    return useQuery({
      queryKey: ["eventTimeline", patientId, params],
      queryFn: () => eventsApi.getEventTimeline(patientId, params),
      enabled: !!patientId && enabled,
    });
  };

  // Query for fetching critical events
  const useCriticalEvents = (
    params?: {
      adminId?: string;
      limit?: number;
      unaddressedOnly?: boolean;
    },
    enabled = true
  ) => {
    return useQuery({
      queryKey: ["criticalEvents", params],
      queryFn: () => eventsApi.getCriticalEvents(params),
      enabled,
    });
  };

  // Query for fetching event insights
  const useEventInsights = (patientId: string, enabled = true) => {
    return useQuery<IEventInsightsResponse>({
      queryKey: ["eventInsights", patientId],
      queryFn: () => eventsApi.getEventInsights(patientId),
      enabled: !!patientId && enabled,
    });
  };

  // Query for fetching event recommendations
  const useEventRecommendations = (
    patientId: string,
    eventType?: string,
    enabled = true
  ) => {
    return useQuery<IEventRecommendationsResponse>({
      queryKey: ["eventRecommendations", patientId, eventType],
      queryFn: () => eventsApi.getEventRecommendations(patientId, eventType),
      enabled: !!patientId && enabled,
    });
  };

  // Query for fetching event correlation analysis
  const useEventCorrelation = (patientId: string, enabled = true) => {
    return useQuery<IEventCorrelationResponse>({
      queryKey: ["eventCorrelation", patientId],
      queryFn: () => eventsApi.getEventCorrelation(patientId),
      enabled: !!patientId && enabled,
    });
  };

  // Mutation for adding an event
  const addEventMutation = useMutation({
    mutationFn: eventsApi.addEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientEvents"] });
      queryClient.invalidateQueries({ queryKey: ["eventTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["criticalEvents"] });
      queryClient.invalidateQueries({ queryKey: ["eventInsights"] });
      queryClient.invalidateQueries({ queryKey: ["eventCorrelation"] });
      if (options.onSuccess) options.onSuccess();
    },
    onError: (error) => {
      if (options.onError) options.onError(error as Error);
    },
  });

  // Mutation for updating an event
  const updateEventMutation = useMutation({
    mutationFn: eventsApi.updateEvent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patientEvents", variables.patientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["event", variables.patientId, variables.eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["eventTimeline", variables.patientId],
      });
      queryClient.invalidateQueries({ queryKey: ["criticalEvents"] });
      queryClient.invalidateQueries({
        queryKey: ["eventInsights", variables.patientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["eventCorrelation", variables.patientId],
      });
      if (options.onSuccess) options.onSuccess();
    },
    onError: (error) => {
      if (options.onError) options.onError(error as Error);
    },
  });

  // Mutation for deleting an event
  const deleteEventMutation = useMutation({
    mutationFn: eventsApi.deleteEvent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patientEvents", variables.patientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["eventTimeline", variables.patientId],
      });
      queryClient.invalidateQueries({ queryKey: ["criticalEvents"] });
      queryClient.invalidateQueries({
        queryKey: ["eventInsights", variables.patientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["eventCorrelation", variables.patientId],
      });
      if (options.onSuccess) options.onSuccess();
    },
    onError: (error) => {
      if (options.onError) options.onError(error as Error);
    },
  });

  // Mutation for restoring an event
  const restoreEventMutation = useMutation({
    mutationFn: eventsApi.restoreEvent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patientEvents", variables.patientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["eventTimeline", variables.patientId],
      });
      queryClient.invalidateQueries({ queryKey: ["criticalEvents"] });
      queryClient.invalidateQueries({
        queryKey: ["eventInsights", variables.patientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["eventCorrelation", variables.patientId],
      });
      if (options.onSuccess) options.onSuccess();
    },
    onError: (error) => {
      if (options.onError) options.onError(error as Error);
    },
  });

  // Mutation for marking an event as addressed
  const markEventAsAddressedMutation = useMutation({
    mutationFn: eventsApi.markEventAsAddressed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criticalEvents"] });
      if (options.onSuccess) options.onSuccess();
    },
    onError: (error) => {
      if (options.onError) options.onError(error as Error);
    },
  });

  // Function for adding an event with error handling
  const addEvent = async (patientId: string, eventData: IEventInput) => {
    try {
      setIsLoading(true);
      const result = await addEventMutation.mutateAsync({
        patientId,
        eventData,
      });
      return { success: true, data: result };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to add event";
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Function for updating an event with error handling
  const updateEvent = async (
    patientId: string,
    eventId: string,
    eventData: Partial<IEvent>
  ) => {
    try {
      setIsLoading(true);
      const result = await updateEventMutation.mutateAsync({
        patientId,
        eventId,
        eventData,
      });
      return { success: true, data: result };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update event";
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Function for deleting an event with error handling
  const deleteEvent = async (patientId: string, eventId: string) => {
    try {
      setIsLoading(true);
      await deleteEventMutation.mutateAsync({
        patientId,
        eventId,
      });
      return { success: true };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete event";
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Function for restoring an event with error handling
  const restoreEvent = async (patientId: string, eventId: string) => {
    try {
      setIsLoading(true);
      const result = await restoreEventMutation.mutateAsync({
        patientId,
        eventId,
      });
      return { success: true, data: result };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to restore event";
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Function for marking an event as addressed with error handling
  const markEventAsAddressed = async (eventId: string) => {
    try {
      setIsLoading(true);
      await markEventAsAddressedMutation.mutateAsync(eventId);
      return { success: true };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to mark event as addressed";
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Function for analyzing events with error handling
  const analyzeEvents = async (request: IEventAnalysisRequest) => {
    try {
      setIsLoading(true);
      const loadingToast = toast.loading("Analyzing events...");
      const result = await eventsApi.analyzeEvents(request);
      toast.dismiss(loadingToast);
      toast.success("Event analysis complete");
      return { success: true, data: result };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to analyze events";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Function for getting event insights with error handling
  const getEventInsights = async (patientId: string) => {
    try {
      setIsLoading(true);
      const loadingToast = toast.loading("Getting event insights...");
      const result = await eventsApi.getEventInsights(patientId);
      toast.dismiss(loadingToast);
      toast.success("Event insights retrieved");
      return { success: true, data: result };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to get event insights";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Function for getting event recommendations with error handling
  const getEventRecommendations = async (
    patientId: string,
    eventType?: string
  ) => {
    try {
      setIsLoading(true);
      const loadingToast = toast.loading("Getting event recommendations...");
      const result = await eventsApi.getEventRecommendations(
        patientId,
        eventType
      );
      toast.dismiss(loadingToast);
      toast.success("Event recommendations retrieved");
      return { success: true, data: result };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to get event recommendations";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Function for getting event correlation analysis with error handling
  const getEventCorrelation = async (patientId: string) => {
    try {
      setIsLoading(true);
      const loadingToast = toast.loading("Analyzing event correlations...");
      const result = await eventsApi.getEventCorrelation(patientId);
      toast.dismiss(loadingToast);
      toast.success("Event correlation analysis complete");
      return { success: true, data: result };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to get event correlation analysis";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Loading state
    isLoading,

    // Queries
    usePatientEvents,
    useEvent,
    useEventTimeline,
    useCriticalEvents,
    useEventInsights,
    useEventRecommendations,
    useEventCorrelation,

    // Direct operations with error handling
    addEvent,
    updateEvent,
    deleteEvent,
    restoreEvent,
    markEventAsAddressed,
    analyzeEvents,
    getEventRecommendations,
    getEventInsights,
    getEventCorrelation,

    // Raw mutations for advanced use cases
    addEventMutation,
    updateEventMutation,
    deleteEventMutation,
    restoreEventMutation,
    markEventAsAddressedMutation,
  };
};

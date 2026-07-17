import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api-client';

export interface ItineraryActivity {
  time: string;
  activity: string;
  description: string;
  location: string;
  cost: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryActivity[];
}

export interface BudgetBreakdown {
  transportation: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total_estimated?: number;
  totalEstimated?: number;
}

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  departureLocation: string | null;
  startDate: string;
  endDate: string;
  budget: number;
  travelStyle: string | null;
  interests: string[];
  latitude: number | null;
  longitude: number | null;
  itinerary: ItineraryDay[] | null;
  budgetBreakdown: BudgetBreakdown | null;
  createdAt: string;
  updatedAt: string;
}

export interface TripCreateInput {
  destination: string;
  departureLocation?: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelStyle?: string;
  interests?: string[];
}

export interface TripUpdateInput {
  destination?: string;
  departureLocation?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelStyle?: string;
  interests?: string[];
}

interface TripResponse {
  success: boolean;
  data: Trip;
}

interface TripListResponse {
  success: boolean;
  data: Trip[];
}

// Fetch all trips for current user
export function useTrips() {
  return useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: async () => {
      const response = await apiRequest<TripListResponse>('/trips/');
      return response.data;
    },
  });
}

// Fetch specific trip by ID
export function useTrip(tripId: string | undefined) {
  return useQuery<Trip>({
    queryKey: ['trips', tripId],
    queryFn: async () => {
      if (!tripId) throw new Error('Trip ID is required');
      const response = await apiRequest<TripResponse>(`/trips/${tripId}`);
      return response.data;
    },
    enabled: !!tripId,
  });
}

// Create a new trip
export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation<Trip, Error, TripCreateInput>({
    mutationFn: async (newTrip) => {
      const response = await apiRequest<TripResponse>('/trips/', {
        method: 'POST',
        data: newTrip,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

// Update an existing trip
export function useUpdateTrip(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation<Trip, Error, TripUpdateInput>({
    mutationFn: async (updatedFields) => {
      const response = await apiRequest<TripResponse>(`/trips/${tripId}`, {
        method: 'PUT',
        data: updatedFields,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
    },
  });
}

// Delete a trip
export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (tripId) => {
      return await apiRequest<{ success: boolean; message: string }>(`/trips/${tripId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

// Generate itinerary with AI
export function useGenerateItinerary(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation<Trip, Error, void>({
    mutationFn: async () => {
      const response = await apiRequest<TripResponse>(`/trips/${tripId}/generate`, {
        method: 'POST',
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
    },
  });
}

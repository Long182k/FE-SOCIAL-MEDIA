import { axiosClient } from "./axiosConfig";

export interface Event {
  id: string;
  name: string;
  description: string;
  eventAvatar?: string;
  eventDate: string;
  category: EventCategory;
  address?: string;
  createdAt: string;
  creator: {
    id: string;
    userName: string;
    avatarUrl?: string;
  };
  attendeesCount: number;
  activeAttendeesCount: number;
  attendees?: {
    userId: string;
    role: "ADMIN" | "ATTENDEE" | "PENDING_ATTENDEE";
    status: "ENROLL" | "CANCEL";
  }[];
}

export interface EventResponse {
  events: Event[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateEventDto {
  name: string;
  description: string;
  eventAvatar?: string;
  eventDate: string;
  category?: EventCategory;
  address?: string;
}

export enum EventCategory {
  MUSIC = "MUSIC",
  SPORTS = "SPORTS",
  ARTS = "ARTS",
  SCIENCE = "SCIENCE",
  TECHNOLOGY = "TECHNOLOGY",
  EDUCATION = "EDUCATION",
  FOOD = "FOOD",
  BUSINESS = "BUSINESS",
  HEALTH = "HEALTH",
  OTHER = "OTHER",
}

export const eventApi = {
  createEvent: async (data: FormData) =>
    axiosClient.post("/events", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getAllEvents: (page: number = 1, limit: number = 10) =>
    axiosClient.get<EventResponse>(`/events?page=${page}&limit=${limit}`),

  getTrendingEvents: () =>
    axiosClient.get<{ events: Event[] }>("/events/trending/top"),

  getEventsByCategory: (
    category: EventCategory,
    page: number = 1,
    limit: number = 10
  ) =>
    axiosClient.get<EventResponse>(
      `/events/category/${category}?page=${page}&limit=${limit}`
    ),

  getEventById: (id: string) => axiosClient.get<Event>(`/events/${id}`),

  getEventAttendees: (id: string) => axiosClient.get(`/events/${id}/attendees`),

  getEventRequests: (id: string) => axiosClient.get(`/events/${id}/requests`),

  updateEvent: (id: string, data: Partial<CreateEventDto>) =>
    axiosClient.patch(`/events/${id}`, data),

  joinEvent: (id: string) => axiosClient.post(`/events/${id}/join`),

  approveRequest: (eventId: string, userId: string) =>
    axiosClient.post(`/events/${eventId}/approve/${userId}`),

  cancelAttendance: (id: string) => axiosClient.post(`/events/${id}/cancel`),

  deleteEvent: (id: string) => axiosClient.delete(`/events/${id}`),

  getDiscoveryEvents: (page: number = 1, limit: number = 10) =>
    axiosClient.get<EventResponse>(
      `/events/discover/all?page=${page}&limit=${limit}`
    ),
};

import axios from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  CraftsmanProfile,
  CreateProfileRequest,
  AddRatingRequest,
  Rating,
  SearchFilters,
  ServiceCategory,
  TimeSlot,
  Booking,
  CreateTimeSlotRequest,
  CreateBookingRequest,
  UpdateBookingStatusRequest
} from '../types';

const AUTH_API_URL = 'http://localhost:5011/api';
const APP_API_URL = 'http://localhost:5012/api';

const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

const appApi = axios.create({
  baseURL: APP_API_URL,
});

appApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    authApi.post('/auth/register', data).then(res => res.data),

  login: (data: LoginRequest): Promise<AuthResponse> =>
    authApi.post('/auth/login', data).then(res => res.data),

  getUsers: () =>
    authApi.get('/auth/users').then(res => res.data),
};

export const craftsmanService = {
  searchCraftsmen: (filters: SearchFilters): Promise<CraftsmanProfile[]> => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.minRating) params.append('minRating', filters.minRating.toString());
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);

    return appApi.get(`/craftsman/search?${params}`).then(res => res.data);
  },

  getAllCraftsmen: (): Promise<CraftsmanProfile[]> =>
    appApi.get('/craftsman').then(res => res.data),

  getCraftsman: (id: number): Promise<CraftsmanProfile> =>
    appApi.get(`/craftsman/${id}`).then(res => res.data),

  createProfile: (data: CreateProfileRequest): Promise<CraftsmanProfile> =>
    appApi.post('/craftsman/profile', data).then(res => res.data),

  updateProfile: (data: CreateProfileRequest): Promise<CraftsmanProfile> =>
    appApi.put('/craftsman/profile', data).then(res => res.data),

  getMyProfile: (): Promise<CraftsmanProfile> =>
    appApi.get('/craftsman/profile/me').then(res => res.data),
};

export const ratingService = {
  addRating: (craftsmanId: number, data: AddRatingRequest): Promise<Rating> =>
    appApi.post(`/rating/craftsman/${craftsmanId}`, data).then(res => res.data),

  getRatingsForCraftsman: (craftsmanId: number): Promise<Rating[]> =>
    appApi.get(`/rating/craftsman/${craftsmanId}`).then(res => res.data),

  getMyRatingForCraftsman: (craftsmanId: number): Promise<Rating> =>
    appApi.get(`/rating/craftsman/${craftsmanId}/my-rating`).then(res => res.data),
};

export const timeSlotService = {
  getAvailableTimeSlots: (craftsmanId: number, startDate?: string, endDate?: string): Promise<TimeSlot[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    return appApi.get(`/timeslot/craftsman/${craftsmanId}/available?${params}`).then(res => res.data);
  },

  createTimeSlot: (data: CreateTimeSlotRequest): Promise<TimeSlot> =>
    appApi.post('/timeslot/me', data).then(res => res.data),

  getMyTimeSlots: (): Promise<TimeSlot[]> =>
    appApi.get('/timeslot/craftsman/me').then(res => res.data),

  deleteTimeSlot: (timeSlotId: number): Promise<void> =>
    appApi.delete(`/timeslot/${timeSlotId}`).then(res => res.data),
};

export const bookingService = {
  createBooking: (craftsmanId: number, data: CreateBookingRequest): Promise<Booking> =>
    appApi.post(`/booking/craftsman/${craftsmanId}`, data).then(res => res.data),

  getMyClientBookings: (): Promise<Booking[]> =>
    appApi.get('/booking/client/me').then(res => res.data),

  getMyCraftsmanBookings: (): Promise<Booking[]> =>
    appApi.get('/booking/craftsman/me').then(res => res.data),

  getBookingById: (bookingId: number): Promise<Booking> =>
    appApi.get(`/booking/${bookingId}`).then(res => res.data),

  updateBookingStatus: (bookingId: number, data: UpdateBookingStatusRequest): Promise<Booking> =>
    appApi.put(`/booking/${bookingId}/status`, data).then(res => res.data),

  cancelBooking: (bookingId: number): Promise<void> =>
    appApi.put(`/booking/${bookingId}/cancel`).then(res => res.data),
};
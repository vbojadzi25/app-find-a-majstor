export enum UserRole {
  Client = 'Client',
  Craftsman = 'Craftsman',
  Admin = 'Admin'
}

export enum ServiceCategory {
  Electrician = 'Electrician',
  Plumber = 'Plumber',
  Carpenter = 'Carpenter',
  Painter = 'Painter',
  Mason = 'Mason',
  Locksmith = 'Locksmith',
  Gardener = 'Gardener',
  Cleaner = 'Cleaner',
  Mechanic = 'Mechanic',
  Other = 'Other'
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface CraftsmanProfile {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  qualifications: string;
  workingHours: string;
  category: ServiceCategory;
  location: string;
  ratings: Rating[];
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: number;
  craftsmanId: number;
  clientId: number;
  clientEmail: string;
  stars: number;
  comment: string;
  createdAt: string;
}

export interface CreateProfileRequest {
  name: string;
  phone: string;
  qualifications: string;
  workingHours: string;
  category: ServiceCategory;
  location: string;
}

export interface AddRatingRequest {
  stars: number;
  comment: string;
}

export interface SearchFilters {
  category?: ServiceCategory;
  location?: string;
  minRating?: number;
  searchTerm?: string;
}

export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Rejected = 'Rejected'
}

export interface TimeSlot {
  id: number;
  craftsmanId: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  description?: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  craftsmanId: number;
  clientId: number;
  clientEmail: string;
  clientName: string;
  clientPhone: string;
  timeSlotId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  serviceDescription: string;
  notes?: string;
  estimatedPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeSlotRequest {
  startTime: string;
  endTime: string;
  description?: string;
}

export interface CreateBookingRequest {
  timeSlotId: number;
  serviceDescription: string;
  clientName: string;
  clientPhone: string;
  notes?: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
  notes?: string;
  estimatedPrice?: number;
}
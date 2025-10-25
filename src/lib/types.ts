// Re-export all types from api.ts for backwards compatibility
import type { User } from "./api";

export type {
  User,
  Company,
  Society,
  Portfolio,
  AvailablePosition,
  PositionApplied,
  ApiResponse,
} from "./api";

// Legacy type aliases for compatibility with existing code
export type { User as JobSeeker, User as HRD } from "./api";
export type { AvailablePosition as Job } from "./api";
export type { PositionApplied as Application } from "./api";

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterJobSeekerRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterHRDRequest {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyAddress?: string;
  companyDescription?: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  success: boolean;
  user: User;
}

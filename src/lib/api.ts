/**
 * API Client for Backend Integration
 * Base URL: http://localhost:4000
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "localhost:4000";

// Types based on API documentation
export interface User {
  id: string;
  name: string;
  email: string;
  role: "HRD" | "Society";
  image?: string;
  created_at?: string;
  updated_at?: string;
  // Nested relations from backend
  society?: {
    id: string;
    name: string;
  };
  company?: {
    id: string;
    name: string;
  };
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Society {
  id: string;
  name: string;
  address: string;
  phone: string;
  date_of_birth: string;
  gender: "male" | "female";
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  skill: string;
  description: string;
  file?: string;
  society_id: string;
  created_at: string;
  updated_at: string;
}

export interface AvailablePosition {
  id: string;
  position_name: string;
  capacity: number;
  description: string;
  salary?: number;
  submission_start_date: string;
  submission_end_date: string;
  company_id: string;
  company?: Company;
  applications?: PositionApplied[];
}

export interface PositionApplied {
  id: string;
  available_position_id: string;
  society_id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  apply_date: string;
  available_position?: AvailablePosition;
  society?: Society & { user?: User };
}

export interface ApiResponse<T> {
  success?: boolean; // For compatibility
  status?: boolean; // Backend uses "status"
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

// Token Management
export const TOKEN_KEY = "auth_token";
export const USER_KEY = "auth_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? (JSON.parse(user) as User) : null;
}

export function setUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Fetch wrapper with authentication
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: Record<string, string> = {};

  // Copy existing headers
  if (options.headers) {
    const headersInit = options.headers;
    if (headersInit instanceof Headers) {
      headersInit.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(headersInit)) {
      headersInit.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, headersInit);
    }
  }

  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON requests
  if (
    options.body &&
    typeof options.body === "string" &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = (await response.json()) as ApiResponse<T>;

    // Normalize the response: backend uses "status", we use "success"
    const normalizedData: ApiResponse<T> = {
      ...data,
      success: data.status ?? data.success ?? false,
    };

    if (!response.ok) {
      throw new Error(normalizedData.message ?? "Something went wrong");
    }

    return normalizedData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error occurred");
  }
}

// ============================================
// USER API
// ============================================

export const userAPI = {
  /**
   * Get all users (filtering done on frontend)
   */
  async getAll() {
    return fetchAPI<User[]>("/users");
  },

  /**
   * Get user by ID
   */
  async getById(id: string) {
    return fetchAPI<User & { company?: Company; society?: Society }>(
      `/users/${id}`
    );
  },

  /**
   * Register new user
   */
  async register(formData: FormData) {
    return fetchAPI<User>("/users", {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Login
   */
  async login(credentials: { email: string; password: string }) {
    const formData = new FormData();
    formData.append("email", credentials.email);
    formData.append("password", credentials.password);

    const response = await fetchAPI<{
      user: User;
      token: string;
    }>("/users/login", {
      method: "POST",
      body: formData,
    });

    if (response.success && response.data) {
      setToken(response.data.token);
      setUser(response.data.user);

      // Set cookies for middleware
      if (typeof document !== "undefined") {
        document.cookie = `token=${response.data.token}; Path=/; Max-Age=${
          60 * 60 * 24 * 7
        }; SameSite=Lax`;
        document.cookie = `role=${response.data.user.role}; Path=/; Max-Age=${
          60 * 60 * 24 * 7
        }; SameSite=Lax`;
      }
    }

    return response;
  },

  /**
   * Logout
   */
  async logout() {
    try {
      await fetchAPI("/users/logout", { method: "POST" });
    } finally {
      removeToken();

      // Clear cookies
      if (typeof document !== "undefined") {
        document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
        document.cookie = "role=; Path=/; Max-Age=0; SameSite=Lax";
      }
    }
  },

  /**
   * Update user
   */
  async update(id: string, formData: FormData) {
    return fetchAPI<User>(`/users/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  /**
   * Delete user
   */
  async delete(id: string) {
    return fetchAPI(`/users/${id}`, { method: "DELETE" });
  },
};

// ============================================
// COMPANY API
// ============================================

export const companyAPI = {
  /**
   * Get all companies (filtering done on frontend)
   */
  async getAll() {
    return fetchAPI<Company[]>("/companies");
  },

  /**
   * Get company by ID
   */
  async getById(id: string) {
    return fetchAPI<
      Company & {
        user?: User;
        available_positions?: Array<
          AvailablePosition & {
            position_applied?: Array<
              PositionApplied & {
                society?: Society & { user?: User };
              }
            >;
          }
        >;
      }
    >(`/companies/${id}`);
  },

  /**
   * Update company
   */
  async update(
    id: string,
    data: {
      name: string;
      address: string;
      phone: string;
      description: string;
    }
  ) {
    return fetchAPI<Company>(`/companies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// SOCIETY API
// ============================================

export const societyAPI = {
  /**
   * Get all societies (filtering done on frontend)
   */
  async getAll() {
    return fetchAPI<Society[]>("/societies");
  },

  /**
   * Get society by ID
   */
  async getById(id: string) {
    return fetchAPI<
      Society & {
        user?: User;
        portfolios?: Portfolio[];
        position_applied?: PositionApplied[];
      }
    >(`/societies/${id}`);
  },

  /**
   * Update society
   */
  async update(
    id: string,
    data: {
      name: string;
      address: string;
      phone: string;
      date_of_birth: string;
      gender: "male" | "female";
    }
  ) {
    return fetchAPI<Society>(`/societies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  /**
   * Get my applications (authenticated society)
   */
  async getMyApplications() {
    return fetchAPI<
      (PositionApplied & {
        position?: AvailablePosition & {
          company?: Company & { user?: User };
        };
      })[]
    >("/societies/me/applications");
  },
};

// ============================================
// PORTFOLIO API
// ============================================

export const portfolioAPI = {
  /**
   * Get all portfolios (filtering done on frontend)
   */
  async getAll() {
    return fetchAPI<
      (Portfolio & {
        society?: Society & { user?: { image?: string } };
      })[]
    >("/portfolios");
  },

  /**
   * Get portfolio by ID
   */
  async getById(id: string) {
    return fetchAPI<
      Portfolio & {
        society?: Society & { user?: User };
      }
    >(`/portfolios/${id}`);
  },

  /**
   * Get portfolios by society ID
   */
  async getBySocietyId(societyId: string) {
    return fetchAPI<{ portfolios: Portfolio[]; total: number }>(
      `/portfolios/profile/${societyId}`
    );
  },

  /**
   * Create portfolio
   */
  async create(formData: FormData) {
    return fetchAPI<Portfolio>("/portfolios", {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Update portfolio
   */
  async update(id: string, formData: FormData) {
    return fetchAPI<Portfolio>(`/portfolios/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  /**
   * Delete portfolio
   */
  async delete(id: string) {
    return fetchAPI(`/portfolios/${id}`, { method: "DELETE" });
  },
};

// ============================================
// APPLICATION API (Available Positions)
// ============================================

export const applicationAPI = {
  /**
   * Get all available positions
   */
  async getAll() {
    return fetchAPI<AvailablePosition[]>("/applications");
  },

  /**
   * Get active positions
   */
  async getActive() {
    return fetchAPI<AvailablePosition[]>("/applications/active");
  },

  /**
   * Get all available positions by company ID
   */
  async getByCompanyId(companyId: string) {
    return fetchAPI<
      Array<
        AvailablePosition & {
          company?: Company;
          _count?: {
            applications: number;
          };
        }
      >
    >(`/applications/company/available/${companyId}`);
  },

  /**
   * Get position by ID
   */
  async getById(id: string) {
    return fetchAPI<
      AvailablePosition & {
        company?: Company & { user?: { image?: string } };
        position_applied?: PositionApplied[];
      }
    >(`/applications/${id}`);
  },

  /**
   * Create new position (HRD only)
   */
  async create(formData: FormData) {
    return fetchAPI<AvailablePosition>("/applications", {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Update position (HRD only)
   */
  async update(id: string, formData: FormData) {
    return fetchAPI<AvailablePosition>(`/applications/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  /**
   * Delete position (HRD only)
   */
  async delete(id: string) {
    return fetchAPI(`/applications/${id}`, { method: "DELETE" });
  },

  /**
   * Apply to position (Society only)
   */
  async apply(positionId: string) {
    return fetchAPI<PositionApplied>(`/applications/${positionId}/apply`, {
      method: "POST",
    });
  },

  /**
   * Update application status (HRD only)
   */
  async updateStatus(applicationId: string, status: "ACCEPTED" | "REJECTED") {
    const formData = new FormData();
    formData.append("status", status);

    return fetchAPI<PositionApplied>(`/applications/${applicationId}/status`, {
      method: "PATCH",
      body: formData,
    });
  },

  /**
   * Get all applications for HRD's company (HRD only)
   * Filtering done on frontend
   */
  async getCompanyApplications() {
    // Backend returns: { status, data: [...], summary: {...}, message }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await fetchAPI<any>("/applications/company/applications");

    // Return the raw response since backend already has the structure we need
    return response as {
      success?: boolean;
      status?: boolean;
      message: string;
      data: Array<
        PositionApplied & {
          position?: AvailablePosition & { company?: Company };
          society?: Society & {
            user?: User;
            portfolios?: Portfolio[];
          };
        }
      >;
      summary: {
        total: number;
        pending: number;
        accepted: number;
        rejected: number;
      };
    };
  },
};

const api = {
  user: userAPI,
  company: companyAPI,
  society: societyAPI,
  portfolio: portfolioAPI,
  application: applicationAPI,
};

export default api;

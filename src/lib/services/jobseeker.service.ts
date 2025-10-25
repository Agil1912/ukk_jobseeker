import {
  userAPI,
  societyAPI,
  portfolioAPI,
  applicationAPI,
  getUser,
} from "../api";
import type {
  User,
  Society,
  Portfolio,
  AvailablePosition,
  PositionApplied,
} from "../api";

export const jobSeekerService = {
  async getProfile(): Promise<{ user: User; society: Society | null }> {
    const user = getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get user details
    const userResponse = await userAPI.getById(user.id);

    // Get society details if user is Society
    let society = null;
    if (user.role === "Society") {
      const societiesResponse = await societyAPI.getAll();
      const societies = societiesResponse.data || [];
      society = societies.find((s: Society) => s.user_id === user.id) || null;
    }

    return {
      user: userResponse.data!,
      society,
    };
  },

  async updateProfile(data: FormData): Promise<User> {
    const user = getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const response = await userAPI.update(user.id, data);
    return response.data!;
  },

  async updateSociety(
    societyId: string,
    data: {
      name: string;
      address: string;
      phone: string;
      date_of_birth: string;
      gender: "male" | "female";
    }
  ): Promise<Society> {
    const response = await societyAPI.update(societyId, data);
    return response.data!;
  },

  async getPortfolio(): Promise<Portfolio[]> {
    const user = getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get society ID first
    const societiesResponse = await societyAPI.getAll();
    const societies = societiesResponse.data || [];
    const society = societies.find((s: Society) => s.user_id === user.id);

    if (!society) {
      return [];
    }

    const response = await portfolioAPI.getBySocietyId(society.id);
    return response.data?.portfolios || [];
  },

  async addPortfolio(data: FormData): Promise<Portfolio> {
    const user = getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get society ID
    const societiesResponse = await societyAPI.getAll();
    const societies = societiesResponse.data || [];
    const society = societies.find((s: Society) => s.user_id === user.id);

    if (!society) {
      throw new Error("Society not found");
    }

    // Add society_id to existing FormData
    data.append("society_id", society.id);

    const response = await portfolioAPI.create(data);
    return response.data!;
  },

  async updatePortfolio(
    id: string,
    data: Partial<Portfolio>
  ): Promise<Portfolio> {
    // Create FormData
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await portfolioAPI.update(id, formData);
    return response.data!;
  },

  async deletePortfolio(id: string): Promise<void> {
    await portfolioAPI.delete(id);
  },

  async getJobs(params?: {
    search?: string;
    location?: string;
    company?: string;
  }): Promise<AvailablePosition[]> {
    // Get active positions
    const response = await applicationAPI.getActive();
    let jobs = response.data || [];

    // Apply client-side filtering if params are provided
    if (params) {
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        jobs = jobs.filter(
          (job) =>
            job.position_name.toLowerCase().includes(searchLower) ||
            job.description.toLowerCase().includes(searchLower)
        );
      }

      if (params.company) {
        const companyLower = params.company.toLowerCase();
        jobs = jobs.filter((job) =>
          job.company?.name.toLowerCase().includes(companyLower)
        );
      }
    }

    return jobs;
  },

  async getJobById(id: string): Promise<AvailablePosition> {
    const response = await applicationAPI.getById(id);
    return response.data!;
  },

  async applyToJob(positionId: string): Promise<PositionApplied> {
    const response = await applicationAPI.apply(positionId);
    return response.data!;
  },

  async getMyApplications(): Promise<PositionApplied[]> {
    const user = getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Use new endpoint to get applications by authenticated society
    const response = await societyAPI.getMyApplications();
    return response.data || [];
  },
};

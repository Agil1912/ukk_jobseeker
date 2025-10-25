import { userAPI, companyAPI, applicationAPI, getUser } from "../api";
import type { User, Company, AvailablePosition, PositionApplied } from "../api";

export const hrdService = {
  async getProfile(): Promise<{ user: User; company: Company | null }> {
    const user = getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get user details
    const userResponse = await userAPI.getById(user.id);

    // Get company details if user is HRD
    let company = null;
    if (user.role === "HRD") {
      const companiesResponse = await companyAPI.getAll();
      const companies = companiesResponse.data || [];
      company = companies.find((c: Company) => c.user_id === user.id) || null;
    }

    return {
      user: userResponse.data!,
      company,
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

  async updateCompany(
    companyId: string,
    data: { name: string; address: string; phone: string; description: string }
  ): Promise<Company> {
    const response = await companyAPI.update(companyId, data);
    return response.data!;
  },

  async getMyJobs(): Promise<AvailablePosition[]> {
    const user = getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get all companies
    const companiesResponse = await companyAPI.getAll();
    const companies = companiesResponse.data || [];
    const myCompany = companies.find((c: Company) => c.user_id === user.id);

    if (!myCompany) {
      return [];
    }

    // Get all positions for this company
    const positionsResponse = await applicationAPI.getByCompanyId(myCompany.id);
    return positionsResponse.data || [];
  },

  async createJob(
    data: Omit<
      AvailablePosition,
      "id" | "company_id" | "created_at" | "updated_at"
    >
  ): Promise<AvailablePosition> {
    const user = getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get company ID
    const companiesResponse = await companyAPI.getAll();
    const companies = companiesResponse.data || [];
    const company = companies.find((c: Company) => c.user_id === user.id);

    if (!company) {
      throw new Error("Company not found");
    }

    // Create FormData
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    formData.append("company_id", company.id);

    const response = await applicationAPI.create(formData);
    return response.data!;
  },

  async updateJob(
    id: string,
    data: Partial<AvailablePosition>
  ): Promise<AvailablePosition> {
    // Create FormData
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await applicationAPI.update(id, formData);
    return response.data!;
  },

  async deleteJob(id: string): Promise<void> {
    await applicationAPI.delete(id);
  },

  async getJobApplications(positionId: string): Promise<PositionApplied[]> {
    // Get all company applications
    const allApplicationsResponse =
      await applicationAPI.getCompanyApplications();
    const allApplications = allApplicationsResponse.data || [];

    // Filter applications for this specific position
    const applications = allApplications.filter(
      (app) => app.available_position_id === positionId
    );

    return applications;
  },

  async updateApplicationStatus(
    applicationId: string,
    status: "accepted" | "rejected" | "pending"
  ): Promise<PositionApplied> {
    // Convert status to uppercase for API
    const apiStatus = status.toUpperCase() as "ACCEPTED" | "REJECTED";

    const response = await applicationAPI.updateStatus(
      applicationId,
      apiStatus
    );
    return response.data!;
  },

  async getDashboardStats(): Promise<{
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    pendingApplications: number;
  }> {
    const user = getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get company
    const companiesResponse = await companyAPI.getAll();
    const companies = companiesResponse.data || [];
    const company = companies.find((c: Company) => c.user_id === user.id);

    if (!company) {
      return {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
      };
    }

    // Get all positions
    const positionsResponse = await applicationAPI.getByCompanyId(company.id);
    const positions = positionsResponse.data || [];
    const now = new Date();
    const activeJobs = positions.filter(
      (pos) => new Date(pos.submission_end_date) > now
    );

    // Get all applications
    const allApplicationsResponse =
      await applicationAPI.getCompanyApplications();
    const allApplications = allApplicationsResponse.data || [];
    const companyApplications = allApplications.filter((app) => {
      // Check if this application is for one of this company's positions
      return positions.some((pos) => pos.id === app.available_position_id);
    });

    const pendingApplications = companyApplications.filter(
      (app) => app.status === "PENDING"
    );

    return {
      totalJobs: positions.length,
      activeJobs: activeJobs.length,
      totalApplications: companyApplications.length,
      pendingApplications: pendingApplications.length,
    };
  },
};

import api from "../api"
import type { HRD, Job, Application } from "../types"

export const hrdService = {
  async getProfile(): Promise<HRD> {
    const response = await api.get<HRD>("/hrd/profile")
    return response.data
  },

  async updateProfile(data: Partial<HRD>): Promise<HRD> {
    const response = await api.put<HRD>("/hrd/profile", data)
    return response.data
  },

  async getMyJobs(): Promise<Job[]> {
    const response = await api.get<Job[]>("/hrd/jobs")
    return response.data
  },

  async createJob(data: Omit<Job, "id" | "hrdId" | "companyName" | "createdAt" | "isActive">): Promise<Job> {
    const response = await api.post<Job>("/hrd/jobs", data)
    return response.data
  },

  async updateJob(id: string, data: Partial<Job>): Promise<Job> {
    const response = await api.put<Job>(`/hrd/jobs/${id}`, data)
    return response.data
  },

  async deleteJob(id: string): Promise<void> {
    await api.delete(`/hrd/jobs/${id}`)
  },

  async getJobApplications(jobId: string): Promise<Application[]> {
    const response = await api.get<Application[]>(`/hrd/jobs/${jobId}/applications`)
    return response.data
  },

  async updateApplicationStatus(
    applicationId: string,
    status: "pending" | "accepted" | "rejected",
  ): Promise<Application> {
    const response = await api.put<Application>(`/hrd/applications/${applicationId}/status`, { status })
    return response.data
  },

  async getDashboardStats(): Promise<{
    totalJobs: number
    activeJobs: number
    totalApplications: number
    pendingApplications: number
  }> {
    const response = await api.get("/hrd/dashboard/stats")
    return response.data
  },
}

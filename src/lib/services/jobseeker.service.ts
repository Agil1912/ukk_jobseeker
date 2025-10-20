import api from "../api"
import type { JobSeeker, Portfolio, Job, Application } from "../types"

export const jobSeekerService = {
  async getProfile(): Promise<JobSeeker> {
    const response = await api.get<JobSeeker>("/jobseeker/profile")
    return response.data
  },

  async updateProfile(data: Partial<JobSeeker>): Promise<JobSeeker> {
    const response = await api.put<JobSeeker>("/jobseeker/profile", data)
    return response.data
  },

  async getPortfolio(): Promise<Portfolio[]> {
    const response = await api.get<Portfolio[]>("/jobseeker/portfolio")
    return response.data
  },

  async addPortfolio(data: Omit<Portfolio, "id" | "createdAt">): Promise<Portfolio> {
    const response = await api.post<Portfolio>("/jobseeker/portfolio", data)
    return response.data
  },

  async updatePortfolio(id: string, data: Partial<Portfolio>): Promise<Portfolio> {
    const response = await api.put<Portfolio>(`/jobseeker/portfolio/${id}`, data)
    return response.data
  },

  async deletePortfolio(id: string): Promise<void> {
    await api.delete(`/jobseeker/portfolio/${id}`)
  },

  async getJobs(params?: { search?: string; location?: string; company?: string }): Promise<Job[]> {
    const response = await api.get<Job[]>("/jobs", { params })
    return response.data
  },

  async getJobById(id: string): Promise<Job> {
    const response = await api.get<Job>(`/jobs/${id}`)
    return response.data
  },

  async applyToJob(jobId: string): Promise<Application> {
    const response = await api.post<Application>("/applications", { jobId })
    return response.data
  },

  async getMyApplications(): Promise<Application[]> {
    const response = await api.get<Application[]>("/jobseeker/applications")
    return response.data
  },
}

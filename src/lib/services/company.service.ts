import { companyAPI, applicationAPI } from "../api";
import type { Company, AvailablePosition } from "../api";

export const companyService = {
  /**
   * Get all companies
   */
  async getAll(): Promise<Company[]> {
    const response = await companyAPI.getAll();
    return response.data ?? [];
  },

  /**
   * Get company by ID with positions
   */
  async getById(id: string): Promise<Company> {
    const response = await companyAPI.getById(id);
    if (!response.data) throw new Error("Company not found");
    return response.data;
  },

  /**
   * Get all positions for a specific company
   */
  async getCompanyPositions(companyId: string): Promise<AvailablePosition[]> {
    const response = await applicationAPI.getByCompanyId(companyId);
    return response.data ?? [];
  },
};

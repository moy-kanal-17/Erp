import { apiConfig } from '@api/config';
import { ApiUrls } from '@api/api-urls';

export interface AdminProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const profileService = {
  async getProfile(): Promise<AdminProfile> {
    const res = await apiConfig().getRequest(`/admin${ApiUrls.PROFILE}`);
    console.log('Profile data:', res?.data);
    
    return res?.data;
  },

  async updateProfile(model: Partial<AdminProfile>): Promise<AdminProfile> {
    const res = await apiConfig().putRequest(`/admin-auth${ApiUrls.PROFILE}`, model);
    console.log('Updated profile data:', res?.data);
    return res?.data;
  }
};
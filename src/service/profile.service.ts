import { apiConfig } from '@api/config';
import { ApiUrls } from '@api/api-urls';
import {  getUserIdFromToken } from '@helpers';

export interface AdminProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const profileService = {
  async getProfile() {
    const token =getUserIdFromToken(); 

    console.log('Access token:', token);
    const res = await apiConfig().getRequest(`/admin/${token}`);
    console.log('Profile data:', res?.data);
    
    return res?.data;
  },

  async updateProfile(model: Partial<AdminProfile>): Promise<AdminProfile> {
    const res = await apiConfig().putRequest(`/admin-auth${ApiUrls.PROFILE}`, model);
    console.log('Updated profile data:', res?.data);
    return res?.data;
  }
};
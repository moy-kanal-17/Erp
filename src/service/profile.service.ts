import { apiConfig } from '@api/config';

import { getUserIdFromToken, getUserRoleFromToken } from '@helpers';

export interface CommonProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const profileService = {
  async getProfile() {
    const id = getUserIdFromToken();
    const role = getUserRoleFromToken(); 

    if (!id || !role) throw new Error('Token information missing');

    const res = await apiConfig().getRequest(`/${role}/${id}`);
    return res?.data[role];
  },

  updatePassword: async (
    role: string,
    id: number,
    data: {
      old_password: string;
      password: string;
      confirm_password: string;
    }
  ) => {
    const res = await apiConfig().patchRequest(`/${role}/change-password/${id}`, data);
    return res?.data;
  },

  updateAvatar: async (role: string, id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiConfig().postRequest(`/${role}/${id}/avatar`, formData);
    console.log('Avatar update response:', res);
    
    return res?.data;
  },

  updateProfile: async (
    role: string,
    id: number,
    model: Partial<CommonProfile>
  ): Promise<CommonProfile> => {
    const res = await apiConfig().patchRequest(`/${role}/${id}`, model);
    return res?.data;
  }
};

import { apiConfig } from '@api/config';


// import { getUserIdFromToken, getUserRoleFromToken } from '@helpers';


export interface CommonProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const profileService = {

  async getProfile(id:number, role:string) {


    if (!id || !role) throw new Error('Token information missing');
    console.log('Fetching profile for role:', role, 'and ID:', id);

    const res = await apiConfig().getRequest(`/${role}/${id}`);
    console.log('Profile fetch response:✅', res?.data.admin || res?.data.student || res?.data.teacher || res?.data.parent || res?.data.employee);

    return res?.data.admin || res?.data.student || res?.data.teacher || res?.data.parent || res?.data.employee;
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

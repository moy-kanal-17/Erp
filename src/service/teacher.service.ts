
import { apiConfig } from '@api/config';
import { ApiUrls } from '@api/api-urls';
import { Notification } from '../helpers';

export const teacherService = {
  getStudents: async () => {
    try {
      const response = await apiConfig().getRequest(ApiUrls.TEACHERS);
      console.log("📦 Foydalanuvchilar:", response?.data);
      return response;
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  },

    geTeachers: async () => {
    try {
      const response = await apiConfig().getRequest(ApiUrls.TEACHERS);
      console.log("📦 Foydalanuvchilar:", response);
      return response ;
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  },

  postUser: async (data: any) => {
    try {
      const response = await apiConfig().postRequest(ApiUrls.TEACHERS, data);
      Notification('success', 'Yaratildi', 'Foydalanuvchi yaratildi');
      return response
    } catch (error) {
      console.error("Error creating user:", error);
      Notification('error', 'Xatolik', 'Yaratishda xatolik yuz berdi');
    }
  },

  updateUser: async (id: number, data: any) => {
    try {
      const response = await apiConfig().patchRequest(`${ApiUrls.TEACHERS}/${id}`, data);
      console.log(response);
      
      Notification('success', 'Yangilandi', 'Foydalanuvchi yangilandi');
    } catch (error) {
      console.error("Error updating user:", error);
      Notification('error', 'Xatolik', 'Yangilashda xatolik yuz berdi');
    }
  },

  deleteUser: async (id: number) => {
    try {
      const response = await apiConfig().deleteRequest(`${ApiUrls.TEACHERS}/${id}`);
      Notification('success', 'O‘chirildi', 'Foydalanuvchi o‘chirildi');
      console.log(response);
      
    } catch (error) {
      console.error("Error deleting user:", error);
      Notification('error', 'Xatolik', 'O‘chirishda xatolik yuz berdi');
    }
  },
};

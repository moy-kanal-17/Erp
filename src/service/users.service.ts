
import { apiConfig } from '@api/config';
import { ApiUrls } from '@api/api-urls';
import { Notification } from '../helpers';

export const userService = {
  getStudents: async () => {
    try {
      const params = {
        page: 1,
        limit: 10,}
      const response = await apiConfig().getRequest(ApiUrls.STUDENTS,params);
      console.log("📦 Foydalanuvchilar:", response);
      return response?.data.data;
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
      const response = await apiConfig().postRequest(ApiUrls.STUDENTS, data);
      Notification('success', 'Yaratildi', 'Foydalanuvchi yaratildi');
      return response
    } catch (error) {
      console.error("Error creating user:", error);
      Notification('error', 'Xatolik', 'Yaratishda xatolik yuz berdi');
    }
  },

  updateUser: async (id: number, data: any) => {
    try {
      const response = await apiConfig().patchRequest(`${ApiUrls.STUDENTS}/${id}`, data);
      Notification('success', 'Yangilandi', 'Foydalanuvchi yangilandi');
      console.log(response);
      
    } catch (error) {
      console.error("Error updating user:", error);
      Notification('error', 'Xatolik', 'Yangilashda xatolik yuz berdi');
    }
  },

  deleteUser: async (id: number) => {
    try {
      const response = await apiConfig().deleteRequest(`${ApiUrls.STUDENTS}/${id}`);
      Notification('success', 'O‘chirildi', 'Foydalanuvchi o‘chirildi');
      console.log(response);
    } catch (error) {
      console.error("Error deleting user:", error);
      Notification('error', 'Xatolik', 'O‘chirishda xatolik yuz berdi');
    }
  },
};

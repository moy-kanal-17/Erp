import { apiConfig } from '@api/config';
import type { Course } from '../types/course';
import { ApiUrls } from "@api/api-urls"
import type { ParamsType } from "@types"

export const courseService = {

  async getCourses(params:ParamsType){
        const res = await apiConfig().getRequest(ApiUrls.COURSES, params)
        return res?.data.courses
    },

  

  createCourse: async (data: Course): Promise<Course> => {
    const res = await apiConfig().postRequest('/courses', data);
    return res?.data;
  },

  //   "title": "Frontend",
  // "description": "Learn HTML and JS.",
  // "price": 250000,
  // "duration": 3,
  // "lessons_in_a_week": 5,
  // "lessons_in_a_month": 12,
  // "lesson_duration": 240

  updateCourse: async (id: number, data: Course) => {

  const { id: _,
    //  is_active, created_at,updated_at, groups,
      ...cleanData } = data;

  const res = await apiConfig().patchRequest(`/courses/${id}`, cleanData);
  return res?.data;
},

  deleteCourse: async (id: number) => {

    const res= await apiConfig().deleteRequest(`/courses/${id}`);
    return res
  },
};

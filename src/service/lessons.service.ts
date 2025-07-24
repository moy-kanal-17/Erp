import { apiConfig } from "@api/config"
import { ApiUrls } from "@api/api-urls"
import {  type ParamsType } from "@types"
import type { Lesson } from "../types/lessons"
export const lessonService = {
    async lessons(params:ParamsType){
        const res = await apiConfig().getRequest(ApiUrls.LEASSONS, params)
        return res?.data.lessons
    },
    async getLesson( id: number){
        const res = await apiConfig().getRequest(`${ApiUrls.LEASSONS}/${id}`)
        console.log(res?.data.student,'-----res in service');
        
        return res?.data.student
    },


    async getLessonTeachers( id: number){
        const res = await apiConfig().getRequest(`${ApiUrls.LEASSONS}/${id}`)
        console.log(res?.data.teacher,'-----res in service');
        console.log(res?.data.group,"grouuup???");
        
        return res?.data.teacher
    },


    async createLessons(model:Lesson):Promise<any>{
        const res = await apiConfig().postRequest(ApiUrls.LEASSONS, model)
        return res
    },
  async updateGroup(model: Lesson): Promise<any> {
  const { id, ...body } = model;
  const res = await apiConfig().patchRequest(`${ApiUrls.LEASSONS}/${id}`, body);
  return res;
}
,
    async deleteLesson(id: number):Promise<any>{
        const res = await apiConfig().deleteRequest(`${ApiUrls.LEASSONS}/${id}`)
        return res
    }
}
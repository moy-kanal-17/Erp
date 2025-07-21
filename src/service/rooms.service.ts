import { apiConfig } from "@api/config"
import { ApiUrls } from "@api/api-urls"
import { type Room, type ParamsType } from "@types"
export const roomService = {
    async getRooms(params:ParamsType){
        const res = await apiConfig().getRequest(ApiUrls.ROOMS, params)
        return res?.data
    },
    async getRoomStudents(params:ParamsType, id: number){
        const res = await apiConfig().getRequest(`${ApiUrls.ROOMS}/${id}`, params)
        return res
    },
    async createRoom(model:Room):Promise<any>{
        const res = await apiConfig().postRequest(ApiUrls.ROOMS, model)
        return res
    },
  async updateRoom(model: Room): Promise<any> {
  const { id, ...body } = model;
  const res = await apiConfig().patchRequest(`${ApiUrls.ROOMS}/${id}`, body);
  return res;
}
,
    async deleteRoom(id: number):Promise<any>{
        const res = await apiConfig().deleteRequest(`${ApiUrls.ROOMS}/${id}`)
        return res
    }
}
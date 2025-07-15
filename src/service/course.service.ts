import { apiConfig } from "@api/config"
import { ApiUrls } from "@api/api-urls"
import type { ParamsType } from "@types"
export const courseService = {
    async getCourses(params:ParamsType){
        const res = await apiConfig().getRequest(ApiUrls.COURSES, params)
        return res
    },
}
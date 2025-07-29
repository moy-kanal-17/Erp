import { apiConfig } from "@api/config"
import { ApiUrls } from "@api/api-urls"
import { type Branch, type ParamsType } from "@types"
export const BranchService = {
    async getBranch(params:ParamsType){
        const res = await apiConfig().getRequest(ApiUrls.BRANCHES, params)
        return res?.data
    },
    async getBranchtudents(params:ParamsType, id: number){
        const res = await apiConfig().getRequest(`${ApiUrls.BRANCHES}/${id}`, params)
        return res
    },
    async createBranch(model:Branch):Promise<any>{
        const res = await apiConfig().postRequest(ApiUrls.BRANCHES, model)
        return res
    },
  async updateBranch(id:number,model: Branch): Promise<any> {
  const {  ...body } = model;
  console.log("updateBranch", model);
  
  const res = await apiConfig().patchRequest(`${ApiUrls.BRANCHES}/${id}`, body);
  return res;
}
,
    async deleteBranch(id: number):Promise<any>{
        const res = await apiConfig().deleteRequest(`${ApiUrls.BRANCHES}/${id}`)
        return res
    }
}
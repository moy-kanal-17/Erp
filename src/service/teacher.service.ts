import { ApiUrls } from "@api/api-urls";
import { apiConfig } from "@api/config";
import type { ParamsType } from "@types";

export const teacherService = {
	async getTeacher(params: ParamsType) {
		const res = await apiConfig().getRequest(ApiUrls.TEACHER, params);
		return res;
	},
	async getTeacherMyGroups() {
		const res = await apiConfig().getRequest(ApiUrls.GROUP_TEACHERS_MY);
		return res;
	},
	async deleteTeacher(id: number) {
		const res = await apiConfig().deleteRequest(`${ApiUrls.TEACHER}/${id}`);
		return res;
	},
	async updateTeacher(id: number, body: object) {
		const res = await apiConfig().patchRequest(
			`${ApiUrls.TEACHER}/${id}`,
			body
		);
		return res;
	},
	async getTeacherGroupById(id: number) {
		const res = await apiConfig().getRequest(
			`${ApiUrls.GROUP_TEACHERS_BY_TEACHER_ID}/${id}`
		);
		return res;
	},
	async createTeacher(body: object) {
		const res = await apiConfig().postRequest(`${ApiUrls.TEACHER}`, body);
		return res;
	},
};

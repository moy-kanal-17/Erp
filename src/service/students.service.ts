import { ApiUrls } from "@api/api-urls";
import { apiConfig } from "@api/config";
import type { ParamsType } from "@types";

export const studentService = {
	async getStudent(params: ParamsType) {
		const res = await apiConfig().getRequest(ApiUrls.STUDENTS, params);
		return res;
	},
	async deleteStudent(id: number) {
		const res = await apiConfig().deleteRequest(`${ApiUrls.STUDENTS}/${id}`);
		return res;
	},
	async updateStudent(id: number, body: object) {
		const res = await apiConfig().patchRequest(
			`${ApiUrls.STUDENTS}/${id}`,
			body
		);
		return res;
	},
	async createStudent(body: object) {
		const res = await apiConfig().postRequest(`${ApiUrls.STUDENTS}`, body);
		return res;
	},
};

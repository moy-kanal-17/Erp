import { ApiUrls } from "@api/api-urls";
import { apiConfig } from "@api/config";
import type { ParamsType } from "@types";

export const groupTeacherService = {
    async getGroup(params: ParamsType | {}) {
        const res = await apiConfig().getRequest(ApiUrls.GROUP_TEACHER, params);
        return res;
    },
    async getGroupById(id: Number) {
        const res = await apiConfig().getRequest(
            `${ApiUrls.GROUP_TEACHER}/${id}`
        );
        console.log("res", res)
        return res;
    },
    async getTeachersGroupById(id: Number) {
        const res = await apiConfig().getRequest(
            `${ApiUrls.GROUPS}/${id}/teacher`
        );
        console.log("res---------", res)
        return res?.data;
    },
    async getGroupLessons(id: number) {
        const res = await apiConfig().getRequest(`${ApiUrls.GROUP_LESSONS}/${id}`);
        return res;
    },
    async activateGroupTeacher(id: number) {
        const res = await apiConfig().patchRequest(
            `${ApiUrls.GROUP_TEACHERS}/${id}/activate`
        );
        return res;
    },
    async deactivateGroupTeacher(id: number) {
        const res = await apiConfig().patchRequest(`${ApiUrls.GROUP_TEACHERS}/deactivate/${id}`);
        return res;
    },
    async getGroupStudents(id: number) {
        const res = await apiConfig().getRequest(
            `${ApiUrls.GROUP_STUDENTS_BY_GROUP_ID}/${id}`
        );
        return res;
    },
    async getGroupTeachers(id: number) {
        const res = await apiConfig().getRequest(
            `${ApiUrls.GROUP_TEACHERS_BY_GROUP_ID}/${id}`
        );
        return res;
    },
    async deleteGroup(id: number) {
        const res = await apiConfig().deleteRequest(`${ApiUrls.GROUPS}/${id}`);
        return res;
    },
    async updateGroup(id: number, body: object) {
        const res = await apiConfig().patchRequest(
            `${ApiUrls.GROUPS}/${id}`,
            body
        );
        return res;
    },
    async createGroup(body: object) {
        const res = await apiConfig().postRequest(`${ApiUrls.GROUPS}`, body);
        return res;
    },

    async addStudentToGroup(data: any) {
        const res = await apiConfig().postRequest(
            `${ApiUrls.GROUP_STUDENTS}`,
            data
        );
        return res;
    },
    async addTeacherToGroup(data: any) {
        const res = await apiConfig().postRequest(
            `${ApiUrls.GROUP_TEACHERS}`,
            data
        );
        return res;
    },
};




// Pending: The initial state; the asynchronous operation is still in progress.
// Fulfilled (Resolved): The operation completed successfully, and the Promise now holds a resulting value.
// Rejected: The operation failed, and the Promise holds a reason for the failure (an error object).
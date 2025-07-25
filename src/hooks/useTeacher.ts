import { teacherService } from "@service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ParamsType } from "@types";

export const useTeachers = (params: ParamsType) => {
	const queryClient = useQueryClient();
	const { data } = useQuery({
		queryKey: ["teacher", params],
		queryFn: async () => teacherService.getTeacher(params),
	});
	const useTeacherCreate = () => {
		return useMutation({
			mutationFn: async (data: any) => teacherService.createTeacher(data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["teacher"] });
			},
		});
	};
	const useTeacherUpdate = () => {
		return useMutation({
			mutationFn: async ({ id, data }: { id: number; data: any }) =>
				teacherService.updateTeacher(id, data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["teacher"] });
			},
		});
	};
	const useTeacherDelete = () => {
		return useMutation({
			mutationFn: async (id: number) => teacherService.deleteTeacher(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["teacher"] });
			},
		});
	};
	return { useTeacherCreate, data, useTeacherUpdate, useTeacherDelete };
};

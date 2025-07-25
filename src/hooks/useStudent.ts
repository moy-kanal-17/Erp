import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@service";
import type { ParamsType } from '@types'

export const useStudents = (params: ParamsType) => {
	const queryClient = useQueryClient();
	const { data } = useQuery({
		queryKey: ["student", params],
		queryFn: async () => studentService.getStudent(params),
	});
	const useStudentCreate = () => {
		return useMutation({
			mutationFn: async (data: any) => studentService.createStudent(data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["student"] });
			},
		});
	};
	const useStudentUpdate = () => {
		return useMutation({
			mutationFn: async ({ id, data }: { id: number; data: any }) =>
				studentService.updateStudent(id, data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["student"] });
			},
		});
	};
	const useStudentDelete = () => {
		return useMutation({
			mutationFn: async (id: number) => studentService.deleteStudent(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["student"] });
			},
		});
	};
	return { useStudentCreate, data, useStudentUpdate, useStudentDelete };
};
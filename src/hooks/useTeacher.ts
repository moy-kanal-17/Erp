import { teacherService } from "@service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {  ParamsType } from "@types";

export const useTeachers = (params?: ParamsType, id?: number) => {
  return useQuery({
    enabled: !id,
    queryKey: ["teacher", params],
    queryFn: async () => teacherService.getTeacher(params!),
  });
};

export const useTeacherGroupStudents = (id?: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["teacher-group-students", id],
    queryFn: async () => teacherService.getTeacherGroupById(id!),
  });
};

export const useTeacherMyGroups = () => {
  return useQuery({
    queryKey: ["teacher-my-groups"],
    queryFn: async () => teacherService.getTeacherMyGroups(),
  });
};

export const useTeacherMyAttendace = () => {
  return useQuery({
    queryKey: ["teacher-my-groups"],
    queryFn: async () => teacherService.getTeacherMyGroups(),
  });
};

export const useTeacherCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => teacherService.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
    },
  });
};

export const useTeacherUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) =>
      teacherService.updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
    },
  });
};

export const useTeacherDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => teacherService.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
    },
  });
};

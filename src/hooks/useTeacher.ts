import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "@service";
// import type { ParamsType } from "@types";

export const useTeachers = (id?: number) => {
  const queryClient = useQueryClient();

  const { data: groupStudents, isLoading } = useQuery({
    enabled: !!id,
    queryKey: ["teacher-group-students", id],
    queryFn: async () => teacherService.getTeacherGroupById(id!),
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

  return {
    useTeacherCreate,
    groupStudents,
    isLoading,
    useTeacherUpdate,
    useTeacherDelete,
  };
};
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupTeacherService } from '@service';
import type { ParamsType } from '@types';

interface GroupTeacher {
  id: number;
  group: { id: number; name: string }; 
  teacher: { id: number; first_name: string; last_name: string };
  status: boolean;
  start_date: string;
  end_date: string;
}

export const useGroupTeachers = (params: ParamsType = { page: 1, limit: 10 }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['group-teachers', params],
    queryFn: async () => groupTeacherService.getGroup(params),
  });

  const useGroupTeacherCreate = () => {
    return useMutation({
      mutationFn: async (data: { group: number; teacher: number; start_date: string; end_date: string }) =>
        groupTeacherService.createGroup(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['group-teachers'] });
      },
    });
  };

  const useGroupTeacherUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Partial<GroupTeacher> }) =>
        groupTeacherService.updateGroup(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['group-teachers'] });
      },
    });
  };

  const useGroupTeacherDelete = () => {
    return useMutation({
      mutationFn: async (id: number) => groupTeacherService.deleteGroup(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['group-teachers'] });
      },
    });
  };

  const useGroupTeacherActivate = () => {
    return useMutation({
      mutationFn: async (id: number) => groupTeacherService.activateGroupTeacher(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['group-teachers'] });
      },
    });
  };

  const useGroupTeacherDeactivate = () => {
    return useMutation({
      mutationFn: async (id: number) => groupTeacherService.deactivateGroupTeacher(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['group-teachers'] });
      },
    });
  };

  return {
    data: data?.data?.groupTeachers as GroupTeacher[],
    isLoading,
    useGroupTeacherCreate,
    useGroupTeacherUpdate,
    useGroupTeacherDelete,
    useGroupTeacherActivate,
    useGroupTeacherDeactivate,
  };
};
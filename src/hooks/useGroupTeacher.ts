import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupTeacherService } from '@service';
import type { ParamsType } from '@types';

import type { GroupTeacher } from '@types';


export const useGroupTeachers = (params: ParamsType = { page: 1, limit: 10 }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['group-teachers', params],
    queryFn: () => groupTeacherService.getGroup(params),
  });

  return {
    data: data?.data?.groupTeachers as GroupTeacher[],
    isLoading,
  };
};


export const useTeachersGroupById = (id: number) => {
  return useQuery({
    queryKey: ['teachersGroup', id],
    queryFn: () => groupTeacherService.getTeachersGroupById(id),
    enabled: !!id,
    refetchOnMount: 'always', // Ensure fresh data
  });
};


export const useGroupTeacherCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { group: number; teacher: number; start_date: string; end_date: string }) =>
      groupTeacherService.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-teachers'] });
    },
  });
};


export const useGroupTeacherUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<GroupTeacher> }) =>
      groupTeacherService.updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-teachers'] });
    },
  });
};


export const useGroupTeacherDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => groupTeacherService.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-teachers'] });
    },
  });
};


export const useGroupTeacherActivate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => groupTeacherService.activateGroupTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-teachers'] });
    },
  });
};


export const useGroupTeacherDeactivate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => groupTeacherService.deactivateGroupTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-teachers'] });
    },
  });
};

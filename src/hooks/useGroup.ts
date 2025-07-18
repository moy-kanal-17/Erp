import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupService } from "@service";
import { type Group, type ParamsType } from "@types";

export const useGroup = (params: ParamsType, id?: number) => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["groups", params],
    queryFn: async () => groupService.getGroups(params),
  });
  const groupStudentsQuery = useQuery({
    queryKey: ["groups", params],
    queryFn: async () => groupService.getGroupStudents(params, id!),
  });
  const students = groupStudentsQuery.data;
  // Mutations
  const useGroupCreate = () => {
    return useMutation({
      mutationFn: async (data: Group) => groupService.createGroup(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["groups"] });
      },
    });
  };
  const useGroupByid = (params: ParamsType, id: number) => {
    const queryClient = useQueryClient();
    const { data } = useQuery({
      queryKey: ["groups", params],
      queryFn: async () => groupService.getGroupStudents(params,id),
    });
    const groupStudentsQuery = useQuery({
      queryKey: ["groups", params],
      queryFn: async () => groupService.getGroupStudents(params, id!),
    });
    const students = groupStudentsQuery.data;
    return students
  };
  const useGroupUpdate = () => {
    return useMutation({
      mutationFn: async (data: Group) => groupService.updateGroup(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["groups"] });
      },
    });
  };
  const useGroupDelete = () => {
    return useMutation({
      mutationFn: async (id: number) => groupService.deleteGroup(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["groups"] });
      },
    });
  };

  // Return the data and mutation hooks
  return {
    data,
    students,
    useGroupCreate,
    useGroupUpdate,
    useGroupDelete,
    useGroupByid
  };
};

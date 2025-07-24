import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupService } from "@service";
import { type Group, type ParamsType } from "@types";

export const useGroup = (params: ParamsType, id?: number) => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["groups", params],
    queryFn: async () => groupService.getGroups(params),
  });

// export const useGroupByid = (params: ParamsType, id?: number) => {

//     const queryClient = useQueryClient();
//   const { data } = useQuery({
//     queryKey: ["groups", params],
//     queryFn: async () => groupService.getGroupStudents(id!),
//   });

  // const groupStudentsQuery = useQuery({
  //   queryKey: ["group-students"],
  //   queryFn: async () => groupService.getGroupStudents( id!),
  // });
  // const students = groupStudentsQuery.data;
  // Mutations
  const useGroupCreate = () => {
    return useMutation({
      mutationFn: async (data: Group) => groupService.createGroup(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["groups"] });
      },
      });
  };



  const groupStudentsQuery= useQuery({
    enabled: !!id,
    queryKey:["group-students"],
    queryFn:async () => groupService.getGroupStudents(id!)
  });
  const students = groupStudentsQuery.data

const groupLessonsQuery= useQuery({
    enabled: !!id,
    queryKey:["teacher"],
    queryFn:async () => groupService.getGroupTeachers(id!)
  });
  const lessons = groupLessonsQuery.data




  const useGroupByid = (params: ParamsType, id: number) => {
    const queryClient = useQueryClient();
    const { data } = useQuery({
      queryKey: ["groups", params],
      queryFn: async () => groupService.getGroupStudents( id),
    });
    console.log(data,queryClient);
    
    
    const groupStudentsQuery = useQuery({
      queryKey: ["groups", params],
      queryFn: async () => groupService.getGroupStudents( id!),
    });
    const students = groupStudentsQuery.data;
    return students;
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
    lessons,
    students,
    useGroupCreate,
    useGroupUpdate,
    useGroupDelete,
    useGroupByid,
  };
};

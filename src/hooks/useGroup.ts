import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupsService } from "@service";
import { type Group, type ParamsType } from "@types";

export const useGroup = (params: ParamsType, id?: number) => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["groups", params],
    queryFn: async () => groupsService.getGroupStudents(id!),
  });

// export const useGroupByid = (params: ParamsType, id?: number) => {

//     const queryClient = useQueryClient();
//   const { data } = useQuery({
//     queryKey: ["groups", params],
//     queryFn: async () => groupsService.getGroupStudents(id!),
//   });

  // const groupStudentsQuery = useQuery({
  //   queryKey: ["group-students"],
  //   queryFn: async () => groupsService.getGroupStudents( id!),
  // });
  // const students = groupStudentsQuery.data;
  // Mutations
  const useGroupCreate = () => {
    return useMutation({
      mutationFn: async (data: Group) => groupsService.createGroup(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["groups"] });
      },
      });
  };



  const groupStudentsQuery= useQuery({
    enabled: !!id,
    queryKey:["group-students"],
    queryFn:async () => groupsService.getGroupStudents(id!)
  });
  const students = groupStudentsQuery.data

const groupLessonsQuery= useQuery({
    enabled: !!id,
    queryKey:["teacher"],
    queryFn:async () => groupsService.getGroupTeachers(id!)
  });
  const lessons = groupLessonsQuery.data




  const useGroupByid = (params: ParamsType, id: number) => {
    const queryClient = useQueryClient();
    const { data } = useQuery({
      queryKey: ["groups", params],
      queryFn: async () => groupsService.getGroupStudents( id),
    });
    console.log(data,queryClient);
    
    
    const groupStudentsQuery = useQuery({
      queryKey: ["groups", params],
      queryFn: async () => groupsService.getGroupStudents( id!),
    });
    const students = groupStudentsQuery.data;
    return students;
  };
  const useGroupUpdate = (id:number) => {
    return useMutation({
      mutationFn: async (data: Group,) => groupsService.updateGroup(id,data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["groups"] });
      },
    });
  };
  const useGroupDelete = () => {
    return useMutation({
      mutationFn: async (id: number) => groupsService.deleteGroup(id),
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





export const useGroups = (params: ParamsType | {}, id = 0) => {
	const queryClient = useQueryClient();
	const { data } = useQuery({
		queryKey: ["groups", params],
		queryFn: async () => groupsService.getGroup(params),
	});
	const { data: dataById } = useQuery({
		enabled: !!id,
		queryKey: ["groupById"],
		queryFn: async () => groupsService.getGroupById(id),
	});
	const groupStudentsQuery = useQuery({
		enabled: !!id,
		queryKey: ["group-students"],
		queryFn: async () => groupsService.getGroupStudents(id),
	});
	const students = groupStudentsQuery.data;
	const groupLessonsQuery = useQuery({
		enabled: !!id,
		queryKey: ["group-lessons"],
		queryFn: async () => groupsService.getGroupLessons(id),
	});
	const lessons = groupLessonsQuery.data;
	const groupTeachersQuery = useQuery({
		enabled: !!id,
		queryKey: ["group-teachers"],
		queryFn: async () => groupsService.getGroupTeachers(id),
	});
	const teachers = groupTeachersQuery.data;

	const useGroupCreate = () => {
		return useMutation({
			mutationFn: async (data: any) => groupsService.createGroup(data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["groups"] });
			},
		});
	};
	const useGroupUpdate = () => {
		return useMutation({
			mutationFn: async ({ id, data }: { id: number; data: any }) =>
				groupsService.updateGroup(id, data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["groups"] });
			},
		});
	};
	const useGroupDelete = () => {
		return useMutation({
			mutationFn: async (id: number) => groupsService.deleteGroup(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["groups"] });
			},
		});
	};

	const useGroupAddStudent = () => {
		return useMutation({
			mutationFn: async (data: any) => groupsService.addStudentToGroup(data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["groups", "add-student"] });
			},
		});
	};

	const useGroupAddTeacher = () => {
		return useMutation({
			mutationFn: async (data: any) => groupsService.addTeacherToGroup(data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["groups", "add-teacher"] });
			},
		});
	};

	return {
		useGroupCreate,
		data,
		useGroupUpdate,
		useGroupDelete,
		dataById,
		useGroupAddStudent,
		useGroupAddTeacher,
		students,
		teachers,
		lessons,
	};
};
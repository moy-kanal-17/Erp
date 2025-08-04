import { useQuery } from "@tanstack/react-query";
import type { ParamsType } from "@types";
import { courseService } from "@service";

export const useCourse = (params: ParamsType) => {

  const { data } = useQuery({
    queryKey: ["courses", params],
    queryFn: async () => courseService.getCourses(params),
  });

  const useCourseCreate = () => {
    return useQuery({
      queryKey: ["createCourse"],
      queryFn: async (data: any) => courseService.createCourse(data),
    });
  }

  const useCourseUpdate = () => {
    return useQuery({
      queryKey: ["updateCourse"],
      queryFn: async ({ id, data }: any ) =>
        courseService.updateCourse(id, data),
    });
  };

  const useCourseDelete = () => {
    return useQuery({
      queryKey: ["deleteCourse"],
      queryFn: async (id: any) => courseService.deleteCourse(id),
    });
  };

  return {
    data,
    useCourseCreate,
    useCourseUpdate,
    useCourseDelete,
  };
};

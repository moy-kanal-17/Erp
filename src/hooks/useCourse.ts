import { useQuery } from "@tanstack/react-query";
import type { ParamsType } from "@types";
import { courseService } from "@service";

export const useCourse = (params: ParamsType) => {

  const { data } = useQuery({
    queryKey: ["courses", params],
    queryFn: async () => courseService.getCourses(params),
  });

  // Mutations

    // Return the data and mutation hooks
  return {
    data,
  };
};

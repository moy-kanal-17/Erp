import { BranchService } from "@service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ParamsType } from "@types";

export const useBranch = (params: ParamsType) => {
	const queryClient = useQueryClient();
	const { data } = useQuery({
		queryKey: ["branch", params],
		queryFn: async () => BranchService.getBranch(params),
	});
	console.log(data,"dataa!! Branch");
	
	const useBranchCreate = () => {
		return useMutation({
			mutationFn: async (data: any) => BranchService.createBranch(data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["Branch"] });
			},
		});
	};
const useBranchUpdate = () =>
  useMutation({
    mutationFn: (data: any) => {
      const { id, ...rest } = data;
      return BranchService.updateBranch(id, rest);
    },
    onSuccess: () => queryClient.invalidateQueries(),
  });

	const useBranchDelete = () => {
		return useMutation({
			mutationFn: async (id: number) => BranchService.deleteBranch(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["Branch"] });
			},
		});
	};
	return { useBranchCreate, data, useBranchUpdate, useBranchDelete };
};

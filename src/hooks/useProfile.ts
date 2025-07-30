import { useQuery,  } from '@tanstack/react-query';
import { profileService} from '@service';

export const useProfile = () => {
  const profileQuery = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => profileService.getProfile(),
    enabled: !!localStorage.getItem('access_token'),
  });



  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    // updateProfile: updateProfileMutation.mutate,
    // isUpdating: updateProfileMutation.isLoading,
  };
};
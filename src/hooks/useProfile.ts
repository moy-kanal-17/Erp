import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { profileService } from '@service';
import { getUserIdFromToken, getUserRoleFromToken } from '@helpers';

export const useProfile = () => {
  const id = getUserIdFromToken();
  const role = getUserRoleFromToken();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', role, id],
    queryFn: () => profileService.getProfile(),
    enabled: !!id && !!role,
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: {
      old_password: string;
      password: string;
      confirm_password: string;
    }) => {
      if (!id || !role) throw new Error('Missing role or ID');
      return profileService.updatePassword(role, +id, data);
    },
    onSuccess: () => {
      // message.success('Password changed successfully');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Failed to update password');
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!id || !role) throw new Error('Missing role or ID');
      return profileService.updateAvatar(role, +id, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', role, id] });
      message.success('Avatar updated successfully');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Failed to update avatar');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      address: string;
      bio: string;
    }) => {
      if (!id || !role) throw new Error('Missing role or ID');
      return profileService.updateProfile(role, +id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', role, id] });
      message.success('Profile updated successfully');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Failed to update profile');
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updatePassword: updatePasswordMutation.mutate,
    isUpdatingPassword: updatePasswordMutation.isPending,
    updateAvatar: updateAvatarMutation.mutate,
    isUpdatingAvatar: updateAvatarMutation.isPending,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
};
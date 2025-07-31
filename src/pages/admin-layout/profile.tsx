import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, Form, Input, Button, Typography, Spin } from 'antd';
import { CameraOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { useProfile } from '@hooks';
import { clearStorage } from '@helpers';

const { Title } = Typography;

const ProfileCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 24px auto;
`;

const ProfileAvatar = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  border: 2px solid #fff;
`;

const AvatarUploadButton = styled.label`
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background-color: #f56a00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d45a00;
  }
`;

const AdminProfile = () => {
  const {
    profile,
    isLoading,
    isError,
    error,
    updatePassword,
    isUpdatingPassword,
    updateAvatar,
    isUpdatingAvatar,
  } = useProfile();
  const [form] = Form.useForm();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleLogout = () => {
    clearStorage();
    window.location.href = '/';
  };

  const handlePasswordSubmit = (values: {
    old_password: string;
    password: string;
    confirm_password: string;
  }) => {
    updatePassword(values, {
      onSuccess: () => {
        form.resetFields();
        setIsChangingPassword(false);
      },
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatar(file);
    }
  };

  if (isLoading) {
    return (
      <ProfileCard>
        <Spin size="large" />
      </ProfileCard>
    );
  }

  if (isError) {
    return (
      <ProfileCard>
        <Title level={4} style={{ color: '#f56a00' }}>
          Error loading profile: {(error as any)?.message || 'Unknown error'}
        </Title>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ backgroundColor: '#f56a00', borderColor: '#f56a00' }}
        >
          Logout
        </Button>
      </ProfileCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileCard title="Admin Profile">
        <div style={{ textAlign: 'center' }}>
          <ProfileAvatar>
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt="Avatar" />
            ) : (
              <AvatarPlaceholder>
                {profile?.first_name?.[0] || 'A'}
                {profile?.last_name?.[0] || 'D'}
              </AvatarPlaceholder>
            )}
            <AvatarUploadButton>
              <CameraOutlined style={{ fontSize: 12, color: '#fff' }} />
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
                disabled={isUpdatingAvatar}
              />
            </AvatarUploadButton>
          </ProfileAvatar>
          <Title level={4} style={{ color: '#000' }}>
            {profile?.first_name} {profile?.last_name}
          </Title>
          <p style={{ color: '#595959', marginBottom: 8 }}>
            Email: {profile?.email || 'N/A'}
          </p>
          <p style={{ color: '#595959', marginBottom: 16 }}>
            Role: {profile?.role || 'Admin'}
          </p>

          {!isChangingPassword ? (
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <Button
                type="primary"
                icon={<LockOutlined />}
                onClick={() => setIsChangingPassword(true)}
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              >
                Change Password
              </Button>
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ backgroundColor: '#f56a00', borderColor: '#f56a00' }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={handlePasswordSubmit}
              style={{ marginTop: 24 }}
            >
              <Form.Item
                name="old_password"
                label="Old Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter a new password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                label="Confirm New Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isUpdatingPassword}
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsChangingPassword(false)}
                    style={{ backgroundColor: '#595959', borderColor: '#595959', color: '#fff' }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form.Item>
            </Form>
          )}
        </div>
      </ProfileCard>
    </motion.div>
  );
};

export default AdminProfile;
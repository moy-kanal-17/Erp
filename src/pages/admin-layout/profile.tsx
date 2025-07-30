import  { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, Form, Input, Button, Typography, Avatar,  Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useProfile } from '@hooks';
import { clearStorage } from '@helpers';

const { Title } = Typography;

const ProfileCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const ProfileAvatar = styled(Avatar)`
  background-color: #1890ff;
  margin-bottom: 16px;
`;

const AdminProfile = () => {
  const { profile, isLoading, isError, error} = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    if (profile) {
      form.setFieldsValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSubmit = (values: { firstName: string; lastName: string; email: string }) => {
  console.log(values);
  
  };

  const handleLogout = () => {
    clearStorage();
    window.location.href = '/login';
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
        <Title level={4} style={{ color: '#ff4d4f' }}>
          Error loading profile: {(error as any)?.message || 'Unknown error'}
        </Title>
        <Button type="primary" danger onClick={handleLogout}>
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
        {!isEditing ? (
          <div style={{ textAlign: 'center' }}>
            <ProfileAvatar size={64} icon={<UserOutlined />} />
            <Title level={4}>
              {profile?.firstName} {profile?.lastName}
            </Title>
            <p style={{ color: '#595959', marginBottom: 8 }}>Email: {profile?.email}</p>
            <p style={{ color: '#595959', marginBottom: 16 }}>Role: {profile?.role}</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <Button type="primary" onClick={handleEdit}>
                Edit Profile
              </Button>
              <Button type="primary" danger onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please enter your first name' }]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter your last name' }]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <Button type="primary" htmlType="submit" size="large" >
                  Save
                </Button>
                <Button size="large" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </ProfileCard>
    </motion.div>
  );
};

export default AdminProfile;
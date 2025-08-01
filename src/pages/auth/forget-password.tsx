import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, Input, Select, Button, Skeleton, Alert, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useForgetPassword } from '@hooks';

const StyledContainer = styled(motion.div)`
  width: 100%;
  min-height: calc(100vh - 112px);
  padding: 2%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  padding: 24px;
`;

const StyledFormItem = styled.div`
  margin-bottom: 16px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 14px;
  color: #595959;
  margin-bottom: 8px;
  font-weight: 500;
`;

const StyledButton = styled(Button)`
  width: 100%;
  background: #1890ff;
  border: none;
  border-radius: 8px;
  height: 40px;
  font-size: 14px;
  &:hover {
    background: #40a9ff;
  }
`;

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher'>('admin');
  const { mutate, isPending, error } = useForgetPassword();

  const handleSubmit = () => {
    if (!email || !role) {
      message.error('Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      message.error('Please enter a valid email');
      return;
    }

    mutate(
      { email, role },
      {
        onSuccess: () => {
          message.success('OTP sent successfully! Check your email.');
          setEmail('');
          setRole('admin');
        },
        onError: () => {
          message.error('Failed to send OTP. Try again.');
        },
      }
    );
  };

  return (
    <StyledContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledCard>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#000', marginBottom: '24px', textAlign: 'center' }}>
          Forgot Password
        </h2>
        {isPending && <Skeleton active paragraph={{ rows: 4 }} title={false} />}
        {error && <Alert message={`Error: ${error.message}`} type="error" showIcon style={{ marginBottom: '16px' }} />}
        <StyledFormItem>
          <StyledLabel>Email</StyledLabel>
          <Input
            prefix={<MailOutlined style={{ color: '#1890ff' }} />}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="large"
            style={{ borderRadius: '8px', fontSize: '14px' }}
            disabled={isPending}
          />
        </StyledFormItem>
        <StyledFormItem>
          <StyledLabel>Role</StyledLabel>
          <Select
            value={role}
            onChange={(value) => setRole(value)}
            size="large"
            style={{ width: '100%', borderRadius: '8px', fontSize: '14px' }}
            disabled={isPending}
          >
            <Select.Option value="teacher">Teacher</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </StyledFormItem>
        <StyledButton type="primary" onClick={handleSubmit} loading={isPending}>
          Submit
        </StyledButton>
      </StyledCard>
    </StyledContainer>
  );
};

export default ForgetPassword;
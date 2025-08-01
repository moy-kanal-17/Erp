import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, Input, Select, Button, Skeleton, Alert, message, Modal } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useForgetPassword } from '@hooks';
import { useVerifyOtp } from '@hooks';

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

const StyledModal = styled(Modal)`
  .ant-modal-content {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  }
  .ant-modal-header {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px 8px 0 0;
    border-bottom: none;
  }
  .ant-modal-title {
    font-size: 16px;
    color: #000;
    font-weight: 600;
  }
`;

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher'>('admin');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const { mutate: sendOtp, isPending: isSendingOtp, error: sendOtpError } = useForgetPassword();
  const { mutate: verifyOtp, isPending: isVerifyingOtp, error: verifyOtpError } = useVerifyOtp();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!email || !role) {
      message.error('Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      message.error('Please enter a valid email');
      return;
    }

    sendOtp(
      { email, role },
      {
        onSuccess: () => {
          message.success('OTP sent successfully! Check your email.');
          setIsModalOpen(true);
        },
        onError: () => {
          message.error('Failed to send OTP. Try again.');
        },
      }
    );
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      message.error('Please enter a valid 6-digit OTP');
      return;
    }

    verifyOtp(
      { otp: Number(otp) }, // Convert OTP to number
      {
        onSuccess: () => {
          message.success('OTP verified successfully!');
          setIsModalOpen(false);
          setOtp('');
          navigate('/reset-password');
        },
        onError: () => {
          message.error('Invalid OTP. Try again.');
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
        {isSendingOtp && <Skeleton active paragraph={{ rows: 4 }} title={false} />}
        {sendOtpError && (
          <Alert message={`Error: ${sendOtpError.message}`} type="error" showIcon style={{ marginBottom: '16px' }} />
        )}
        <StyledFormItem>
          <StyledLabel>Email</StyledLabel>
          <Input
            prefix={<MailOutlined style={{ color: '#1890ff' }} />}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="large"
            style={{ borderRadius: '8px', fontSize: '14px' }}
            disabled={isSendingOtp}
          />
        </StyledFormItem>
        <StyledFormItem>
          <StyledLabel>Role</StyledLabel>
          <Select
            value={role}
            onChange={(value) => setRole(value)}
            size="large"
            style={{ width: '100%', borderRadius: '8px', fontSize: '14px' }}
            disabled={isSendingOtp}
          >
            <Select.Option value="teacher">Teacher</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </StyledFormItem>
        <StyledButton type="primary" onClick={handleSubmit} loading={isSendingOtp}>
          Submit
        </StyledButton>
      <Button><Link to={"/"}>Back</Link></Button>
      </StyledCard>
      <StyledModal
        title="Enter OTP"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsModalOpen(false)}
            style={{ borderRadius: '8px', fontSize: '14px' }}
          >
            Cancel
          </Button>,
          <Button
            key="verify"
            type="primary"
            onClick={handleVerifyOtp}
            loading={isVerifyingOtp}
            style={{ background: '#1890ff', border: 'none', borderRadius: '8px', fontSize: '14px' }}
          >
            Verify
          </Button>,
        ]}
      >
        {verifyOtpError && (
          <Alert message={`Error: ${verifyOtpError.message}`} type="error" showIcon style={{ marginBottom: '16px' }} />
        )}
        <StyledFormItem>
          <StyledLabel>OTP Code</StyledLabel>
          <Input
            prefix={<LockOutlined style={{ color: '#1890ff' }} />}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            size="large"
            style={{ borderRadius: '8px', fontSize: '14px' }}
            maxLength={6}
            disabled={isVerifyingOtp}
            type="text"
            inputMode="numeric"
          />

        </StyledFormItem>
      </StyledModal>
    </StyledContainer>
  );
};

export default ForgetPassword;
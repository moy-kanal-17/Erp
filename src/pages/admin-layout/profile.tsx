import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Form, Input, Button, Typography, Avatar, Spin, Tag } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined, SaveOutlined, CloseOutlined, MailOutlined, UserSwitchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Enhanced styled components with modern design
const ProfileContainer = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <div 
    style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    {...props}
  >
    {children}
  </div>
);

const GlassCard = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <Card
    style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      width: '100%',
      overflow: 'hidden'
    }}
    bordered={false}
    {...props}
  >
    {children}
  </Card>
);

const ProfileAvatar = ({ size = 100, ...props }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    style={{ display: 'inline-block' }}
  >
    <Avatar
      size={size}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '4px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
      }}
      icon={<UserOutlined />}
      {...props}
    />
  </motion.div>
);

const AnimatedButton = ({
  children,
  variant = 'primary',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  [key: string]: any;
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          border: 'none',
          color: 'white',
          borderRadius: '12px',
          height: '45px',
          boxShadow: '0 8px 20px rgba(238, 90, 36, 0.3)'
        };
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          borderRadius: '12px',
          height: '45px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          color: 'white',
          borderRadius: '12px',
          height: '45px',
          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)'
        };
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      style={{ display: 'inline-block' }}
    >
      <Button
        style={getButtonStyle()}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

const StyledInput = (props:any) => (
  <Input
    style={{
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      height: '45px'
    }}
    {...props}
  />
);

const AdminProfile = () => {
  // Mock data for demonstration - replace with actual useProfile hook
  const profile = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    is_creator: true
  };
  const isLoading = false;
  const isError = false;
  const error = null;

  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    if (profile) {
      form.setFieldsValue({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSubmit = (values : any) => {
    console.log('Form submitted with values:', values);
    // Here you should send `values` to backend via mutation
    setIsEditing(false);
  };

  const handleLogout = () => {
    // clearStorage();
    // window.location.href = '/login';
    console.log('Logout clicked');
  };

  if (isLoading) {
    return (
      <ProfileContainer>
        <GlassCard>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Spin size="large" />
            </motion.div>
            <Text style={{ color: 'white', marginTop: '20px', display: 'block' }}>
              Loading your profile...
            </Text>
          </div>
        </GlassCard>
      </ProfileContainer>
    );
  }

  if (isError) {
    return (
      <ProfileContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Title level={4} style={{ color: '#ff6b6b', marginBottom: '20px' }}>
                  ⚠ Error Loading Profile
                </Title>
              </motion.div>
              <Text style={{ color: 'white', marginBottom: '30px', display: 'block' }}>
                {error || 'Something went wrong. Please try again.'}
              </Text>
              <AnimatedButton variant="danger" onClick={handleLogout} icon={<LogoutOutlined />}>
                Logout
              </AnimatedButton>
            </div>
          </GlassCard>
        </motion.div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <GlassCard>
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: 'center', padding: '40px' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
                >
                  <ProfileAvatar />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Title level={2} style={{ color: 'white', margin: '20px 0 10px', fontWeight: 300 }}>
                    {profile?.first_name} {profile?.last_name}
                  </Title>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  style={{ marginBottom: '30px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
                    <MailOutlined style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                    <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
                      {profile?.email}
                    </Text>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <UserSwitchOutlined style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                    <Tag 
                      style={{ 
                        background: profile?.is_creator 
                          ? 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)'
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '20px',
                        padding: '4px 16px',
                        fontSize: '14px'
                      }}
                    >
                      {profile?.is_creator ? 'Creator' : 'Admin'}
                    </Tag>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}
                >
                  <AnimatedButton onClick={handleEdit} icon={<EditOutlined />}>
                    Edit Profile
                  </AnimatedButton>
                  <AnimatedButton variant="danger" onClick={handleLogout} icon={<LogoutOutlined />}>
                    Logout
                  </AnimatedButton>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="profile-edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                style={{ padding: '40px' }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Title level={3} style={{ color: 'white', textAlign: 'center', marginBottom: '30px', fontWeight: 300 }}>
                    Edit Profile
                  </Title>
                </motion.div>

                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div>
                      <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>First Name</label>
                      <StyledInput size="large" placeholder="Enter your first name" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div>
                      <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>Last Name</label>
                      <StyledInput size="large" placeholder="Enter your last name" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div>
                      <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>Email</label>
                      <StyledInput size="large" placeholder="Enter your email" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div style={{ marginTop: '30px' }}>
                      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <AnimatedButton onClick={() => handleSubmit(form.getFieldsValue())} icon={<SaveOutlined />}>
                          Save Changes
                        </AnimatedButton>
                        <AnimatedButton variant="secondary" onClick={handleCancel} icon={<CloseOutlined />}>
                          Cancel
                        </AnimatedButton>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </ProfileContainer>
  );
};

export default AdminProfile;
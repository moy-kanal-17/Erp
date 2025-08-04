import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Layout, Menu, Dropdown, Button } from 'antd';
import {
  BookOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  BranchesOutlined,
  ReadOutlined,
  DownOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { clearStorage } from '@helpers';
import { useProfile } from '@hooks';

const { Header, Sider, Content } = Layout;

const Admin = () => {
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const { profile } = useProfile('admin');

  console.log("profile in admin❌", profile);

  const handleMenuClick = useCallback(
    (e: any) => {
      switch (e.key) {
        case '1':
          navigate('/admin/');
          break;
        case '2':
          navigate('/admin/groups');
          break;
        case '3':
          navigate('/admin/students');
          break;
        case '4':
          navigate('/admin/teachers');
          break;
        case '5':
          navigate('/admin/courses');
          break;
        case '6':
          navigate('/admin/projects');
          break;
        case '8':
          navigate('/admin/branch');
          break;
        case '9':
          navigate('/admin/rooms');
          break;
        case '10':
          navigate('/admin/profile');
          break;
        default:
          break;
      }
    },
    [navigate]
  );

  const handleLogout = () => {
    clearStorage();
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
    return () => {
      isMounted.current = false;
    };
  }, [navigate]);

  const dropdownMenu = (
    <Menu
      items={[
        {
          key: 'profile',
          icon: <UserOutlined style={{ color: '#1890ff' }} />,
          label: profile ? `${profile.first_name} ${profile.last_name} (${profile.role || 'User'})` : 'Loading...',
          disabled: true,
          style: { color: '#595959', fontSize: '14px', padding: '8px 12px' },
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined style={{ color: '#f56a00' }} />,
          label: 'Logout',
          onClick: handleLogout,
          style: { color: '#595959', fontSize: '14px', padding: '8px 12px' },
        },
      ]}
    />
  );

  return (
    <StyledLayout>
      <StyledSider breakpoint="lg" collapsedWidth="80">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <LogoWrapper>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
              Admin
            </motion.div>
          </LogoWrapper>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            onClick={handleMenuClick}
            items={[
              {
                key: '1',
                icon: <HomeOutlined />,
                label: 'Dashboard',
              },
              {
                key: '2',
                icon: <TeamOutlined />,
                label: 'Groups',
              },
              {
                key: '3',
                icon: <UserOutlined />,
                label: 'Students',
              },
              {
                key: '4',
                icon: <UserOutlined />,
                label: 'Teachers',
              },
              {
                key: '5',
                icon: <BookOutlined />,
                label: 'Courses',
              },
              {
                key: '8',
                icon: <BranchesOutlined />,
                label: 'Branches',
              },
              {
                key: '9',
                icon: <ReadOutlined />,
                label: 'Rooms',
              },
              {
                key: '10',
                icon: <ProfileOutlined />,
                label: 'Profile',
              },
            ]}
          />
        </motion.div>
      </StyledSider>
      <StyledContentLayout>
        <StyledHeader>
          <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ margin: 0, color: '#fff' }}>
            Admin Panel
          </motion.h2>
          <Dropdown overlay={dropdownMenu} placement="bottomRight">
            <Button type="text" style={{ color: 'white' }}>
              <UserOutlined />
              {profile ? `${profile.first_name} ${profile.last_name}` : 'User'} <DownOutlined />
            </Button>
          </Dropdown>
        </StyledHeader>
        <ContentWrapper>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <Outlet />
          </motion.div>
        </ContentWrapper>
      </StyledContentLayout>
    </StyledLayout>
  );
};

// Styled Components
const StyledLayout = styled(Layout)`
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
`;

const StyledSider = styled(Sider)`
  position: fixed;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 100;
  background: #0f172a;
  overflow-y: auto;

  &.ant-layout-sider-collapsed {
    width: 80px !important;
  }
`;

const StyledContentLayout = styled(Layout)`
  margin-left: 200px;
  transition: margin-left 0.2s;

  @media (max-width: 991px) {
    margin-left: 80px;
  }

  @media (max-width: 576px) {
    margin-left: 0;
  }
`;

const LogoWrapper = styled.div`
  height: 64px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c8b6ff;
  font-size: 18px;
  font-weight: 600;
`;

const StyledHeader = styled(Header)`
  background: rgba(17, 24, 39, 0.9);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 99;
`;

const ContentWrapper = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  min-height: calc(100vh - 112px);
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
`;

export default Admin;
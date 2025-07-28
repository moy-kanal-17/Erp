import React, { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Typography, Button, Input, message } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, SettingOutlined, TeamOutlined, CalendarOutlined, MenuOutlined, SearchOutlined, BellOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

interface TeacherLayoutProps {
  children?: ReactNode;
  defaultSelectedKey: string;
}

const TeacherLayoutt: React.FC<TeacherLayoutProps> = ({ children, defaultSelectedKey }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Menu
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <HomeOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
    { key: 'groups', label: 'Groups', icon: <TeamOutlined /> },
    { key: 'events', label: 'Events', icon: <CalendarOutlined /> },
  ];

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    navigate('/login');
    message.success('✅ Logged out like a fucking legend!');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Sidebar */}
      <Sider
        width={sidebarCollapsed ? 80 : 200}
        collapsible
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        style={{ background: '#001529', boxShadow: '2px 0 6px rgba(0, 0, 0, 0.1)' }}
      >
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            background: '#002140',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 'bold' }}>
            {sidebarCollapsed ? '🎓' : '🎓 Teacher ERP'}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[defaultSelectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(`/teacher/${key}`)}
          style={{ borderRight: 'none' }}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
          }}
        >
          <div className="flex items-center gap-4">
            <Button type="text" icon={<MenuOutlined />} onClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              ACADEMIC YEAR: 2025
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Input placeholder="Search..." prefix={<SearchOutlined />} style={{ width: 200, borderRadius: 8 }} />
            <Button type="text" icon={<BellOutlined />} />
            <Dropdown overlay={userMenu}>
              <Avatar size="large" style={{ backgroundColor: '#1890ff', cursor: 'pointer' }} icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: '500px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          {children}
        </Content>

        <Footer
          style={{
            textAlign: 'center',
            background: '#fff',
            color: '#1f1f1f',
            borderTop: '1px solid #e8e8e8',
            padding: '16px',
          }}
        >
          Teacher ERP ©{new Date().getFullYear()} by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default TeacherLayoutt;
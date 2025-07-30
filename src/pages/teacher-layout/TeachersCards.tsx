import  { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Typography, Button, Input } from 'antd';
import { HomeOutlined, UserOutlined, SettingOutlined, MenuOutlined, SearchOutlined, BellOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

const TeacherPaneLayout = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <HomeOutlined /> },
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined /> }
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    navigate('/');
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
      <Sider
        width={sidebarCollapsed ? 80 : 256}
        collapsible
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        style={{ background: '#001529', boxShadow: '2px 0 6px rgba(0, 0, 0, 0.1)' }}
      >
        <div style={{ padding: '16px', textAlign: 'center', background: '#002140', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              🎓
            </div>
            {!sidebarCollapsed && (
              <Title level={4} style={{ color: '#fff', margin: 0, marginLeft: 12, fontWeight: 'bold' }}>
                Teacher ERP
              </Title>
            )}
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          onClick={({ key }) => navigate(`/teacher/${key}`)}
          style={{ borderRight: 'none' }}
        />
        <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Menu
            theme="dark"
            mode="inline"
            items={[{ key: 'logout', label: sidebarCollapsed ? '' : 'Logout', icon: <LogoutOutlined /> }]}
            onClick={handleLogout}
            style={{ borderRight: 'none' }}
          />
        </div>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)' }}>
          <div className="flex items-center gap-4">
            <Button type="text" icon={<MenuOutlined />} onClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              ACADEMIC YEAR: CBSE - 2021
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
        <Content style={{ margin: '24px 16px', padding: '24px', background: '#fff', borderRadius: '8px', minHeight: '500px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', background: '#fff', color: '#1f1f1f', borderTop: '1px solid #e8e8e8', padding: '16px' }}>
          Teacher ERP ©{new Date().getFullYear()} by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default TeacherPaneLayout;
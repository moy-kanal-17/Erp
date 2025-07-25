import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Layout, Menu, Table, Avatar, Dropdown, Typography, message } from 'antd';
import {

  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { userService } from '../../service/users.service';
import 'antd/dist/reset.css';
// import { useGroup } from '@hooks';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

// Тип для пользователя
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}


const TeacherSpisoks: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const {};pl
// p
  // Загрузка всех пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.geTeachers();

        console.log('kelgan res' ,res);
        
        setUsers(res?.data?.teachers); 
      } catch (err: unknown) {
        console.error('Ошибка загрузки:', err);
        setError(
          err instanceof Error && (err as any).response?.data?.message
            ? (err as any).response.data.message
            : 'Ошибка загрузки пользователей, попробуйте снова!'
        );
        message.error('❌ Ошибка загрузки пользователей!');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

 

  // Определение активного пункта меню
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/teacher') return 'dashboard';
    if (path.startsWith('/teacher/courses')) return 'courses';
    if (path.startsWith('/teacher/profile')) return 'profile';
    return 'dashboard';
  };

  // Обработчик логаута
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    navigate('/login');
    message.success('✅ Вы успешно вышли!');
  };

  // Дропдаун для пользователя
  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Выйти
      </Menu.Item>
    </Menu>
  );

  // Колонки для таблицы
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Имя', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Фамилия', dataIndex: 'last_name', key: 'last_name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Роль', dataIndex: 'role', key: 'role' }, // Добавляем роль
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Боковая панель */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ background: '#001529', boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)' }}
      >
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            background: '#002140',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Title
            level={4}
            style={{
              color: '#fff',
              margin: 0,
              fontWeight: 'bold',
              animation: 'pulse 2s infinite',
            }}
          >
            🎓 Учитель
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          style={{ borderRight: 'none' }}
        />
      </Sider>

      {/* Основной контент */}
      <Layout>
        {/* Хедер */}
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
          <Title level={4} style={{ margin: 0, color: '#1f1f1f' }}>
            Добро пожаловать, Админ!
          </Title>
          <Dropdown overlay={userMenu} trigger={['click']}>
            <span
              onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.transform = 'scale(1)')}
              style={{ display: 'inline-block', transition: 'all 0.3s' }}
            >
              <Avatar
                size="large"
                style={{
                  backgroundColor: '#1890ff',
                  cursor: 'pointer',
                }}
                icon={<UserOutlined />}
              />
            </span>
          </Dropdown>
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
          <div className="text_and_button flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">📋 Пользователи</h2>
          </div>
          {loading ? (
            <p>Загружается...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : users.length === 0 ? (
            <p>Пользователи не найдены</p>
          ) : (
            <Table
              dataSource={users}
              columns={columns}
              rowKey="id"
              bordered
              pagination={{ pageSize: 8 }}
              scroll={{ x: true }}
            />
          )}
          <Outlet />
        </Content>

        {/* Футер */}
        <Footer
          style={{
            textAlign: 'center',
            background: '#fff',
            color: '#1f1f1f',
            borderTop: '1px solid #e8e8e8',
            padding: '16px',
          }}
        >
          Панель Учителя ©{new Date().getFullYear()} by You
        </Footer>
      </Layout>
    </Layout>
  );
};

// Добавим CSS для анимации логотипа
const styles = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default TeacherSpisoks;
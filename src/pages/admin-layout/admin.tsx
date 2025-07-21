import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Layout, Menu, Select, Input, Button } from 'antd';
import {
  BookOutlined,
  HomeOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
  GlobalOutlined,
  CodeOutlined,
  BranchesOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { clearStorage } from '@helpers'; 

const { Header, Sider, Content } = Layout;

const Admin = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [projects, setProjects] = useState([]); 
  const [newProject, setNewProject] = useState('');
  const isMounted = useRef(true);


  const translations = useMemo(() => ({
    en: {
      dashboard: 'Dashboard',
      groups: 'Groups',
      students: 'Students',
      teachers: 'Teachers',
      courses: 'Courses',
      projects: 'Projects',
      logout: 'Logout',
      title: 'Admin Panel',
      addProject: 'Add Project',
      projectPlaceholder: 'Enter project name',
    },
    ru: {
      dashboard: 'Панель управления',
      groups: 'Группы',
      students: 'Студенты',
      teachers: 'Преподаватели',
      courses: 'Курсы',
      projects: 'Проекты',
      logout: 'Выход',
      title: 'Админ-панель',
      addProject: 'Добавить проект',
      projectPlaceholder: 'Введите название проекта',
    },
  }), []);

  const handleMenuClick = useCallback((e:any) => {
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
      case '7':
        clearStorage();
        navigate('/');
        break;

      case '8':
        navigate('/admin/branch');
        break;


      case '9':
        navigate('/admin/rooms');
        break;
      
      default:
        break;
    }
  }, [navigate]);


  const handleLanguageChange = useCallback((value:string) => {
    setLanguage(value);
  }, []);




  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
    return () => {
      isMounted.current = false;
    };
  }, [navigate]);

  return (
    <StyledLayout>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Sider breakpoint="lg" collapsedWidth="80" style={{ background: '#0f172a' }}>
          <LogoWrapper>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {language === 'en' ? 'Admin' : 'Админ'}
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
                label: translations[language].dashboard,
              },
              {
                key: '2',
                icon: <TeamOutlined />,
                label: translations[language].groups,
              },
              {
                key: '3',
                icon: <UserOutlined />,
                label: translations[language].students,
              },
              {
                key: '4',
                icon: <UserOutlined />,
                label: translations[language].teachers,
              },
              {
                key: '5',
                icon: <BookOutlined />,
                label: translations[language].courses,
              },
              {
                key: '6',
                icon: <CodeOutlined />,
                label: translations[language].projects,
              },

                            {
                key: '8',
                icon: <BranchesOutlined />,
                label: "Branchs",
              },


                                          {
                key: '9',
                icon: <ReadOutlined />,
                label: "Rooms",
              },

              {
                key: '7',
                icon: <LogoutOutlined />,
                label: translations[language].logout,
              },
            ]}
          />
        </Sider>
      </motion.div>
      <Layout>
        <StyledHeader>
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ margin: 0 }}
          >
            {translations[language].title}
          </motion.h2>
          <Select
            value={language}
            onChange={handleLanguageChange}
            style={{ width: 120 }}
            options={[
              { value: 'en', label: 'English' },
              { value: 'ru', label: 'Русский' },
            ]}
          />
        </StyledHeader>
        <ContentWrapper>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
              <Outlet />
          </motion.div>
        </ContentWrapper>
      </Layout>
    </StyledLayout>
  );
};

// Стили
const StyledLayout = styled(Layout)`
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  min-height: 100vh;
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
`;

const ContentWrapper = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  min-height: 360px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
`;

// const ProjectSection = styled.div`
//   h3 {
//     font-size: 1.6rem;
//     font-weight: 600;
//     margin-bottom: 1rem;
//     color: #d1c2ff;
//   }

//   p {
//     color: #9ca3af;
//     font-size: 1rem;
//   }
// `;

// const ProjectForm = styled.div`
//   display: flex;
//   gap: 1rem;
//   margin-bottom: 2rem;

//   input {
//     border-radius: 0.75rem;
//     border: 1px solid #374151;
//     background: rgba(31, 41, 55, 0.9);
//     padding: 0.75rem;
//     color: #f3f4f6;
//     font-size: 1rem;
//     transition: all 0.3s ease;
//   }

//   input:focus {
//     border-color: #9a79ff;
//     box-shadow: 0 0 10px rgba(154, 121, 255, 0.3);
//     outline: none;
//   }

//   button {
//     border-radius: 0.75rem;
//   }
// `;

// const ProjectList = styled.ul`
//   list-style: none;
//   padding: 0;
//   display: grid;
//   gap: 1rem;

//   li {
//     padding: 1rem;
//     background: rgba(55, 65, 81, 0.7);
//     border-radius: 0.75rem;
//     color: #f3f4f6;
//     transition: all 0.3s ease;
//   }

//   li:hover {
//     background: rgba(55, 65, 81, 0.9);
//     box-shadow: 0 0 15px rgba(154, 121, 255, 0.3);
//   }
// `;

export default Admin;
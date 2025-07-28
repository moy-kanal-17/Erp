import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Table, Avatar, Dropdown, Typography, Button, Modal, Form, Input, message, Select, Tabs, Card, Statistic } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, SettingOutlined, TeamOutlined, CalendarOutlined, MenuOutlined, SearchOutlined, BellOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { useGroupTeachers } from '@hooks';
import type { ParamsType } from '@types';
import 'antd/dist/reset.css';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Types
interface GroupTeacher {
  id: number;
  group: { id: number; name: string };
  teacher: { id: number; first_name: string; last_name: string };
  status: boolean;
  start_date: string;
  end_date: string;
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroupTeacher, setEditingGroupTeacher] = useState<GroupTeacher | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('Activity');

  // Hook
  const params: ParamsType = { page: 1, limit: 20 };
  const { data: groupTeachers, useGroupTeacherCreate, useGroupTeacherUpdate, useGroupTeacherDelete, useGroupTeacherActivate, useGroupTeacherDeactivate } = useGroupTeachers(params);
  const { mutate: createGroupTeacher } = useGroupTeacherCreate();
  const { mutate: updateGroupTeacher } = useGroupTeacherUpdate();
  const { mutate: deleteGroupTeacher } = useGroupTeacherDelete();
  const { mutate: activateGroupTeacher } = useGroupTeacherActivate();
  const { mutate: deactivateGroupTeacher } = useGroupTeacherDeactivate();

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
    message.success('✅ Logged out like a boss!');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  // Modal for group assignment
  const showModal = (groupTeacher?: GroupTeacher) => {
    if (groupTeacher) {
      setEditingGroupTeacher(groupTeacher);
      form.setFieldsValue({
        group: groupTeacher.group.id,
        teacher: groupTeacher.teacher.id,
        start_date: groupTeacher.start_date,
        end_date: groupTeacher.end_date,
      });
    } else {
      setEditingGroupTeacher(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingGroupTeacher) {
        await updateGroupTeacher({ id: editingGroupTeacher.id, data: values });
        message.success('🎉 Assignment updated like a pro!');
      } else {
        await createGroupTeacher(values);
        message.success('🚀 Teacher assigned to group, full speed ahead!');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('😡 Something went wrong, try again!');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete this assignment?',
      content: 'No going back, think fast!',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteGroupTeacher(id);
          message.success('🗑 Assignment trashed!');
        } catch (error) {
          message.error('😵 Couldn’t delete, something’s off!');
        }
      },
    });
  };

  const handleToggleStatus = (id: number, status: boolean) => {
    Modal.confirm({
      title: status ? 'Deactivate assignment?' : 'Activate assignment?',
      content: 'You sure about this?',
      okText: status ? 'Deactivate' : 'Activate',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          if (status) {
            await deactivateGroupTeacher(id);
            message.success('🛑 Assignment deactivated!');
          } else {
            await activateGroupTeacher(id);
            message.success('✅ Assignment activated, let’s roll!');
          }
        } catch (error) {
          message.error('😵 Status change failed, try again!');
        }
      },
    });
  };

  // Stats
  const stats = [
    { title: 'Total Assignments', value: groupTeachers?.length || 0, icon: <TeamOutlined /> },
    { title: 'Active Assignments', value: groupTeachers?.filter((gt: GroupTeacher) => gt.status).length || 0, icon: <CalendarOutlined /> },
  ];

  // Activity chart (mock data, replace with real API if available)
  const activityData = [
    { date: '2025-01-01', appointments: 5 },
    { date: '2025-01-02', appointments: 3 },
    { date: '2025-01-03', appointments: 7 },
    { date: '2025-01-04', appointments: 4 },
    { date: '2025-01-05', appointments: 6 },
  ];

  const activityConfig = {
    data: activityData,
    xField: 'date',
    yField: 'appointments',
    color: '#1890ff',
    height: 200,
  };

  // Table columns
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      render: (group: GroupTeacher['group']) => group.name || group.id,
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher: GroupTeacher['teacher']) => `${teacher.first_name} ${teacher.last_name}` || teacher.id,
    },
    { title: 'Start Date', dataIndex: 'start_date', key: 'start_date' },
    { title: 'End Date', dataIndex: 'end_date', key: 'end_date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (status ? 'Active' : 'Inactive'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: GroupTeacher) => (
        <div>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
          <Button type="link" onClick={() => handleToggleStatus(record.id, record.status)}>
            {record.status ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ];

  // Mock groups and teachers for form (replace with real API data if available)
  const mockGroups = [
    { id: 1, name: 'Group A' },
    { id: 2, name: 'Group B' },
    { id: 3, name: 'Group C' },
  ];

  const mockTeachers = [
    { id: 1, first_name: 'John', last_name: 'Doe' },
    { id: 2, first_name: 'Peter', last_name: 'Smith' },
    { id: 3, first_name: 'Mary', last_name: 'Johnson' },
  ];

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
          defaultSelectedKeys={['dashboard']}
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
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {stats.map((stat, index) => (
              <Card key={index}>
                <Statistic title={stat.title} value={stat.value} prefix={stat.icon} />
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Activity" key="Activity">
              <Card title="Assignment Activity" style={{ marginBottom: 24 }}>
                <Line {...activityConfig} />
              </Card>
              <Card title="Group-Teacher Assignments">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Title level={4}>Assignments</Title>
                  <Button type="primary" onClick={() => showModal()}>
                    Assign Teacher to Group
                  </Button>
                </div>
                {groupTeachers?.length === 0 ? (
                  <p>No assignments found</p>
                ) : (
                  <Table
                    dataSource={groupTeachers}
                    columns={columns}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true }}
                  />
                )}
              </Card>
            </TabPane>
          </Tabs>

          {/* Modal for group assignment */}
          <Modal
            title={editingGroupTeacher ? 'Edit Assignment' : 'Assign Teacher to Group'}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            width={600}
          >
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item
                name="group"
                label="Group"
                rules={[{ required: true, message: 'Select a group!' }]}
              >
                <Select size="large">
                  {mockGroups.map((group) => (
                    <Option key={group.id} value={group.id}>
                      {group.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="teacher"
                label="Teacher"
                rules={[{ required: true, message: 'Select a teacher!' }]}
              >
                <Select size="large">
                  {mockTeachers.map((teacher) => (
                    <Option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="start_date"
                label="Start Date"
                rules={[{ required: true, message: 'Enter start date!' }]}
              >
                <Input type="date" size="large" />
              </Form.Item>
              <Form.Item
                name="end_date"
                label="End Date"
                rules={[{ required: true, message: 'Enter end date!' }]}
              >
                <Input type="date" size="large" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                >
                  {editingGroupTeacher ? 'Update' : 'Assign'}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
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
          Teacher Dashboard ©{new Date().getFullYear()} by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default TeacherDashboard;
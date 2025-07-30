import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Card, Table, Avatar, Dropdown, Typography, Button, Modal, Form, Input, Select } from 'antd';
import { HomeOutlined, UserOutlined, SettingOutlined, MenuOutlined, SearchOutlined, BellOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;
const { Option } = Select;

interface GroupTeacher {
  id: number;
  group: { id: number; name: string };
  teacher: { id: number; first_name: string; last_name: string };
  status: boolean;
  start_date: string;
  end_date: string;
}

const SettingsPage = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroupTeacher, setEditingGroupTeacher] = useState<GroupTeacher | null>(null);
  const [form] = Form.useForm();

  const groupTeachers: GroupTeacher[] = [
    { id: 1, group: { id: 1, name: 'Group A' }, teacher: { id: 1, first_name: 'John', last_name: 'Doe' }, status: true, start_date: '2021-03-01', end_date: '2021-12-31' },
    { id: 2, group: { id: 2, name: 'Group B' }, teacher: { id: 2, first_name: 'Peter', last_name: 'Smith' }, status: false, start_date: '2021-04-01', end_date: '2021-11-30' }
  ];

  const mockGroups = [
    { id: 1, name: 'Group A' },
    { id: 2, name: 'Group B' },
    { id: 3, name: 'Group C' }
  ];

  const mockTeachers = [
    { id: 1, first_name: 'John', last_name: 'Doe' },
    { id: 2, first_name: 'Peter', last_name: 'Smith' },
    { id: 3, first_name: 'Mary', last_name: 'Johnson' }
  ];

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <HomeOutlined /> },
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined /> }
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const showModal = (groupTeacher?: GroupTeacher) => {
    if (groupTeacher) {
      setEditingGroupTeacher(groupTeacher);
      form.setFieldsValue({
        group: groupTeacher.group.id,
        teacher: groupTeacher.teacher.id,
        start_date: groupTeacher.start_date,
        end_date: groupTeacher.end_date
      });
    } else {
      setEditingGroupTeacher(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    setIsModalOpen(false);
    console.log(values);

    form.resetFields();
  };

  const handleDelete = (id: number) => {
    console.log(id);
    
    Modal.confirm({
      title: 'Delete this assignment?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {}
    });
  };

  const handleToggleStatus = (id: number, status: boolean) => {
    console.log(id);
    Modal.confirm({

      title: status ? 'Deactivate assignment?' : 'Activate assignment?',
      content: 'Are you sure?',
      okText: status ? 'Deactivate' : 'Activate',
      cancelText: 'Cancel',
      onOk: () => {}
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      render: (group: GroupTeacher['group']) => group.name || group.id
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher: GroupTeacher['teacher']) => `${teacher.first_name} ${teacher.last_name}` || teacher.id
    },
    { title: 'Start Date', dataIndex: 'start_date', key: 'start_date' },
    { title: 'End Date', dataIndex: 'end_date', key: 'end_date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (status ? 'Active' : 'Inactive')
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
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Sider
        width={sidebarCollapsed ? 80 : 200}
        collapsible
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        style={{ background: '#001529', boxShadow: '2px 0 6px rgba(0, 0, 0, 0.1)' }}
      >
        <div style={{ padding: '16px', textAlign: 'center', background: '#000000ff', borderBottom: '1px solid rgba(230, 220, 220, 0.1)' }}>
          <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 'bold' }}>
            {sidebarCollapsed ? '🎓' : '🎓 Teacher ERP'}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['settings']}
          items={menuItems}
          onClick={({ key }) => navigate(`/teacher/${key}`)}
          style={{ borderRight: 'none' }}
        />
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
          <Card title="Manage Group-Teacher Assignments">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Title level={4}>Assignments</Title>
              <Button type="primary" onClick={() => showModal()}>
                Assign Teacher to Group
              </Button>
            </div>
            {groupTeachers.length === 0 ? (
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
          <Modal
            title={editingGroupTeacher ? 'Edit Assignment' : 'Assign Teacher to Group'}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            width={600}
          >
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item name="group" label="Group" rules={[{ required: true, message: 'Select a group!' }]}>
                <Select size="large">
                  {mockGroups.map((group) => (
                    <Option key={group.id} value={group.id}>
                      {group.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="teacher" label="Teacher" rules={[{ required: true, message: 'Select a teacher!' }]}>
                <Select size="large">
                  {mockTeachers.map((teacher) => (
                    <Option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="start_date" label="Start Date" rules={[{ required: true, message: 'Enter start date!' }]}>
                <Input type="date" size="large" />
              </Form.Item>
              <Form.Item name="end_date" label="End Date" rules={[{ required: true, message: 'Enter end date!' }]}>
                <Input type="date" size="large" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  {editingGroupTeacher ? 'Update' : 'Assign'}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
        <Footer style={{ textAlign: 'center', background: '#fff', color: '#1f1f1f', borderTop: '1px solid #e8e8e8', padding: '16px' }}>
          Settings ©{new Date().getFullYear()} by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default SettingsPage;
import React, { useState, useEffect } from 'react';
import {
  Layout, Table, Typography, message, Modal, Button, Form, Input, Select,
  Card, Space, Avatar, Tag, Skeleton, Empty, Tooltip, Divider, Row, Col
} from 'antd';
import {
  PlusOutlined, EditOutlined, UserOutlined, PhoneOutlined, 
  MailOutlined, TeamOutlined,  EyeOutlined
} from '@ant-design/icons';

import { teacherService } from '@service';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const TeacherLayout: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await teacherService.getTeacher({ page: 1, limit: 50 });
      setUsers(res?.data.data || []);
      console.log(res?.data.data, "---teachers");
    } catch (err) {
      setError('Xatolik yuz berdi!');
      message.error('❌ Yuklashda xatolik!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showModal = (record: any = null) => {
    setEditingUser(record);
    setModalVisible(true);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  const showViewModal = (record: any) => {
    setViewingUser(record);
    setViewModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      if (!editingUser) {
        values.branchId = [5];
      }

      if (editingUser) {
        delete values.password;
        await teacherService.updateTeacher(editingUser.id, values);
        message.success("🔄 O'qituvchi tahrirlandi!");
      } else {
        await teacherService.createTeacher(values);
        message.success("✅ O'qituvchi qo'shildi!");
      }

      setModalVisible(false);
      fetchUsers();
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error("❌ Saqlashda xatolik yuz berdi.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'red';
      case 'main teacher': return 'blue';
      case 'teacher': return 'green';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '👑';
      case 'main teacher': return '🎓';
      case 'teacher': return '👨‍🏫';
      default: return '👤';
    }
  };

  const columns = [
    {
      title: 'O\'qituvchi',
      key: 'teacher',
      render: (_: any, record: any) => (
        <Space>
          <Avatar 
            size={40} 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: '#f56a00',
              fontSize: '16px'
            }}
          >
            {record.first_name?.[0]?.toUpperCase()}
          </Avatar>
          <div>
            <Text strong>{record.first_name} {record.last_name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {record.id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Aloqa ma\'lumotlari',
      key: 'contact',
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small">
          <Space size="small">
            <PhoneOutlined style={{ color: '#52c41a' }} />
            <Text>{record.phone}</Text>
          </Space>
          <Space size="small">
            <MailOutlined style={{ color: '#1890ff' }} />
            <Text>{record.email}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Roli',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag 
          color={getRoleColor(role)} 
          style={{ fontSize: '12px', padding: '4px 8px' }}
        >
          {getRoleIcon(role)} {role}
        </Tag>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Ko'rish">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => showViewModal(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Tahrirlash">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => showModal(record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const SkeletonTable = () => (
    <Card>
      {[...Array(5)].map((_, index) => (
        <div key={index} style={{ marginBottom: 16 }}>
          <Skeleton avatar paragraph={{ rows: 2 }} active />
          {index < 4 && <Divider />}
        </div>
      ))}
    </Card>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ margin: '24px', minHeight: 'calc(100vh - 134px)' }}>
        <Card 
          style={{ 
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: 24
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space align="center">
                <TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <Title level={3} style={{ margin: 0 }}>
                  O'qituvchilar boshqaruvi
                </Title>
              </Space>
              <Text type="secondary">
                Jami: {users.length} ta o'qituvchi
              </Text>
            </Col>
            <Col>
              <Button 
                type="primary" 
                size="large"
                icon={<PlusOutlined />} 
                onClick={() => showModal()}
                style={{ 
                  borderRadius: 8,
                  height: 44,
                  fontSize: '16px'
                }}
              >
                Yangi o'qituvchi qo'shish
              </Button>
            </Col>
          </Row>
        </Card>

        <Card 
          style={{ 
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {loading ? (
            <SkeletonTable />
          ) : error ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span style={{ color: '#ff4d4f' }}>
                  {error}
                </span>
              }
            >
              <Button type="primary" onClick={fetchUsers}>
                Qayta yuklash
              </Button>
            </Empty>
          ) : (
            <Table 
              columns={columns} 
              dataSource={users} 
              rowKey="id" 
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} / ${total} ta`
              }}
              style={{ borderRadius: 8 }}
            />
          )}
        </Card>
      </Content>

      <Footer style={{ 
        textAlign: 'center', 
        background: '#fff',
        borderTop: '1px solid #f0f0f0'
      }}>
        <Text type="secondary">
          Teacher Management System ©{new Date().getFullYear()} - Barcha huquqlar himoyalangan
        </Text>
      </Footer>

      {/* Add/Edit Modal */}
      <Modal
        open={modalVisible}
        title={
          <Space>
            <UserOutlined />
            {editingUser ? 'O\'qituvchini tahrirlash' : 'Yangi o\'qituvchi qo\'shish'}
          </Space>
        }
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText="Saqlash"
        cancelText="Bekor qilish"
        confirmLoading={submitting}
        width={600}
        style={{ top: 20 }}
      >
        <Divider />
        <Form form={form} layout="vertical" size="large">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="first_name" 
                label="Ism" 
                rules={[{ required: true, message: 'Ism kiritish majburiy!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Ismni kiriting" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="last_name" 
                label="Familiya" 
                rules={[{ required: true, message: 'Familiya kiritish majburiy!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Familiyani kiriting" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="phone" 
                label="Telefon" 
                rules={[{ required: true, message: 'Telefon raqam kiritish majburiy!' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="+998 90 123 45 67" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="email" 
                label="Email" 
                rules={[
                  { required: true, message: 'Email kiritish majburiy!' },
                  { type: 'email', message: 'Noto\'g\'ri email format!' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="example@gmail.com" />
              </Form.Item>
            </Col>
          </Row>

          {!editingUser && (
            <Form.Item 
              name="password" 
              label="Parol" 
              rules={[{ required: true, message: 'Parol kiritish majburiy!' }]}
            >
              <Input.Password placeholder="Parolni kiriting" />
            </Form.Item>
          )}

          <Form.Item 
            name="role" 
            label="Roli" 
            rules={[{ required: true, message: 'Rol tanlash majburiy!' }]}
          >
            <Select placeholder="Rolni tanlang" size="large">
              <Select.Option value="teacher">
                <Space>
                  👨‍🏫 O'qituvchi
                </Space>
              </Select.Option>
              <Select.Option value="admin">
                <Space>
                  👑 Admin
                </Space>
              </Select.Option>
              <Select.Option value="main teacher">
                <Space>
                  🎓 Bosh o'qituvchi
                </Space>
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        open={viewModalVisible}
        title={
          <Space>
            <EyeOutlined />
            O'qituvchi ma'lumotlari
          </Space>
        }
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="edit" type="primary" onClick={() => {
            setViewModalVisible(false);
            showModal(viewingUser);
          }}>
            Tahrirlash
          </Button>,
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Yopish
          </Button>
        ]}
        width={500}
      >
        {viewingUser && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                icon={<UserOutlined />}
                style={{ 
                  backgroundColor: '#f56a00',
                  fontSize: '32px',
                  marginBottom: 16
                }}
              >
                {viewingUser.first_name?.[0]?.toUpperCase()}
              </Avatar>
              <Title level={4} style={{ margin: '8px 0 4px 0' }}>
                {viewingUser.first_name} {viewingUser.last_name}
              </Title>
              <Tag color={getRoleColor(viewingUser.role)} style={{ fontSize: '14px' }}>
                {getRoleIcon(viewingUser.role)} {viewingUser.role}
              </Tag>
            </div>

            <Divider />

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>ID: </Text>
                <Text>{viewingUser.id}</Text>
              </div>
              <div>
                <Text strong>Telefon: </Text>
                <Text>{viewingUser.phone}</Text>
              </div>
              <div>
                <Text strong>Email: </Text>
                <Text>{viewingUser.email}</Text>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default TeacherLayout;
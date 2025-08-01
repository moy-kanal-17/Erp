import React, { useState, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import {
  Layout, Table, Typography, message, Modal, Button, Form, Input, Select,
  Card, Space, Avatar, Tag, Skeleton, Empty, Tooltip, Divider, Row, Col
} from 'antd';
import {
  PlusOutlined, EditOutlined, UserOutlined, PhoneOutlined,
  MailOutlined, TeamOutlined, EyeOutlined,
  // DeleteFilled,
  DeleteOutlined
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
  const [viewingUser] = useState<any>(null);
  const [form] = Form.useForm();

  const formatPhoneForDisplay = (phone: string) => {
    if (!phone) return '';
    // Преобразование 998999999999 -> +998 (99) 999-99-99
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('998')) {
      return `+${cleanPhone.slice(0, 3)} (${cleanPhone.slice(3, 5)}) ${cleanPhone.slice(5, 8)}-${cleanPhone.slice(8, 10)}-${cleanPhone.slice(10, 12)}`;
    }
    return phone;
  };

  const formatPhoneForAPI = (phone: string) => {
    // Преобразование +998 (99) 999-99-99 -> 998999999999
    return phone
  };

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
      form.setFieldsValue({
        ...record,
        phone: formatPhoneForDisplay(record.phone),
      });
    } else {
      form.resetFields();
    }
  };

  // const showViewModal = (record: any) => {
  //   console.log("record", record);
    
  //   setViewingUser(record);
  //   setViewModalVisible(true);
  // };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        phone: formatPhoneForAPI(values.phone),
      };

      if (!editingUser) {
        formattedValues.branchId = [5];
      }

      if (editingUser) {
        delete formattedValues.password;
        await teacherService.updateTeacher(editingUser.id, formattedValues);
        message.success("🔄 O'qituvchi tahrirlandi!");
      } else {
        await teacherService.createTeacher(formattedValues);
        message.success("✅ O'qituvchi qo'shildi!");
      }

      // const deleteUser=async (id:number) => {
      //   try {
      //     await teacherService.deleteTeacher(id);
      //     message.success("✅ O'qituvchi o'chirildi!");
      //     fetchUsers();
      //   } catch (err) {
      //     console.error(err);
      //     message.error("❌ O'chirishda xatolik yuz berdi.");
      //   }
      // }
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

  const TeacherAvatar = ({ user, size = 40 }: any) => {
    const [imageError, setImageError] = useState(false);

    if (user.avatar_url && !imageError) {
      const avatarSrc = `${user.avatar_url}`;
      return (
        <Avatar
          size={size}
          src={avatarSrc}
          onError={() => {
            setImageError(true);
            return false;
          }}
          style={{ border: '2px solid #f0f0f0' }}
        />
      );
    }

    return (
      <Avatar
        size={size}
        icon={user.first_name ? undefined : <UserOutlined />}
        style={{ backgroundColor: '#f56a00', fontSize: size > 50 ? '32px' : '16px' }}
      >
        {user.first_name?.[0]?.toUpperCase()}
      </Avatar>
    );
  };

  const columns = [
    {
      title: "Teacher's",
      key: 'teacher',
      render: (_: any, record: any) => (
        <Space>
          <TeacherAvatar user={record} size={40} />
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
      title: 'Contact information',
      key: 'contact',
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small">
          <Space size="small">
            <PhoneOutlined style={{ color: '#52c41a' }} />
            <Text>{formatPhoneForDisplay(record.phone)}</Text>
          </Space>
          <Space size="small">
            <MailOutlined style={{ color: '#1890ff' }} />
            <Text>{record.email}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Role',
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
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => deleteUser(record.id)}
              style={{ color: '#df0000ff' }}
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
            marginBottom: 24,
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space align="center">
                <TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <Title level={3} style={{ margin: 0 }}>
                  Teachers
                </Title>
              </Space>
              <br />
              <Text type="secondary">
                Total: {users.length} teachers
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
                  fontSize: '16px',
                }}
              >
                Add a new teacher
              </Button>
            </Col>
          </Row>
        </Card>

        <Card
          style={{
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
                  `${range[0]}-${range[1]} / ${total} ta`,
              }}
              style={{ borderRadius: 8 }}
            />
          )}
        </Card>
      </Content>

      <Footer
        style={{
          textAlign: 'center',
          background: '#fff',
          borderTop: '1px solid #f0f0f0',
        }}
      >
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
            {editingUser ? "Edit Teacher" : "add a new Teacher "}
          </Space>
        }
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText="Save"
        cancelText="close"
        confirmLoading={submitting}
        width={600}
        style={{ top: 20 }}
      >
        <Divider />
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="Ism"
                rules={[{ required: true, message: "Ismni kiriting!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Ismni kiriting" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Familiya"
                rules={[{ required: true, message: "Familiyani kiriting!" }]}
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
                rules={[
                  { required: true, message: "Telefon raqamni kiriting!" },

                ]}
              >
                <IMaskInput
                  mask="+998 (00) 000-00-00"
                  definitions={{
                    '0': /[0-9]/,
                  }}
                  unmask={true}
                  inputMode="tel"
                  type="tel"
                  placeholder="+998 (99) 999-99-99"
                  onAccept={(value: string) => form.setFieldsValue({ phone: value })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Emailni kiriting!" },
                  { type: 'email', message: "To'g'ri email kiriting!" },
                ]}
              >
                <Input prefix={<MailOutlined style={{ color: '#1890ff' }} />} placeholder="example@gmail.com" />
              </Form.Item>
            </Col>
          </Row>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Parol"
              rules={[{ required: true, message: "Parolni kiriting!" }]}
            >
              <Input.Password placeholder="Parolni kiriting" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Roli"
            rules={[{ required: true, message: "Rolni tanlang!" }]}
          >
            <Select placeholder="Rolni tanlang" size="large" style={{ width: '100%' }}>
              <Select.Option value="main teacher">
                <Space>
                  🎓 Main Teacher
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
            Teacher information
          </Space>
        }
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setViewModalVisible(false);
              showModal(viewingUser);
            }}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            Edit
          </Button>,
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={500}
      >
        {viewingUser && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <TeacherAvatar user={viewingUser} size={80} />
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
                <Text>{formatPhoneForDisplay(viewingUser.phone)}</Text>
              </div>
              <div>
                <Text strong>Email: </Text>
                <Text>{viewingUser.email}</Text>
              </div>


                <div>
                <Text strong>Password: </Text>
                <Text>{viewingUser.password}</Text>
              </div>

                              <div>
                <Text strong>branches: </Text>
                <Text>{viewingUser.branchId}</Text>
              </div>

              <div>
                <Text strong>avatar_url: </Text>
                <Text>{viewingUser.avatar_url}</Text>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default TeacherLayout;

function deleteUser(id: number): void {
  console.log(id);
  teacherService.deleteTeacher(id)
    .then(() => {
      message.success("✅ O'qituvchi o'chirildi!");;
    })
    .catch((err) => {
      console.error(err);
      message.error("❌ O'chirishda xatolik yuz berdi.");
    });
  
}

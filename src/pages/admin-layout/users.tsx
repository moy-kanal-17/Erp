import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, message, Card, Space, Typography,
  Row, Col, Avatar, Tag, Skeleton, Empty, Tooltip, Divider, Statistic,
  Badge, Select, DatePicker
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined,
  PhoneOutlined, MailOutlined, TeamOutlined, EyeOutlined,
  ManOutlined, WomanOutlined, CalendarOutlined
} from '@ant-design/icons';
import { userService } from '../../service/users.service';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
}

const Student: React.FC = () => {
  const [users, setUsers] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingStudent, 
    // setViewingStudent
  ] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getStudents();
      console.log(res, "response");
      setUsers(res || []);
    } catch {
      message.error('❌ O\'quvchilarni olishda xatolik!');
    } finally {
      setLoading(false);
    }
  };

  // const showViewModal = (student: Student) => {
  //   setViewingStudent(student);
  //   setViewModalOpen(true);
  // };

  const openModal = (user: Student | null = null) => {
    setEditingId(user?.id || null);
    if (user) {
      form.setFieldsValue({
        ...user,
        date_of_birth: user.date_of_birth ? dayjs(user.date_of_birth) : null
      });
      form.setFieldsValue({ password_hash: '', confirm_password: '' });
    } else {
      form.resetFields();
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      
      const payload: any = {
        ...values,
        date_of_birth: values.date_of_birth ? dayjs(values.date_of_birth).format('YYYY-MM-DD') : null,
        lidId: null,
        eventsId: null,
      };

      if (editingId) {
        delete payload.password_hash;
        delete payload.confirm_password;
        delete payload.groupsId;
      } else {
        payload.password_hash = values.password_hash;
        payload.confirm_password = values.confirm_password;
      }
      
      console.log("Payload sent:", payload);

      if (editingId) {
        await userService.updateUser(editingId, payload);
        message.success('✅ O\'quvchi ma\'lumotlari yangilandi');
      } else {
        await userService.postUser(payload);
        message.success('✅ Yangi o\'quvchi qo\'shildi');
      }

      setModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (error: any) {
      console.error("Error during form submission:", error);
      message.error(error?.errorFields?.[0]?.errors?.[0] || '❌ Saqlashda xatolik yuz berdi!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (student: Student) => {
    Modal.confirm({
      title: 'O\'quvchini o\'chirish',
      content: `"${student.first_name} ${student.last_name}" o'quvchisini o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.`,
      okText: 'Ha, o\'chirish',
      cancelText: 'Bekor qilish',
      okType: 'danger',
      onOk: async () => {
        try {
          await userService.deleteUser(student.id);
          fetchUsers();
          message.success('✅ O\'quvchi o\'chirildi');
        } catch {
          message.error('❌ O\'chirishda xatolik!');
        }
      },
    });
  };

  const getGenderIcon = (gender: string) => {
    return gender?.toLowerCase() === 'erkak' || gender?.toLowerCase() === 'male' ? 
      <ManOutlined style={{ color: '#1890ff' }} /> : 
      <WomanOutlined style={{ color: '#eb2f96' }} />;
  };

  const getGenderColor = (gender: string) => {
    return gender?.toLowerCase() === 'erkak' || gender?.toLowerCase() === 'male' ? 'blue' : 'magenta';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Kiritilmagan';
    return dayjs(dateString).format('DD.MM.YYYY');
  };

  const getAge = (dateString: string) => {
    if (!dateString) return null;
    return dayjs().diff(dayjs(dateString), 'year');
  };

  const columns = [
    {
      title: 'Students',
      key: 'student',
      render: (_: any, record: Student) => (
        <Space>
          <Avatar 
            size={48} 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: getGenderColor(record.gender) === 'blue' ? '#1890ff' : '#eb2f96',
              fontSize: '20px'
            }}
          >
            {record.first_name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: '16px' }}>
              {record.first_name} {record.last_name}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {record.id}
            </Text>
            <br />
            <Tag color={getGenderColor(record.gender)} style={{ fontSize: '11px' }}>
              {getGenderIcon(record.gender)} {record.gender}
            </Tag>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contact Information',
      key: 'contact',
      render: (_: any, record: Student) => (
        <Space direction="vertical" size="small">
          <Space size="small">
            <MailOutlined style={{ color: '#1890ff' }} />
            <Text>{record.email}</Text>
          </Space>
          <Space size="small">
            <PhoneOutlined style={{ color: '#52c41a' }} />
            <Text>{record.phone}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Date of birth',
      key: 'birth',
      render: (_: any, record: Student) => {
        const age = getAge(record.date_of_birth);
        return (
          <Space direction="vertical" size="small">
            <Space size="small">
              <CalendarOutlined style={{ color: '#faad14' }} />
              <Text>{formatDate(record.date_of_birth)}</Text>
            </Space>
            {age && (
              <Badge 
                count={`${age} yosh`} 
                style={{ backgroundColor: '#52c41a' }}
              />
            )}
          </Space>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Student) => (
        <Space>

          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => openModal(record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="Faxriddinov abduqodir">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record)}
              style={{ color: '#f5222d' }}
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
          <Skeleton avatar paragraph={{ rows: 3 }} active />
          {index < 4 && <Divider />}
        </div>
      ))}
    </Card>
  );

  const getGenderStats = () => {
    const maleCount = users.filter(u => 
      u.gender?.toLowerCase() === 'erkak' || u.gender?.toLowerCase() === 'male'
    ).length;
    const femaleCount = users.length - maleCount;
    return { maleCount, femaleCount };
  };

  const getAverageAge = () => {
    const ages = users
      .map(u => getAge(u.date_of_birth))
      .filter(age => age !== null) as number[];
    
    if (ages.length === 0) return 0;
    return Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length);
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header Card */}
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
              <TeamOutlined style={{ fontSize: 28, color: '#1890ff' }} />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  Student management
                </Title>
                
                <Text type="secondary">
                  Total: {users.length} readers
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />} 
              onClick={() => openModal()}
              style={{ 
                borderRadius: 8,
                height: 44,
                fontSize: '16px'
              }}
            >
             Add new student
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      {users.length > 0 && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={6}>
            <Card style={{ borderRadius: 8, textAlign: 'center' }}>
              <Statistic
                title="Total students"
                value={users.length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{ borderRadius: 8, textAlign: 'center' }}>
              <Statistic
                title="Men"
                value={getGenderStats().maleCount}
                prefix={<ManOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{ borderRadius: 8, textAlign: 'center' }}>
              <Statistic
                title="Women"
                value={getGenderStats().femaleCount}
                prefix={<WomanOutlined />}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{ borderRadius: 8, textAlign: 'center' }}>
              <Statistic
                title="O'rtacha yosh"
                value={getAverageAge()}
                suffix="yosh"
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Main Table Card */}
      <Card 
        style={{ 
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {loading ? (
          <SkeletonTable />
        ) : users.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Hozircha o'quvchilar yo'q"
          >
            <Button type="primary" onClick={() => openModal()}>
              Add the first student
            </Button>
          </Empty>
        ) : (
          <Table 
            dataSource={users} 
            columns={columns} 
            rowKey="id" 
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} / ${total} ta`
            }}
            scroll={{ x: true }}
            style={{ borderRadius: 8 }}
          />
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            {editingId ? 'Edit Student' : 'Add new student'}
          </Space>
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText="Saqlash"
        cancelText="Bekor qilish"
        confirmLoading={submitting}
        width={700}
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

          {!editingId && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password_hash"
                  label="Parol"
                  rules={[
                    { required: true, message: 'Parol kiritish majburiy!' },
                    { min: 8, message: 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak!' }
                  ]}
                >
                  <Input.Password placeholder="Parolni kiriting" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirm_password"
                  label="Parolni tasdiqlash"
                  dependencies={['password_hash']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Parolni tasdiqlash majburiy!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password_hash') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Kiritilgan parollar mos kelmadi!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Parolni qayta kiriting" />
                </Form.Item>
              </Col>
            </Row>
          )}

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
                name="gender" 
                label="Jinsi" 
                rules={[{ required: true, message: 'Jins tanlash majburiy!' }]}
              >
                <Select placeholder="Jinsni tanlang" size="large">
                  <Option value="male">
                    <Space>
                      <ManOutlined /> Erkak
                    </Space>
                  </Option>
                  <Option value="female">
                    <Space>
                      <WomanOutlined /> Ayol
                    </Space>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            name="date_of_birth" 
            label="Tug'ilgan sana" 
            rules={[{ required: true, message: 'Tug\'ilgan sana kiritish majburiy!' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD.MM.YYYY"
              placeholder="Sanani tanlang"
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        open={viewModalOpen}
        title={
          <Space>
            <EyeOutlined />
            O'quvchi ma'lumotlari
          </Space>
        }
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="edit" type="primary" onClick={() => {
            setViewModalOpen(false);
            openModal(viewingStudent);
          }}>
            Tahrirlash
          </Button>,
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            Yopish
          </Button>
        ]}
        width={500}
      >
        {viewingStudent && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                icon={<UserOutlined />}
                style={{ 
                  backgroundColor: getGenderColor(viewingStudent.gender) === 'blue' ? '#1890ff' : '#eb2f96',
                  fontSize: '32px',
                  marginBottom: 16
                }}
              >
                {viewingStudent.first_name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Title level={4} style={{ margin: '8px 0 4px 0' }}>
                {viewingStudent.first_name} {viewingStudent.last_name}
              </Title>
              <Tag color={getGenderColor(viewingStudent.gender)} style={{ fontSize: '14px' }}>
                {getGenderIcon(viewingStudent.gender)} {viewingStudent.gender}
              </Tag>
            </div>

            <Divider />

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Text type="secondary">ID</Text>
                    <br />
                    <Text strong style={{ fontSize: '18px' }}>
                      {viewingStudent.id}
                    </Text>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Text type="secondary">Yoshi</Text>
                    <br />
                    <Text strong style={{ fontSize: '18px' }}>
                      {getAge(viewingStudent.date_of_birth) || '?'} yosh
                    </Text>
                  </Card>
                </Col>
              </Row>

              <div>
                <Text strong>Email: </Text>
                <Text>{viewingStudent.email}</Text>
              </div>
              <div>
                <Text strong>Telefon: </Text>
                <Text>{viewingStudent.phone}</Text>
              </div>
              <div>
                <Text strong>Tug'ilgan sana: </Text>
                <Text>{formatDate(viewingStudent.date_of_birth)}</Text>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Student;
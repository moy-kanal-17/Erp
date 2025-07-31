import { useState, useCallback, useMemo } from 'react';
import {
  Button, Table, Modal, Form, Input, Card, Space, Typography, Select, 
  Row, Col, Avatar, Tag, Skeleton, Empty, Tooltip, Divider, Statistic,
  Badge, message
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, BookOutlined, 
  ClockCircleOutlined, CalendarOutlined, DollarOutlined,
  EyeOutlined, TeamOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../service/course.service';
// import { Notification } from '../../helpers';

const { Title, Text } = Typography;
const { Option } = Select;

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
  lessons_in_a_week: 3 | 5;
  lessons_in_a_month: 12 | 20;
  lesson_duration: 120 | 180 | 240 | 270;
}

const Courses = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const { data: response, isLoading, error } = useQuery<Course[]>({
    queryKey: ['courses', page, limit],
    queryFn: () => courseService.getCourses({ page, limit }),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Course, 'id'>) => courseService.createCourse(data),
    onSuccess: () => {
      message.success('🎉 Kurs muvaffaqiyatli yaratildi!');
      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      message.error('❌ Kurs yaratishda xatolik yuz berdi!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Course) => courseService.updateCourse(data.id, data),
    onSuccess: () => {
      message.success('🔄 Kurs muvaffaqiyatli yangilandi!');
      setIsModalOpen(false);
      setEditCourse(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      message.error('❌ Kurs yangilashda xatolik yuz berdi!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => courseService.deleteCourse(id),
    onSuccess: () => {
      message.success('🗑️ Kurs muvaffaqiyatli o\'chirildi!');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      message.error('❌ Kurs o\'chirishda xatolik yuz berdi!');
    },
  });

  const handleEdit = useCallback(
    (course: Course) => {
      setEditCourse(course);
      setIsModalOpen(true);
      form.setFieldsValue({
        title: course.title,
        description: course.description,
        price: course.price,
        duration: course.duration,
        lessons_in_a_week: course.lessons_in_a_week,
        lessons_in_a_month: course.lessons_in_a_month,
        lesson_duration: course.lesson_duration,
      });
    },
    [form],
  );

  const handleView = useCallback((course: Course) => {
    setViewingCourse(course);
    setViewModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (course: Course) => {
      Modal.confirm({
        title: 'Kursni o\'chirish',
        content: `"${course.title}" kursini o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.`,
        okText: 'Ha, o\'chirish',
        cancelText: 'Bekor qilish',
        okType: 'danger',
        onOk: () => deleteMutation.mutate(course.id),
      });
    },
    [deleteMutation],
  );

  const handleSubmit = useCallback(async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      
      // Convert string inputs to numbers
      const processedValues = {
        ...values,
        price: Number(values.price),
        duration: Number(values.duration)
      };
      
      if (editCourse) {
        updateMutation.mutate({ id: editCourse.id, ...processedValues });
      } else {
        createMutation.mutate(processedValues);
      }
    } catch (error) {
      message.error('Forma ma\'lumotlarini tekshiring!');
    } finally {
      setSubmitting(false);
    }
  }, [form, editCourse, createMutation, updateMutation]);

  const getPriceColor = (price: number) => {
    if (price < 50000) return 'green';
    if (price < 200000) return 'blue';
    if (price < 500000) return 'orange';
    return 'red';
  };

  const getDurationBadge = (duration: number) => {
    if (duration <= 30) return { color: 'green', text: 'Qisqa' };
    if (duration <= 90) return { color: 'blue', text: 'O\'rta' };
    return { color: 'purple', text: 'Uzun' };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const formatLessonDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}s ${mins}m` : `${mins}m`;
  };

  const columns = useMemo(
    () => [
      {
        title: 'Kurs',
        key: 'course',
        render: (_: any, record: Course) => (
          <Space>
            <Avatar 
              size={48} 
              icon={<BookOutlined />}
              style={{ 
                backgroundColor: '#1890ff',
                fontSize: '20px'
              }}
            >
              {record.title.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Text strong style={{ fontSize: '16px' }}>{record.title}</Text>
              <br />
              <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>
                {record.description}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                ID: {record.id}
              </Text>
            </div>
          </Space>
        ),
      },
      {
        title: 'Narx',
        key: 'price',
        render: (_: any, record: Course) => (
          <Space direction="vertical" size="small">
            <Text 
              strong 
              style={{ 
                color: getPriceColor(record.price),
                fontSize: '16px'
              }}
            >
              <DollarOutlined /> {formatPrice(record.price)}
            </Text>
          </Space>
        ),
      },
      {
        title: 'Davomiyligi',
        key: 'duration',
        render: (_: any, record: Course) => {
          const badge = getDurationBadge(record.duration);
          return (
            <Space direction="vertical" size="small">
              <Badge 
                color={badge.color} 
                text={`${record.duration} kun`}
              />
              <Tag color={badge.color} style={{ fontSize: '11px' }}>
                {badge.text}
              </Tag>
            </Space>
          );
        },
      },
      {
        title: 'Dars jadvali',
        key: 'schedule',
        render: (_: any, record: Course) => (
          <Space direction="vertical" size="small">
            <Space size="small">
              <CalendarOutlined style={{ color: '#52c41a' }} />
              <Text>{record.lessons_in_a_week} ta/hafta</Text>
            </Space>
            <Space size="small">
              <TeamOutlined style={{ color: '#1890ff' }} />
              <Text>{record.lessons_in_a_month} ta/oy</Text>
            </Space>
            <Space size="small">
              <ClockCircleOutlined style={{ color: '#faad14' }} />
              <Text>{formatLessonDuration(record.lesson_duration)}</Text>
            </Space>
          </Space>
        ),
      },
      {
        title: 'Amallar',
        key: 'actions',
        render: (_: any, record: Course) => (
          <Space>
            <Tooltip title="Ko'rish">
              <Button 
                type="text" 
                icon={<EyeOutlined />} 
                onClick={() => handleView(record)}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
            <Tooltip title="Tahrirlash">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => handleEdit(record)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
            <Tooltip title="O'chirish">
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
    ],
    [handleEdit, handleView, handleDelete],
  );

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
              <BookOutlined style={{ fontSize: 28, color: '#1890ff' }} />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  Course management
                </Title>
                <Text type="secondary">
                  Total: {response?.length || 0} courses
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />} 
              onClick={() => setIsModalOpen(true)}
              style={{ 
                borderRadius: 8,
                height: 44,
                fontSize: '16px'
              }}
            >
              Add a new course
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      {response && response.length > 0 && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: 8, textAlign: 'center' }}>
              <Statistic
                title="Total courses"
                value={response.length}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: 8, textAlign: 'center' }}>
              <Statistic
                title="Average price"
                value={response.reduce((sum, course) => sum + course.price, 0) / response.length}
                formatter={(value) => formatPrice(Number(value))}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: 8, textAlign: 'center' }}>
              <Statistic
                title="Average duration"
                value={Math.round(response.reduce((sum, course) => sum + course.duration, 0) / response.length)}
                suffix="kun"
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
        {isLoading ? (
          <SkeletonTable />
        ) : error ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: '#ff4d4f' }}>
                An error occurred while loading data. Please try again later.
              </span>
            }
          >
            <Button type="primary" onClick={() => queryClient.refetchQueries({ queryKey: ['courses'] })}>
              Refresh
            </Button>
          </Empty>
        ) : (
          <Table
            dataSource={response}
            columns={columns}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: limit,
              total: response?.length || 0,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} / ${total} ta`,
            }}
            onChange={(pagination) => {
              setPage(pagination.current || 1);
              setLimit(pagination.pageSize || 10);
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
            <BookOutlined />
            {editCourse ? 'Kursni tahrirlash' : 'Yangi kurs qo\'shish'}
          </Space>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditCourse(null);
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
            <Col span={24}>
              <Form.Item 
                name="title" 
                label="Kurs nomi" 
                rules={[{ required: true, message: 'Kurs nomini kiriting!' }]}
              >
                <Input 
                  prefix={<BookOutlined />} 
                  placeholder="Kurs nomini kiriting"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Kurs tavsifi"
            rules={[{ required: true, message: 'Kurs tavsifini kiriting!' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Kurs haqida batafsil ma'lumot..."
              style={{ resize: 'none' }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Narxi (so'm)"
                rules={[
                  { required: true, message: 'Narxni kiriting!' },

                ]}
              >
                <Input 
                  type="number" 
                  prefix={<DollarOutlined />}
                  placeholder="100000"

                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Davomiyligi (kun)"
                rules={[
                  { required: true, message: 'Davomiylikni kiriting!' },
                  { 
                    validator: (_, value) => {
                      if (value && Number(value) <= 0) {
                        return Promise.reject(new Error('Davomiyligi musbat son bo\'lishi kerak!'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input 
                  type="number" 
                  prefix={<CalendarOutlined />}
                  placeholder="90"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="lessons_in_a_week"
                label="Haftada darslar soni"
                rules={[{ required: true, message: 'Haftada darslar sonini tanlang!' }]}
              >
                <Select placeholder="Tanlang" size="large">
                  <Option value={3}>
                    <Space>
                      <CalendarOutlined /> 3 ta dars
                    </Space>
                  </Option>
                  <Option value={5}>
                    <Space>
                      <CalendarOutlined /> 5 ta dars
                    </Space>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lessons_in_a_month"
                label="Oyda darslar soni"
                rules={[{ required: true, message: 'Oyda darslar sonini tanlang!' }]}
              >
                <Select placeholder="Tanlang" size="large">
                  <Option value={12}>
                    <Space>
                      <TeamOutlined /> 12 ta dars
                    </Space>
                  </Option>
                  <Option value={20}>
                    <Space>
                      <TeamOutlined /> 20 ta dars
                    </Space>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="lesson_duration"
            label="Dars davomiyligi (daqiqa)"
            rules={[{ required: true, message: 'Dars davomiyligini tanlang!' }]}
          >
            <Select placeholder="Tanlang" size="large">
              <Option value={120}>
                <Space>
                  <ClockCircleOutlined /> 2 soat (120 daqiqa)
                </Space>
              </Option>
              <Option value={180}>
                <Space>
                  <ClockCircleOutlined /> 3 soat (180 daqiqa)
                </Space>
              </Option>
              <Option value={240}>
                <Space>
                  <ClockCircleOutlined /> 4 soat (240 daqiqa)
                </Space>
              </Option>
              <Option value={270}>
                <Space>
                  <ClockCircleOutlined /> 4.5 soat (270 daqiqa)
                </Space>
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        open={viewModalOpen}
        title={
          <Space>
            <EyeOutlined />
            Kurs ma'lumotlari
          </Space>
        }
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="edit" type="primary" onClick={() => {
            setViewModalOpen(false);
            handleEdit(viewingCourse!);
          }}>
            Tahrirlash
          </Button>,
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            Yopish
          </Button>
        ]}
        width={600}
      >
        {viewingCourse && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                icon={<BookOutlined />}
                style={{ 
                  backgroundColor: '#1890ff',
                  fontSize: '32px',
                  marginBottom: 16
                }}
              >
                {viewingCourse.title.charAt(0).toUpperCase()}
              </Avatar>
              <Title level={4} style={{ margin: '8px 0 4px 0' }}>
                {viewingCourse.title}
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                {viewingCourse.description}
              </Text>
            </div>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Narxi"
                    value={viewingCourse.price}
                    formatter={(value) => formatPrice(Number(value))}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<DollarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Davomiyligi"
                    value={viewingCourse.duration}
                    suffix="kun"
                    valueStyle={{ color: '#faad14' }}
                    prefix={<CalendarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Text type="secondary">Haftada</Text>
                  <br />
                  <Text strong style={{ fontSize: '18px' }}>
                    {viewingCourse.lessons_in_a_week} ta
                  </Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Text type="secondary">Oyda</Text>
                  <br />
                  <Text strong style={{ fontSize: '18px' }}>
                    {viewingCourse.lessons_in_a_month} ta
                  </Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Text type="secondary">Dars</Text>
                  <br />
                  <Text strong style={{ fontSize: '18px' }}>
                    {formatLessonDuration(viewingCourse.lesson_duration)}
                  </Text>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Courses;
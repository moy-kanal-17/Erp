import { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Button, Table, Modal, Form, Input, Card, Space, Typography, Select, type TablePaginationConfig } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../service/course.service';
import { Notification } from '../../helpers';

const { Title } = Typography;
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
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data: response } = useQuery<{ courses: Course[]; total: number }>({
    queryKey: ['courses', page, limit],
    queryFn: () => courseService.getCourses({ page, limit }),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Course, 'id'>) => courseService.createCourse(data),
    onSuccess: () => {
      Notification('success', 'Create Success', 'Course created,   crushing it!');
      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      Notification('error', 'Create Failed', 'Couldn’t create course, shit’s broken!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Course) => courseService.updateCourse(data.id, data),
    onSuccess: () => {
      Notification('success', 'Update Success', 'Course updated like a   boss!');
      setIsModalOpen(false);
      setEditCourse(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      Notification('error', 'Update Failed', 'Couldn’t update course, try again!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => courseService.deleteCourse(id),
    onSuccess: () => {
      Notification('success', 'Delete Success', 'Course   trashed!');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      Notification('error', 'Delete Failed', 'Couldn’t delete course, something’s fucked!');
    },
  });

  const handleEdit = useCallback(
    (course: Course) => {
      setEditCourse(course);
      setIsModalOpen(true);
      console.log('Editing course:', course , 'with ID:', course.id , "price", course.price);
      
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

  const handleDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: 'Delete this course?',
        content: 'No turning back, you sure?',
        okText: 'Delete',
        cancelText: 'Cancel',
        onOk: () => deleteMutation.mutate(id),
      });
    },
    [deleteMutation],
  );

  const handleSubmit = useCallback(() => {
    form.validateFields().then((values: Omit<Course, 'id'>) => {
      if (editCourse) {
        updateMutation.mutate({ id: editCourse.id, ...values });
      } else {
        createMutation.mutate(values);
      }
    });
  }, [form, editCourse, createMutation, updateMutation]);

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    setPage(pagination.current || 1);
    setLimit(pagination.pageSize || 5);
  }, []);

  const columns = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
      { title: 'Title', dataIndex: 'title', key: 'title' },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      { title: 'Price', dataIndex: 'price', key: 'price' },
      { title: 'Duration', dataIndex: 'duration', key: 'duration' },
      { title: 'Lessons/Week', dataIndex: 'lessons_in_a_week', key: 'lessons_in_a_week' },
      { title: 'Lessons/Month', dataIndex: 'lessons_in_a_month', key: 'lessons_in_a_month' },
      { title: 'Lesson Duration', dataIndex: 'lesson_duration', key: 'lesson_duration' },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: Course) => (
          <Space size="middle">
            <Button icon={<EditOutlined />} size="middle" type='primary' onClick={() => handleEdit(record)} />
            <Button icon={<DeleteOutlined />} size="middle" type='primary' danger onClick={() => handleDelete(record.id)} />
          </Space>
        ),
      },
    ],
    [handleEdit, handleDelete],
  );

  return (
    <Container>
      <Card style={{ margin: '0 auto', maxWidth: 1200 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={3}>Course Management</Title>
          <Button type="primary" style={{ background: '#1890ff', borderColor: '#1890ff' }} onClick={() => setIsModalOpen(true)}>
            Create Course
          </Button>
        </div>
        { (
          <StyledTable
            dataSource={response as any}
            columns={columns as any}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: limit,
              total: response?.total || 0,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20'],
            }}
            onChange={handleTableChange}
            scroll={{ x: true }}
          />
        )}
        <Modal
          title={editCourse ? 'Edit Course' : 'Create Course'}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setEditCourse(null);
            form.resetFields();
          }}
          onOk={handleSubmit}
          okText={editCourse ? 'Update' : 'Create'}
          cancelText="Cancel"
          centered
        >
          <Form layout="vertical" form={form}>
            <Form.Item name="title" label="Course Name" rules={[{ required: true, message: 'Enter a course name!' }]}>
              <Input placeholder="Course name" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Course Description"
              rules={[{ required: true, message: 'Enter a course description!' }]}
            >
              <Input.TextArea rows={3} placeholder="Course description" />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[
                { required: true, message: 'Price should not be empty!' },
              ]}
            >
              <Input type="number" placeholder="price" />
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration"
              rules={[{ required: true, message: 'Duration should not be empty!' }]}
            >
              <Input type="number" placeholder="Duration (days)" />
            </Form.Item>
            <Form.Item
              name="lessons_in_a_week"
              label="Lessons per Week"
              rules={[
                { required: true, message: 'Lessons per week should not be empty!' },
                { type: 'enum', enum: [3, 5], message: 'Lessons per week must be 3 or 5!' },
              ]}
            >
              <Select placeholder="Select lessons per week">
                <Option value={3}>3</Option>
                <Option value={5}>5</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="lessons_in_a_month"
              label="Lessons per Month"
              rules={[
                { required: true, message: 'Lessons per month should not be empty!' },
                { type: 'enum', enum: [12, 20], message: 'Lessons per month must be 12 or 20!' },
              ]}
            >
              <Select placeholder="Select lessons per month">
                <Option value={12}>12</Option>
                <Option value={20}>20</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="lesson_duration"
              label="Lesson Duration (minutes)"
              rules={[
                { required: true, message: 'Lesson duration should not be empty!' },
                { type: 'enum', enum: [120, 180, 240, 270], message: 'Lesson duration must be 120, 180, 240, or 270!' },
              ]}
            >
              <Select placeholder="Select lesson duration">
                <Option value={120}>120</Option>
                <Option value={180}>180</Option>
                <Option value={240}>240</Option>
                <Option value={270}>270</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  padding: 32px;
  background: rgba(255, 255, 255, 0.95);
  min-height: 100vh;
  color: #000;
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #f8f8f8;
    color: #000;
    font-weight: 500;
  }
  .ant-table-tbody > tr > td {
    color: #000;
  }
`;

export default Courses;
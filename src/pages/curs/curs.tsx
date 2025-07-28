import { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Button, Table, Modal, Form, Input, Card, Space, Typography, type TablePaginationConfig,  } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../service/course.service';
import { Notification } from '../../helpers';

const { Title } = Typography;

interface Course {
  id: number;
  title: string;
  description: string;
  [key: string]: any;
}



const Courses = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data: courses } = useQuery<Course[]>({
    queryKey: ['courses', page, limit],
    queryFn: () => courseService.getCourses({ page, limit }),
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; description: string }) => courseService.createCourse(data),
    onSuccess: () => {
      Notification('success', 'Create Success', 'Course created, crushing it!');
      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      Notification('error', 'Create Failed', 'Couldn’t create course, try again!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; title: string; description: string }) => courseService.updateCourse(data.id, { title: data.title, description: data.description }),
    onSuccess: () => {
      Notification('success', 'Update Success', 'Course updated like a boss!');
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
      Notification('success', 'Delete Success', 'Course trashed!');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      Notification('error', 'Delete Failed', 'Couldn’t delete course, something’s wrong!');
    },
  });

  const handleEdit = useCallback((course: Course) => {
    setEditCourse(course);
    setIsModalOpen(true);
    form.setFieldsValue({
      title: course.title,
      description: course.description,
    });
  }, [form]);

  const handleDelete = useCallback((id: number) => {
    Modal.confirm({
      title: 'Delete this course?',
      content: 'No going back, you sure?',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => deleteMutation.mutate(id),
    });
  }, [deleteMutation]);

  const handleSubmit = useCallback(() => {
    form.validateFields().then((values: { title: string; description: string }) => {
      if (editCourse) {
        updateMutation.mutate({ id: editCourse.id, title: values.title, description: values.description });
      } else {
        createMutation.mutate({ title: values.title, description: values.description });
      }
    });
  }, [form, editCourse, createMutation, updateMutation]);

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    setPage(pagination.current || 1);
    setLimit(pagination.pageSize || 5);
  }, []);

  const columns = useMemo(() => [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Course) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ], [handleEdit, handleDelete]);

  return (
    <Container>
      <Card bordered={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={3}>Course Management</Title>
          <Button type="primary" style={{ background: '#1890ff', borderColor: '#1890ff' }} onClick={() => setIsModalOpen(true)}>
            Create Course
          </Button>
        </div>
        {courses?.length === 0 ? (
          <p>No courses found</p>
        ) : (
          <StyledTable
            dataSource={courses}
            columns={columns as any}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: limit,
              total: courses?.length || 0,
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
            <Form.Item
              name="title"
              label="Course Name"
              rules={[{ required: true, message: 'Enter a course name!' }]}
            >
              <Input placeholder="Course name" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Course Description"
              rules={[{ required: true, message: 'Enter a course description!' }]}
            >
              <Input.TextArea rows={3} placeholder="Course description" />
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
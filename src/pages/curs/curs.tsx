import { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Card,
  Space,
  Typography,
  Divider,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../service/course.service';
import { Notification } from '../../helpers';

const { Title, Text } = Typography;

type Course = {
  id: number;
  title: string;
  description: string;
};

const Curs = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();

  const { data: courses, isLoading, isError } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => courseService.getCourses({ page: 1, limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => courseService.deleteCourse(id),
    onSuccess: () => {
      Notification('info', 'Delete Success', 'Course deleted');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      Notification('error', 'Delete Failed', 'Could not delete course');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Course) => courseService.updateCourse(data.id, data),
    onSuccess: () => {
      Notification('success', 'Update Success', 'Course updated');
      setIsModalOpen(false);
      setEditCourse(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      Notification('error', 'Update Failed', 'Could not update course');
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
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  const handleUpdate = useCallback(() => {
    form.validateFields().then((values) => {
      if (editCourse?.id) {
        updateMutation.mutate({
          ...editCourse,
          ...values,
        });
      }
    });
  }, [form, editCourse, updateMutation]);

  const columns = useMemo(() => [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Course) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            loading={deleteMutation.isPending}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ], [handleEdit, handleDelete, deleteMutation.isPending]);

  return (
    <Container>
      <Card bordered={false}>
        <Title level={3}>Course Management</Title>
        <Divider />
        <StyledTable
          dataSource={courses}
          columns={columns as any}
          loading={isLoading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
        {isError && <Text type="danger">Failed to load courses.</Text>}
      </Card>

      <Modal
        title="Edit Course"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditCourse(null);
          form.resetFields();
        }}
        onOk={handleUpdate}
        confirmLoading={updateMutation.isPending}
        okText="Save"
        cancelText="Cancel"
        centered
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="title"
            label="Course Name"
            rules={[{ required: true, message: 'Please enter a course name' }]}
          >
            <Input placeholder="Course name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Course Description"
            rules={[{ required: true, message: 'Please enter a course description' }]}
          >
            <Input.TextArea rows={3} placeholder="Course description" />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  padding: 32px;
  background: #fff;
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

export default Curs;

import { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Button, Table, Modal, Form, Input } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../service/course.service';
import { Notification } from '../../helpers';
import {  Edit3Icon } from 'lucide-react';

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
    form.validateFields().then((values: any) => {
      if (editCourse?.id) {
        updateMutation.mutate({
          ...editCourse,
          title: values.title,
          description: values.description,
        });
      }
    });
  }, [form, editCourse, updateMutation]);

  const columns = useMemo(() => [
    { title: "ID", dataIndex: 'id', key: 'id' },
    { title: "Title", dataIndex: 'title', key: 'title' },
    { title: "Description", dataIndex: 'description', key: 'description' },
    {
      title: "Actions",
      key: 'actions',
      render: (_: any, record: Course) => (
        <ButtonGroup>
          <Button onClick={() => handleEdit(record)} type="primary" size='small'><Edit3Icon /></Button>
          <Button onClick={() => handleDelete(record.id)} danger loading={deleteMutation.isPending} type="dashed" size='small'>Delete</Button>
        </ButtonGroup>
      ),
    },
  ], [handleEdit, handleDelete, deleteMutation.isPending]);

  return (
    <StyledContainer>
      <HeaderWrapper>
        <h1>Courses</h1>
      </HeaderWrapper>

      <StyledTable
        dataSource={courses}
        columns={columns as any}
        loading={isLoading}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      {isError && <ErrorText>Failed to load courses.</ErrorText>}

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
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="title"
            label="Course Name"
            rules={[{ required: true, message: "Please enter a course name" }]}
          >
            <Input placeholder="Course name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Course Description"
            rules={[{ required: true, message: "Please enter a course description" }]}
          >
            <Input.TextArea rows={3} placeholder="Course description" />
          </Form.Item>
        </Form>
      </Modal>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  padding: 24px;
  background: #fff;
  min-height: 100vh;
  color: #000;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: #000;
  }
`;

const StyledTable = styled(Table)`
  background: #fff;

  .ant-table-thead > tr > th {
    background: #f0f0f0;
    color: #000;
  }

  .ant-table-tbody > tr > td {
    color: #000;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f9f9f9;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 12px;
`;

export default Curs;

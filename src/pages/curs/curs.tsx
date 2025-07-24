import { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button, Table, Modal, Form, Input, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../service/course.service';
import { Notification } from '../../helpers';

// Типы
type Course = {
  id: number;
  title: string;
  description: string;
};

type ActionButtonsProps = {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

type CourseTableProps = {
  columns: any;
  dataSource?: Course[];
  loading: boolean;
  isError: boolean;
};

type CourseModalProps = {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  loading: boolean;
  form: any;
  language: string;
  translations: Record<string, Record<string, string>>;
};

const translations = {
  en: {
    editCourse: "Edit Course",
    addCourse: "Update",
    cancel: "Cancel",
    courseName: "Course Name",
    requiredTitle: "Please enter a course name",
    courseDescription: "Course Description",
    requiredDescription: "Please enter a course description",
  },
};

const Curs = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const [language, setLanguage] = useState('en');

  // Получение курсов
  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => courseService.getCourses({ page: 1, limit: 100 }),
  });

  // Удаление курса
  const deleteMutation = useMutation({
    mutationFn: (id: number) => courseService.deleteCourse(id),
    onSuccess: () => {
      Notification('info', "deleteSuccess", 'Course deleted');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      Notification('error', "delete not Success", 'Course not deleted');
    },
  });

  // Обновление курса
  const updateMutation = useMutation({
    mutationFn: (data: Course) => courseService.updateCourse(data.id, data),
    onSuccess: () => {
      Notification('success', "update Success", 'Course updated');
      setIsModalOpen(false);
      setEditCourse(null);
      form.resetFields();
    },
    onError: () => {
      Notification('error', "update not Success", 'Course not updated');
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
        <ActionButtons
          onEdit={() => handleEdit(record)}
          onDelete={() => handleDelete(record.id)}
          isDeleting={deleteMutation.isPending}
        />
      ),
    },
  ], [handleEdit, handleDelete, deleteMutation.isPending]);

  return (
    <StyledContainer>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <HeaderWrapper>
          <h1>Courses</h1>
          <Select
            value={language}
            onChange={setLanguage}
            style={{ width: 140 }}
            options={[
              { value: 'en', label: 'English' },
            ]}
          />
        </HeaderWrapper>
      </motion.div>

      <CourseTable
        columns={columns}
        dataSource={courses}
        loading={isLoading}
        isError={isError}
      />

      <CourseModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditCourse(null);
          form.resetFields();
        }}
        onOk={handleUpdate}
        loading={updateMutation.isPending}
        form={form}
        language={language}
        translations={translations}
      />
    </StyledContainer>
  );
};

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete, isDeleting }) => (
  <ButtonGroup>
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Button type="primary" onClick={onEdit} className="edit-button">✏️</Button>
    </motion.div>
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Button type="primary" danger onClick={onDelete} loading={isDeleting} className="delete-button">🗑️</Button>
    </motion.div>
  </ButtonGroup>
);

const CourseTable: React.FC<CourseTableProps> = ({ columns, dataSource, loading, isError }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
    <StyledTable
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      rowKey="id"
      bordered
      pagination={{ pageSize: 5 }}
    />
    {isError && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="error-text"
      >
        Failed to load courses
      </motion.p>
    )}
  </motion.div>
);

const CourseModal: React.FC<CourseModalProps> = ({
  open,
  onCancel,
  onOk,
  loading,
  form,
  language,
  translations
}) => (
  <StyledModal
    title={translations[language].editCourse}
    open={open}
    onCancel={onCancel}
    onOk={onOk}
    confirmLoading={loading}
    okText={translations[language].addCourse}
    cancelText={translations[language].cancel}
  >
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Form layout="vertical" form={form}>
        <Form.Item
          name="title"
          label={translations[language].courseName}
          rules={[{ required: true, message: translations[language].requiredTitle }]}
        >
          <Input placeholder={translations[language].courseName} />
        </Form.Item>
        <Form.Item
          name="description"
          label={translations[language].courseDescription}
          rules={[{ required: true, message: translations[language].requiredDescription }]}
        >
          <Input.TextArea rows={3} placeholder={translations[language].courseDescription} />
        </Form.Item>
      </Form>
    </motion.div>
  </StyledModal>
);

// Стили
const StyledContainer = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #ffffffff 0%, #eeeeeeff 100%);
  min-height: 100vh;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #d1c2ff;
    margin: 0;
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  }

  .ant-table-thead > tr > th {
    background: #1e3a8a;
    color: #c8b6ff;
    font-weight: 600;
  }

  .ant-table-tbody > tr:hover > td {
    background: rgba(55, 65, 81, 0.9);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;

  .edit-button {
    background: #9a79ff;
    border-color: #9a79ff;
  }

  .delete-button {
    background: #ef4444;
    border-color: #ef4444;
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    background: rgba(17, 24, 39, 0.9);
    border-radius: 8px;
    color: #f3f4f6;
  }

  .ant-modal-header {
    background: #0f172a;
    border-bottom: none;
  }

  .ant-modal-title {
    color: #d1c2ff;
  }

  .ant-form-item-label > label {
    color: #c8b6ff;
  }

  .ant-input, .ant-input-textarea {
    background: rgba(31, 41, 55, 0.9);
    border: 1px solid #374151;
    color: #f3f4f6;
    border-radius: 6px;
  }

  .ant-input:focus, .ant-input-textarea:focus {
    border-color: #9a79ff;
    box-shadow: 0 0 10px rgba(154, 121, 255, 0.3);
  }
`;

export default Curs;

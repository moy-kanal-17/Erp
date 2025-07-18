import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button, Table, message, Modal, Form, Input, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../service/course.service';
import { Notification } from '../../helpers';

const Curs = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form] = Form.useForm();
  const [language, setLanguage] = useState('en');

  // Локализация
  const translations = useMemo(() => ({
    en: {
      title: 'Courses List',
      id: 'ID',
      courseTitle: 'Title',
      description: 'Description',
      actions: 'Actions',
      editCourse: 'Edit Course',
      addCourse: 'Add Course',
      courseName: 'Course Name',
      courseDescription: 'Course Description',
      requiredTitle: 'Title is required!',
      requiredDescription: 'Description is required!',
      noData: 'No courses available',
      errorLoading: 'Error loading courses!',
    },
    ru: {
      title: 'Список курсов',
      id: 'ID',
      courseTitle: 'Название',
      description: 'Описание',
      actions: 'Действия',
      editCourse: 'Редактировать курс',
      addCourse: 'Добавить курс',
      courseName: 'Название курса',
      courseDescription: 'Описание курса',
      requiredTitle: 'Название обязательно!',
      requiredDescription: 'Описание обязательно!',
      noData: 'Курсы отсутствуют',
      errorLoading: 'Ошибка при загрузке курсов!',
    },
  }), []);

  // Получение курсов
  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getCourses({ page: 1, limit: 100 }),
  });

  // Удаление курса
  const deleteMutation = useMutation({
    mutationFn: (id) => courseService.deleteCourse(id),
    onSuccess: () => {
      Notification('info', translations[language].deleteSuccess || 'Deleted!', translations[language].courseDeleted || 'Course deleted');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      message.error(translations[language].deleteError || 'Error deleting course');
    },
  });

  // Обновление курса
  const updateMutation = useMutation({
    mutationFn: (data) => courseService.updateCourse(data.id, data),
    onSuccess: () => {
      Notification('success', translations[language].updateSuccess || 'Success', translations[language].courseUpdated || 'Course updated');
      setIsModalOpen(false);
      setEditCourse(null);
      form.resetFields();
    },
    onError: () => {
      message.error(translations[language].updateError || 'Error updating course');
    },
  });

  // Обработчики
  const handleEdit = useCallback((course:any) => {
    setEditCourse(course);
    setIsModalOpen(true);
    form.setFieldsValue({
      title: course.title,
      description: course.description,
    });
  }, [form]);

  const handleDelete = useCallback((id) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  const handleUpdate = useCallback(() => {
    form.validateFields().then((values) => {
      if (editCourse?.id) {
        updateMutation.mutate({
          ...editCourse,
          title: values.title,
          description: values.description,
        });
      }
    });
  }, [form, editCourse, updateMutation]);

  // Колонки таблицы
  const columns = useMemo(() => [
    { title: translations[language].id, dataIndex: 'id', key: 'id' },
    { title: translations[language].courseTitle, dataIndex: 'title', key: 'title' },
    { title: translations[language].description, dataIndex: 'description', key: 'description' },
    {
      title: translations[language].actions,
      key: 'actions',
      render: (_, record) => (
        <ActionButtons
          onEdit={() => handleEdit(record)}
          onDelete={() => handleDelete(record.id)}
          isDeleting={deleteMutation.isPending}
        />
      ),
    },
  ], [language, handleEdit, handleDelete, deleteMutation.isPending]);

  return (
    <StyledContainer>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderWrapper>
          <h1>{translations[language].title}</h1>
          <Select
            value={language}
            onChange={setLanguage}
            style={{ width: 120 }}
            options={[
              { value: 'en', label: 'English' },
              { value: 'ru', label: 'Русский' },
            ]}
          />
        </HeaderWrapper>
      </motion.div>
      <CourseTable
        columns={columns}
        dataSource={courses}
        loading={isLoading}
        isError={isError}
        language={language}
        translations={translations}
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

// Компонент для кнопок действий
const ActionButtons = ({ onEdit, onDelete, isDeleting }) => (
  <ButtonGroup>
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Button type="primary" onClick={onEdit} className="edit-button">
        ✏️
      </Button>
    </motion.div>
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Button type="primary" danger onClick={onDelete} loading={isDeleting} className="delete-button">
        🗑️
      </Button>
    </motion.div>
  </ButtonGroup>
);

// Компонент для таблицы
const CourseTable = ({ columns, dataSource, loading, isError, language, translations }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
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
        {translations[language].errorLoading}
      </motion.p>
    )}
  </motion.div>
);

// Компонент для модального окна
const CourseModal = ({ open, onCancel, onOk, loading, form, language, translations }) => (
  <StyledModal
    title={translations[language].editCourse}
    open={open}
    onCancel={onCancel}
    onOk={onOk}
    confirmLoading={loading}
    okText={translations[language].addCourse}
    cancelText={translations[language].cancel || 'Cancel'}
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
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

const errorTextStyles = `
  .error-text {
    color: #ef4444;
    font-size: 1rem;
    margin-top: 16px;
  }
`;

export default Curs;
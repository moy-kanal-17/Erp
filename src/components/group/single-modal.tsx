import { yupResolver } from "@hookform/resolvers/yup";
import { useGroup, useTeachers, useStudents } from "@hooks";
import { useQueryClient } from "@tanstack/react-query";
import type { ModalProps } from "@types";
import { Button, Form, Input, Modal, Skeleton, Alert, Select } from "antd";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

// Define types
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface StudentsData {
  success: boolean;
  data: User[];
  total: number;
}


interface FormData {
  studentId?: number[];
  teacherId?: number[];
  status?: boolean;
  start_date?: string;
  groupId?: number;
}

const schema = yup.object().shape({
});

interface ThisProps extends ModalProps {
  addingTeacher: boolean;
  groupId: number;
}

const AddTeacherorStudentModal = ({ addingTeacher, open, toggle, groupId }: ThisProps) => {
  const { useGroupAddStudent, useGroupAddTeacher } = useGroup({ page: 1, limit: 100 });
  const { data: teachers, isLoading: isLoadingTeachers, error: teachersError } = useTeachers();
  const { data: students, isLoading: isLoadingStudents, error: studentsError } = useStudents({ page: 1, limit: 100 });
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const { mutate: addStudent, isPending: isCreatingSt } = useGroupAddStudent();
  const { mutate: addTeacher, isPending: isCreatingTr } = useGroupAddTeacher();
  const queryClient = useQueryClient();
  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    context: { addingTeacher },
    defaultValues: {
      teacherId: [],
      studentId: [],
      status: undefined,
      start_date: undefined,
      groupId: undefined,
    },
  });

  const selectedIds = watch(addingTeacher ? "teacherId" : "studentId");

  useEffect(() => {
    const originalData = addingTeacher
      ? (teachers )?.data?.data || []
      : (students as StudentsData)?.data || [];
    console.log('Original data:', originalData); // Debug
    setFilteredData(originalData);
  }, [teachers, students, addingTeacher]);

  const onSubmit = (data: FormData) => {
    data.status = true;
    data.start_date = new Date().toISOString();
    data.groupId = groupId;

    if (addingTeacher) {
      delete data.studentId;
      addTeacher(data, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["groups", "add-teacher"] });
          toggle();
        },
        onError: (error: unknown) => {
          console.error('Add teacher error:', error);
        },
      });
    } else {
      delete data.teacherId;
      addStudent(data, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["groups", "add-student"] });
          toggle();
        },
        onError: (error: unknown) => {
          console.error('Add student error:', error);
        },
      });
    }
  };

  const handleSearch = (value: string) => {
    const id = value ? +value : null;
    const originalData = addingTeacher
      ? (teachers )?.data?.data || []
      : (students as StudentsData)?.data || [];
    if (!id) {
      setFilteredData(originalData);
    } else {
      const filtered = originalData.filter((item: User) => item.id === id);
      setFilteredData(filtered);
    }
  };

  const handleListItemClick = (id: number) => {
    const currentIds = selectedIds || [];
    const newIds = currentIds.includes(id)
      ? currentIds.filter((selectedId: number) => selectedId !== id)
      : [...currentIds, id];
    setValue(addingTeacher ? "teacherId" : "studentId", newIds);
  };

  return (
    <Modal
      title={`Add ${addingTeacher ? "Teacher" : "Student"}`}
      centered
      open={open}
      onCancel={toggle}
      footer={null}
      width={400}
      styles={{
        content: { background: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', boxShadow: '0 10px 50px rgba(0, 0, 0, 0.3)' },
        header: { background: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px 8px 0 0', borderBottom: 'none' },
        // title: { fontSize: '16px', color: '#000', fontWeight: 600 },
      }}
    >
      {(isLoadingTeachers || isLoadingStudents) && <Skeleton active paragraph={{ rows: 4 }} />}
      {(teachersError || studentsError) && (
        <Alert
          message={addingTeacher ? teachersError?.message || "Error loading teachers" :   "Error loading students"}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}
      <Form
        layout="vertical"
        autoComplete="on"
        onFinish={handleSubmit(onSubmit)}
      >
        <Form.Item
          label={addingTeacher ? "Select Teachers" : "Select Students"}
          name={addingTeacher ? "teacherId" : "studentId"}
        >
          <Controller
            name={addingTeacher ? "teacherId" : "studentId"}
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <>
                <Input
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by ID..."
                  type="number"
                  style={{ borderRadius: '8px', fontSize: '14px', marginBottom: '8px' }}
                  disabled={isLoadingTeachers || isLoadingStudents || isCreatingSt || isCreatingTr}
                />
                <Select
                  mode="multiple"
                  placeholder={`Select ${addingTeacher ? "teachers" : "students"}`}
                  value={selectedIds}
                  onChange={(values) => {
                    onChange(values);
                    setValue(addingTeacher ? "teacherId" : "studentId", values);
                  }}
                  style={{ width: '100%', borderRadius: '8px', fontSize: '14px', marginBottom: '8px' }}
                  disabled={isLoadingTeachers || isLoadingStudents || isCreatingSt || isCreatingTr}
                  options={filteredData.map((item) => ({
                    value: item.id,
                    label: `${item.id} - ${item.first_name} ${item.last_name || ''}`,
                  }))}
                />
                {error && (
                  <Alert message={error.message} type="error" showIcon style={{ marginTop: '8px', marginBottom: '8px' }} />
                )}
                <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '8px' }}>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <Button
                        key={item.id}
                        type={selectedIds?.includes(item.id) ? "primary" : "default"}
                        onClick={() => handleListItemClick(item.id)}
                        style={{
                          width: '100%',
                          marginBottom: '4px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: selectedIds?.includes(item.id) ? '#1890ff' : '#fff',
                          color: selectedIds?.includes(item.id) ? '#fff' : '#595959',
                        }}
                        disabled={isLoadingTeachers || isLoadingStudents || isCreatingSt || isCreatingTr}
                      >
                        {`${item.id} - ${item.first_name} ${item.last_name || ''}`}
                      </Button>
                    ))
                  ) : (
                    <p style={{ color: '#595959', fontSize: '14px', textAlign: 'center' }}>
                      {isLoadingTeachers || isLoadingStudents ? 'Loading...' : 'No results found'}
                    </p>
                  )}
                </div>
              </>
            )}
          />
        </Form.Item>
        {selectedIds!.length > 0 && (
          <div style={{ marginTop: '10px', marginLeft: '10px' }}>
            <p style={{ fontSize: '16px', color: '#595959', fontWeight: 500 }}>Selected:</p>
            {filteredData
              .filter((item) => selectedIds!.includes(item.id))
              .map((item) => (
                <p key={item.id} style={{ fontSize: '14px', color: '#1890ff' }}>
                  {`${item.id} - ${item.first_name} ${item.last_name || ''}`}
                </p>
              ))}
          </div>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={addingTeacher ? isCreatingTr : isCreatingSt}
            style={{ background: '#1890ff', border: 'none', borderRadius: '8px', width: '100%', height: '40px', fontSize: '14px' }}
            disabled={isLoadingTeachers || isLoadingStudents || isCreatingSt || isCreatingTr}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTeacherorStudentModal;
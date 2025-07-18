import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { userService } from '../../service/users.service';
import { useGroup } from '../../hooks/useGroup'; 

const { Option } = Select;

const Student: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: groupsData } = useGroup({ page: 1, limit: 100 });
  const groups = groupsData?.data?.data || [];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userService.getStudents();
      console.log(res, "response");
      setUsers(res);
    } catch {
      message.error('❌ Foydalanuvchilarni olishda xatolik!');
    }
  };

  const openModal = (user: any = null) => {
    setEditingId(user?.id || null);
    if (user) {
      form.setFieldsValue({ ...user, groupsId: user.groupsId ? user.groupsId[0] : undefined }); 
   
      form.setFieldsValue({ password_hash: '', confirm_password: '' });
    } else {
      form.resetFields();
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const payload: any = {
        ...values,
        lidId: null, 
        eventsId: null,
        groupsId: values.groupsId ? [values.groupsId] : null, 
      };


      if (editingId) {
        delete payload.password_hash;
        delete payload.confirm_password;
        delete payload.groupsId;

      } else {

        payload.password_hash = values.password_hash;
        delete payload.confirm_password;  }
      
      console.log("Payload sent:", payload);

      if (editingId) {
        await userService.updateUser(editingId, payload);
        message.success('✅ Foydalanuvchi yangilandi');
      } else {
        await userService.postUser(payload);
        message.success('✅ Foydalanuvchi yaratildi');
      }

      setModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error during form submission:", error);
      message.error(error?.errorFields?.[0]?.errors?.[0] || '❌ Saqlashda xatolik yuz berdi!');
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Foydalanuvchini o‘chirmoqchimisiz?',
      okText: 'Ha',
      cancelText: 'Yo‘q',
      onOk: async () => {
        try {
          await userService.deleteUser(id);
          fetchUsers();
          message.success('✅ Foydalanuvchi o‘chirildi');
        } catch {
          message.error('❌ O‘chirishda xatolik!');
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Ism', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Familiya', dataIndex: 'last_name', key: 'last_name' }, 
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Telefon', dataIndex: 'phone', key: 'phone' },
    { title: 'Jinsi', dataIndex: 'gender', key: 'gender' },
    { title: 'Tug\'ilgan sana', dataIndex: 'date_of_birth', key: 'date_of_birth' }, 
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: any) => (
        <>
          <Button type="primary" size='small' onClick={() => openModal(record)}>✏️</Button>
          <br />
          <Button type="primary" size='small' danger onClick={() => handleDelete(record.id)}>🗑️</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">👥 Foydalanuvchilar</h2>
        <Button type="primary" onClick={() => openModal()}>Yangi Foydalanuvchi</Button>
      </div>

      <Table dataSource={users} columns={columns} rowKey="id" bordered pagination={{ pageSize: 8 }} />

      <Modal
        title={editingId ? '✏️ Tahrirlash' : '➕ Yangi foydalanuvchi'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Saqlash"
        cancelText="Bekor"
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="first_name" label="Ism" rules={[{ required: true, message: 'Ism majburiy' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Familiya" rules={[{ required: true, message: 'Familiya majburiy' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'To\'g\'ri email kiriting!' }]}>
            <Input />
          </Form.Item>


          {!editingId && (
            <>
              <Form.Item
                name="password_hash"
                label="Parol"
                rules={[
                  { required: true, message: 'Parol majburiy' },
                  { min: 8, message: 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak' }
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                label="Parolni tasdiqlash"
                dependencies={['password_hash']}
                hasFeedback
                rules={[
                  { required: true, message: 'Parolni tasdiqlash majburiy' },
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
                <Input.Password />
              </Form.Item>
            </>
          )}

          <Form.Item name="gender" label="Jinsi" rules={[{ required: true, message: 'Jins majburiy' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Telefon raqami" rules={[{ required: true, message: 'Telefon raqam majburiy' }]}>

            <Input /> 
          </Form.Item>

          <Form.Item name="date_of_birth" label="Tug'ilgan sana" rules={[{ required: true, message: 'Tug\'ilgan sana majburiy' }]}>
        
            <Input /> 
          </Form.Item>

          <Form.Item name="groupsId" label="Guruh" >
            <Select placeholder="Guruhni tanlang">
              {groups.map((group: any) => (
                <Option key={group.id} value={group.id}>
                  {group.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Student;
import React, { useState, useEffect } from 'react';
import {
  Layout,  Table, Typography, message,
  Modal, Button, Form, Input, Select
} from 'antd';
import {

    PlusOutlined, EditOutlined
} from '@ant-design/icons';

import { teacherService } from '@service';

const {  Content, Footer } = Layout;
const { Title } = Typography;

const TeacherLayout: React.FC = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      const res = await teacherService.getTeacher({page:1,limit:50});
      setUsers(res?.data.data|| []);
      console.log(res?.data.data,"---teachers");
      
    } catch (err) {
      setError('Xatolik yuz berdi!');
      message.error('❌ Yuklashda xatolik!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  const showModal = (record: any = null) => {
    setEditingUser(record);
    setModalVisible(true);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();


      if (!editingUser) {
        values.branchId = [5]; 
      }

      if (editingUser) {
        delete values.password; // защита от отправки пароля при редактировании
        await teacherService.updateTeacher(editingUser.id, values);
        message.success("🔄 O'qituvchi tahrirlandi!");
      } else {
        await teacherService.createTeacher(values);
        message.success("✅ O'qituvchi qo‘shildi!");
      }

      setModalVisible(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      message.error("❌ Saqlashda xatolik yuz berdi.");
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Ismi', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Familiya', dataIndex: 'last_name', key: 'last_name' },
    { title: 'Telefon', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Roli', dataIndex: 'role', key: 'role' },
    {
      title: 'Amallar',
      render: (_: any, record: any) => (
        <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
          Tahrirlash
        </Button>
      ),
    },
  ];

  return (
    <Layout>


      <Content style={{ margin: 16, background: '#fff', padding: 24, borderRadius: 8 }}>
        <div className="flex justify-between items-center mb-4">
          <Title level={5}>Teachers</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Add new Teachers
          </Button>
        </div>

        {loading ? (
          <p>Yuklanmoqda...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <Table columns={columns} dataSource={users} rowKey="id" bordered />
        )}
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Teacher Panel ©{new Date().getFullYear()}
      </Footer>

      <Modal
        open={modalVisible}
        title={editingUser ? 'O‘qituvchini tahrirlash' : 'Yangi o‘qituvchi qo‘shish'}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText="Saqlash"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="first_name" label="Ism" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Familiya" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Telefon" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>

          


          {!editingUser && (
            <Form.Item name="password" label="Parol" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>

 
          )}
          <Form.Item name="role" label="Roli" rules={[{ required: true }]}>
            <Select options={[
              { label: 'O‘qituvchi', value: 'teacher' },
              { label: 'Admin', value: 'admin' },
              { label: 'Main Teacher', value: 'main teacher' }
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default TeacherLayout;

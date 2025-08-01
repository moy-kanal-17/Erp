import  { useState } from 'react';
import { Card, Table, Typography, Button, Modal, Form, Input, Select, message } from 'antd';
import { useTeacherMyGroups,
  //  useTeachers
   } from '@hooks';

const { Title } = Typography;
const { Option } = Select;

interface GroupTeacher {
  id: number;
  group: { id: number; name: string };
  teacher: { id: number; first_name: string; last_name: string };
  status: boolean;
  start_date: string;
  end_date: string;
}

const SettingsPag = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroupTeacher, setEditingGroupTeacher] = useState<GroupTeacher | null>(null);
  const [form] = Form.useForm();

  // const teachersHooks = useTeachers();
  const Mygroups = useTeacherMyGroups();
  console.log('Mygroups', Mygroups);
  
  const groupTeachers: GroupTeacher[] = [
    { id: 1, group: { id: 1, name: 'Group A' }, teacher: { id: 1, first_name: 'John', last_name: 'Doe' }, status: true, start_date: '2021-03-01', end_date: '2021-12-31' },
    { id: 2, group: { id: 2, name: 'Group B' }, teacher: { id: 2, first_name: 'Peter', last_name: 'Smith' }, status: false, start_date: '2021-04-01', end_date: '2021-11-30' }
  ];

  const mockGroups = [
    { id: 1, name: 'Group A' },
    { id: 2, name: 'Group B' },
    { id: 3, name: 'Group C' }
  ];

  const mockTeachers = [
    { id: 1, first_name: 'John', last_name: 'Doe' },
    { id: 2, first_name: 'Peter', last_name: 'Smith' },
    { id: 3, first_name: 'Mary', last_name: 'Johnson' }
  ];

  const showModal = (groupTeacher?: GroupTeacher) => {
    if (groupTeacher) {
      setEditingGroupTeacher(groupTeacher);
      form.setFieldsValue({
        group: groupTeacher.group.id,
        teacher: groupTeacher.teacher.id,
        start_date: groupTeacher.start_date,
        end_date: groupTeacher.end_date
      });
    } else {
      setEditingGroupTeacher(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    {console.log(values);}
    setIsModalOpen(false);
    message.success(editingGroupTeacher ? 'Assignment updated!' : 'Teacher assigned!');
    form.resetFields();
  };

  const handleDelete = (id: number) => {
    {console.log(id);}
    Modal.confirm({
      title: 'Delete this assignment?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        message.success('Assignment deleted!');
      }
    });
  };

  const handleToggleStatus = (id: number, status: boolean) => {
    {console.log(id);}
    Modal.confirm({
      title: status ? 'Deactivate assignment?' : 'Activate assignment?',
      content: 'Are you sure?',
      okText: status ? 'Deactivate' : 'Activate',
      cancelText: 'Cancel',
      onOk: () => {
        message.success(status ? 'Assignment deactivated!' : 'Assignment activated!');
      }
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      render: (group: GroupTeacher['group']) => group.name || group.id
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher: GroupTeacher['teacher']) => `${teacher.first_name} ${teacher.last_name}` || teacher.id
    },
    { title: 'Start Date', dataIndex: 'start_date', key: 'start_date' },
    { title: 'End Date', dataIndex: 'end_date', key: 'end_date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (status ? 'Active' : 'Inactive')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: GroupTeacher) => (
        <div>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
          <Button type="link" onClick={() => handleToggleStatus(record.id, record.status)}>
            {record.status ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card title="Manage Group-Teacher Assignments">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>Assignments</Title>
        <Button type="primary" onClick={() => showModal()}>
          Assign Teacher to Group
        </Button>
      </div>
      {groupTeachers.length === 0 ? (
        <p>No assignments found</p>
      ) : (
        <Table
          dataSource={groupTeachers}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      )}
      <Modal
        title={editingGroupTeacher ? 'Edit Assignment' : 'Assign Teacher to Group'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="group" label="Group" rules={[{ required: true, message: 'Select a group!' }]}>
            <Select size="large">
              {mockGroups.map((group) => (
                <Option key={group.id} value={group.id}>
                  {group.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="teacher" label="Teacher" rules={[{ required: true, message: 'Select a teacher!' }]}>
            <Select size="large">
              {mockTeachers.map((teacher) => (
                <Option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="start_date" label="Start Date" rules={[{ required: true, message: 'Enter start date!' }]}>
            <Input type="date" size="large" />
          </Form.Item>
          <Form.Item name="end_date" label="End Date" rules={[{ required: true, message: 'Enter end date!' }]}>
            <Input type="date" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              {editingGroupTeacher ? 'Update' : 'Assign'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SettingsPag;
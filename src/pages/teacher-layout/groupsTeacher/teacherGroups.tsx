import { useState } from 'react';
import {
  Card,
  Table,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tooltip,
} from 'antd';
import { useTeacherMyGroups } from '@hooks';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const TeacherGroupsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroupTeacher, setEditingGroupTeacher] =
    useState<GroupTeacher | null>(null);
  const [form] = Form.useForm();


  const { data, isLoading } = useTeacherMyGroups();
  const groupTeachers: GroupTeacher[] = Array.isArray(data) ? data : (data?.data ?? []);
  console.log('Mygroups', groupTeachers);

  const mockGroups = [
    { id: 1, name: 'Group A' },
    { id: 2, name: 'Group B' },
    { id: 3, name: 'Group C' },
  ];

  const mockTeachers = [
    { id: 1, first_name: 'John', last_name: 'Doe' },
    { id: 2, first_name: 'Peter', last_name: 'Smith' },
    { id: 3, first_name: 'Mary', last_name: 'Johnson' },
  ];

  const showModal = (groupTeacher?: GroupTeacher) => {
    if (groupTeacher) {
      setEditingGroupTeacher(groupTeacher);
      form.setFieldsValue({
        group: groupTeacher.group.id,
        teacher: groupTeacher.teacher.id,
        start_date: groupTeacher.start_date,
        end_date: groupTeacher.end_date,
      });
    } else {
      setEditingGroupTeacher(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    console.log(values);
    setIsModalOpen(false);
    message.success(
      editingGroupTeacher ? 'Assignment updated!' : 'Teacher assigned!'
    );
    form.resetFields();
  };

  const columns = [
    {
      title: 'Group Name',
      dataIndex: ['group', 'name'],
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (val: boolean) => (val ? 'Active' : 'Inactive'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: GroupTeacher) => (
        <Button type="link" onClick={() => showModal(record)}>
            <Tooltip title="View Details">
 <Link to={`/teacher/group/${record.group.id}`}>
          <Eye />
          </Link>
          </Tooltip>
        </Button>
      ),
    },
  ];

  return (
    <Card title="Manage Group-Teacher Assignments">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Title level={4}>Assignments</Title>
        <Button type="primary" onClick={() => showModal()}>
          Assign Teacher to Group
        </Button>
      </div>

      <Table
        loading={isLoading}
        dataSource={groupTeachers}
        rowKey="id"
        columns={columns}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={
          editingGroupTeacher ? 'Edit Assignment' : 'Assign Teacher to Group'
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="group"
            label="Group"
            rules={[{ required: true, message: 'Select a group!' }]}
          >
            <Select size="large">
              {mockGroups.map((group) => (
                <Option key={group.id} value={group.id}>
                  {group.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="teacher"
            label="Teacher"
            rules={[{ required: true, message: 'Select a teacher!' }]}
          >
            <Select size="large">
              {mockTeachers.map((teacher) => (
                <Option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[{ required: true, message: 'Enter start date!' }]}
          >
            <Input type="date" size="large" />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="End Date"
            rules={[{ required: true, message: 'Enter end date!' }]}
          >
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

export default TeacherGroupsPage;

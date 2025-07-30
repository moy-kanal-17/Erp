import { useState, useEffect } from 'react';
import { 
  Table, 
  Typography, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message, 
  Card, 
  Select, 
  InputNumber, 
  Space, 
  Tag,
  Tooltip,
  Row,
  Col,
  Statistic,
  Empty,
  Badge,
  Divider
} from 'antd';
import { roomService } from '../../service/rooms.service';
import type { Room } from '@types';
import { 
  DeleteFilled, 
  EditFilled, 
  PlusOutlined, 
  HomeOutlined, 
  TeamOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useBranch } from "@hooks";

const { Title, Text } = Typography;
const { Search } = Input;

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const params = { page, limit };
  const { data } = useBranch(params);
  const branches = data?.branch ?? []; 

  const fetchRooms = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      console.log(search);
      
      const response = await roomService.getRooms({ page, limit });
      setRooms(response.rooms);
      setTotal(response.total);
    } catch (error) {
      message.error('Failed to fetch rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(page, limit, searchText);
  }, [page, limit, searchText]);

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPage(1);
  };

  const handleRefresh = () => {
    fetchRooms(page, limit, searchText);
    message.success('Data refreshed successfully!');
  };

  const showModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      form.setFieldsValue({
        name: room.name,
        capacity: room.capacity,
        branchId: room.branchId,
      });
    } else {
      setEditingRoom(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingRoom) {
        await roomService.updateRoom({ id: editingRoom.id, ...values });
        message.success({
          content: 'Room updated successfully!',
          icon: <EditFilled style={{ color: '#52c41a' }} />,
        });
      } else {
        await roomService.createRoom(values);
        message.success({
          content: 'Room created successfully!',
          icon: <PlusOutlined style={{ color: '#52c41a' }} />,
        });
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchRooms(page, limit, searchText);
    } catch (error) {
      message.error('Operation failed. Please try again.');
    }
  };

  const handleDelete = (room: Room) => {
    Modal.confirm({
      title: 'Delete Room',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>Are you sure you want to delete <strong>{room.name}</strong>?</p>
          <p style={{ color: '#8c8c8c', fontSize: '12px' }}>This action cannot be undone.</p>
        </div>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await roomService.deleteRoom(room.id!);
          message.success({
            content: 'Room deleted successfully!',
            icon: <DeleteFilled style={{ color: '#52c41a' }} />,
          });
          fetchRooms(page, limit, searchText);
        } catch (error) {
          message.error('Failed to delete room. Please try again.');
        }
      },
    });
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity <= 10) return 'green';
    if (capacity <= 50) return 'blue';
    if (capacity <= 100) return 'orange';
    return 'red';
  };

  const getBranchName = (branchId: number) => {
    const branch = branches.find((b: any) => b.id === branchId);
    return branch?.name || 'Unknown Branch';
  };

  const columns = [
    {
      title: 'Room ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => (
        <Badge count={id} style={{ backgroundColor: '#f0f0f0', color: '#595959' }} />
      ),
    },
    {
      title: 'Room Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HomeOutlined style={{ color: '#1890ff' }} />
          <Text strong>{name}</Text>
        </div>
      ),
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 120,
      render: (capacity: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TeamOutlined style={{ color: getCapacityColor(capacity) }} />
          <Tag color={getCapacityColor(capacity)}>{capacity} people</Tag>
        </div>
      ),
    },
    {
      title: 'Branch',
      dataIndex: 'branchId',
      key: 'branchId',
      render: (branchId: number) => (
        <Text type="secondary">{getBranchName(branchId)}</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Room) => (
        <Space size="small">
          <Tooltip title="Edit Room">
            <Button 
              type="primary" 
              icon={<EditFilled />}
              size="small"
              onClick={() => showModal(record)}
              style={{ borderRadius: '6px' }}
            />
          </Tooltip>
          <Tooltip title="Delete Room">
            <Button 
              danger 
              icon={<DeleteFilled />}
              size="small"
              onClick={() => handleDelete(record)}
              style={{ borderRadius: '6px' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <Title level={2} style={{ margin: 0, color: '#262626' }}>
                <HomeOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                Room Management
              </Title>
              <Text type="secondary">Manage and organize your facility rooms</Text>
            </div>
            <Space>
              <Tooltip title="Refresh Data">
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefresh}
                  style={{ borderRadius: '8px' }}
                />
              </Tooltip>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                size="large"
                style={{ 
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
                }}
              >
                Create Room
              </Button>
            </Space>
          </div>

          {/* Statistics Row */}
          <Row gutter={16} style={{ marginBottom: '20px' }}>
            <Col xs={24} sm={8}>
              <Card size="small" style={{ textAlign: 'center', borderRadius: '8px' }}>
                <Statistic
                  title="Total Rooms"
                  value={total}
                  prefix={<HomeOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" style={{ textAlign: 'center', borderRadius: '8px' }}>
                <Statistic
                  title="Total Capacity"
                  value={totalCapacity}
                  prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                  suffix="people"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" style={{ textAlign: 'center', borderRadius: '8px' }}>
                <Statistic
                  title="Active Branches"
                  value={branches.length}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Search Bar */}
          <Search
            placeholder="Search rooms by name..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ 
              maxWidth: '400px',
              borderRadius: '8px'
            }}
          />
        </div>

        <Divider />

        {/* Table Section */}
        {rooms.length === 0 && !loading ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text type="secondary">No rooms found</Text>
                <br />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => showModal()}
                  style={{ marginTop: '12px', borderRadius: '6px' }}
                >
                  Create Your First Room
                </Button>
              </div>
            }
            style={{ margin: '40px 0' }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={rooms}
            rowKey={(row) => row.id!}
            loading={loading}
            pagination={{
              current: page,
              pageSize: limit,
              total: total,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} rooms`,
              style: { marginTop: '16px' }
            }}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
            style={{
              marginTop: '16px'
            }}
          />
        )}

        {/* Create/Edit Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {editingRoom ? <EditFilled /> : <PlusOutlined />}
              {editingRoom ? 'Edit Room' : 'Create New Room'}
            </div>
          }
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
          style={{ borderRadius: '12px' }}
          destroyOnClose
        >
          <Divider />
          <Form 
            form={form} 
            onFinish={handleSubmit} 
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="name"
              label={
                <span style={{ fontWeight: 600 }}>
                  <HomeOutlined style={{ marginRight: 4 }} />
                  Room Name
                </span>
              }
              rules={[
                { required: true, message: 'Please enter room name!' },
                { min: 2, message: 'Room name must be at least 2 characters!' }
              ]}
            >
              <Input 
                placeholder="Enter room name (e.g., Conference Room A)"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item
              name="capacity"
              label={
                <span style={{ fontWeight: 600 }}>
                  <TeamOutlined style={{ marginRight: 4 }} />
                  Capacity
                </span>
              }
              rules={[
                { required: true, message: 'Please enter capacity!' },
                // { type: 'number', min: 1, max: 1000, message: 'Capacity must be between 1-1000' }
              ]}
            >
              <InputNumber
                placeholder="Enter room capacity"
                style={{ width: '100%', borderRadius: '8px' }}
                min={1}
                // max={1000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>

            <Form.Item
              name="branchId"
              label={
                <span style={{ fontWeight: 600 }}>
                  Branch Location
                </span>
              }
              rules={[{ required: true, message: "Please select a branch!" }]}
            >
              <Select 
                placeholder="Select branch location"
                style={{ borderRadius: '8px' }}
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase())
                }
              >
                {branches?.map((branch: any) => (
                  <Select.Option key={branch.id} value={branch.id}>
                    {branch.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button 
                  onClick={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                  }}
                  style={{ borderRadius: '8px' }}
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  style={{ 
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    border: 'none'
                  }}
                >
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default Rooms;
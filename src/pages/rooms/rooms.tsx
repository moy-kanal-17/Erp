import { useState, useEffect } from 'react';
import { Table, Typography, Button, Modal, Form, Input, message, Card } from 'antd';
import { roomService } from '../../service/rooms.service';
import type { Room } from '@types';
import { DeleteFilled, EditFilled } from '@ant-design/icons';

const { Title } = Typography;

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form] = Form.useForm();

  const fetchRooms = async (page = 1, limit = 3) => {
    try {
      const response = await roomService.getRooms({ page, limit });
      setRooms(response.rooms);
      setTotal(response.total);
    } catch (error) {
      message.error('😡 Couldn’t fetch rooms, shit’s broken!');
    }
  };

  useEffect(() => {
    fetchRooms(page, limit);
  }, [page, limit]);

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const showModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      form.setFieldsValue({
        name: room.name,
        capacity: room.capacity,
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
        message.success('🎉 Room updated like a boss!');
      } else {
        await roomService.createRoom(values);
        message.success('🚀 Room created, crushing it!');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchRooms(page, limit);
    } catch (error) {
      message.error('😡 Shit hit the fan, try again!');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete this room?',
      content: 'No going back, you sure?',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await roomService.deleteRoom(id);
          message.success('🗑 Room fucking trashed!');
          fetchRooms(page, limit);
        } catch (error) {
          message.error('😵 Couldn’t delete, something’s fucked!');
        }
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Room) => (
        <div>
          <Button type="primary"  size='small' onClick={() => showModal(record)}>
            <EditFilled />
          </Button>
          <Button type="dashed" size='small' danger onClick={() => handleDelete(record.id!)}>
            <DeleteFilled />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>Rooms</Title>
        <Button type="primary" style={{ background: '#1890ff', borderColor: '#1890ff' }} onClick={() => showModal()}>
          Create Room
        </Button>
      </div>
      {rooms.length === 0 ? (
        <p>No rooms found</p>
      ) : (
        <Table
          columns={columns}
          dataSource={rooms}
          rowKey={(row) => row.id!}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ['3', '5', '10'],
          }}
          onChange={handleTableChange}
          scroll={{ x: true }}
        />
      )}
      <Modal
        title={editingRoom ? 'Edit Room' : 'Create Room'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Room Name"
            rules={[{ required: true, message: 'Enter a room name!' }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: 'Enter capacity!' }]}
          >
            <Input type="number" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block style={{ background: '#1890ff', borderColor: '#1890ff' }}>
              {editingRoom ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Rooms;
import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, Table, Tag, Button, Space, Popconfirm, message, Skeleton, Alert } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, ArrowLeftOutlined, TeamOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeachersGroupById, useGroupTeacherActivate, useGroupTeacherDeactivate, useGroupTeacherDelete } from '@hooks';

const StyledContainer = styled(motion.div)`
  width: 100%;
  min-height: calc(100vh - 112px);
  padding: 2%;
  background: transparent;
`;

const StyledContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2%;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;

  @media (max-width: 991px) {
    flex-direction: column;
  }
`;

const StyledSidebarCard = styled(Card)`
  width: 25%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  padding: 2%;
  height: fit-content;

  @media (max-width: 991px) {
    width: 100%;
  }
`;

const StyledMainCard = styled(Card)`
  width: 75%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  @media (max-width: 991px) {
    width: 100%;
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .ant-table-thead > tr > th {
    background: #f0f2f5;
    color: #595959;
    font-size: 14px;
    font-weight: 600;
  }
  .ant-table-tbody > tr > td {
    color: #595959;
    font-size: 12px;
  }
`;

const StyledInfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #595959;
  margin-bottom: 8px;
`;

const SingleGroupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading: isGroupLoading, error } = useTeachersGroupById(Number(id));
  const activateTeacher = useGroupTeacherActivate();
  const deactivateTeacher = useGroupTeacherDeactivate();
  const deleteTeacher = useGroupTeacherDelete();
  const [submitting, setSubmitting] = useState<number | null>(null);

  // Debug logs
  console.log('Raw data from useTeachersGroupById:', data);
  console.log('isGroupLoading:', isGroupLoading);
  console.log('Error:', error);
  console.log('ID:', id);

  const groupData = {
    id: data?.group?.id || 0,
    name: data?.group?.name || '',
    start_date: data?.group?.start_date || '',
    end_date: data?.group?.end_date || '',
    start_time: data?.group?.start_time || '',
    end_time: data?.group?.end_time || '',
    status: data?.group?.status || '',
    course: data?.group?.course || {
      title: '',
      description: '',
      price: 0,
      duration: 0,
      lessons_in_a_week: 0,
      lesson_duration: 0,
      lessons_in_a_month: 0,
    },
    groupTeachers: data?.groupTeachers || [],
    groupStudents: data?.groupStudents || [],
    lessons: data?.lessons || [],
  };
  console.log('Processed groupData:', groupData);

  if (!id || isNaN(Number(id))) {
    return (
      <StyledContainer>
        <Alert message="Invalid group ID" type="error" showIcon />
      </StyledContainer>
    );
  }

  const handleActivate = async (id: number) => {
    try {
      setSubmitting(id);
      await activateTeacher.mutateAsync(id);
      message.success('✅ Teacher activated!');
    } catch (err) {
      message.error('❌ Error activating teacher!');
    } finally {
      setSubmitting(null);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      setSubmitting(id);
      await deactivateTeacher.mutateAsync(id);
      message.success('✅ Teacher deactivated!');
    } catch (err) {
      message.error('❌ Error deactivating teacher!');
    } finally {
      setSubmitting(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setSubmitting(id);
      await deleteTeacher.mutateAsync(id);
      message.success('✅ Teacher removed from group!');
    } catch (err) {
      message.error('❌ Error removing teacher!');
    } finally {
      setSubmitting(null);
    }
  };

  const teacherColumns = [
    {
      title: 'Teacher',
      key: 'teacher',
      render: (_: any, record: any) => (
        <span>{`${record.teacher?.first_name || 'N/A'} ${record.teacher?.last_name || ''}`}</span>
      ),
    },
    {
      title: 'Email',
      dataIndex: ['teacher', 'email'],
      key: 'email',
      render: (email: string) => email || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? '#52c41a' : '#f56a00'} style={{ fontSize: '12px', padding: '4px 8px' }}>
          {status ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status ? (
            <Button
              type="text"
              icon={<CloseCircleOutlined style={{ color: '#f56a00' }} />}
              onClick={() => handleDeactivate(record.id)}
              loading={submitting === record.id}
              style={{ color: '#595959' }}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              type="text"
              icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              onClick={() => handleActivate(record.id)}
              loading={submitting === record.id}
              style={{ color: '#595959' }}
            >
              Activate
            </Button>
          )}
          <Popconfirm
            title="Are you sure you want to remove this teacher from the group?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: '#f56a00' }} />}
              loading={submitting === record.id}
              style={{ color: '#595959' }}
            >
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const studentColumns = [
    {
      title: 'Student',
      key: 'student',
      render: (_: any, record: any) => (
        <span>{`${record.student?.first_name || 'N/A'} ${record.student?.last_name || ''}`}</span>
      ),
    },
    {
      title: 'Email',
      dataIndex: ['student', 'email'],
      key: 'email',
      render: (email: string) => email || 'N/A',
    },
  ];

  const lessonColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => title || 'N/A',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => notes || 'N/A',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (date ? new Date(date).toLocaleDateString('en-US') : 'N/A'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={status === 'completed' ? '#52c41a' : status === 'cancelled' ? '#f56a00' : '#1890ff'}
          style={{ fontSize: '12px', padding: '4px 8px' }}
        >
          {status || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Room',
      dataIndex: ['room', 'name'],
      key: 'room',
      render: (name: string) => name || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<EyeOutlined style={{ color: '#1890ff' }} />}
          onClick={() => navigate(`/teacher/lesson/${record.id}`)}
          style={{ color: '#595959' }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <StyledContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {error && <Alert message={`Error loading data: ${error.message}`} type="error" showIcon />}
      {!isGroupLoading && !data && (
        <Alert message="Group not found" type="error" showIcon />
      )}
      <StyledContentWrapper>
        {/* Sidebar */}
        <StyledSidebarCard>
          {isGroupLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} title={false} />
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#000' }}>{groupData.name || 'Unnamed Group'}</h2>
                <Tag color={groupData.status === 'new' ? '#f56a00' : '#52c41a'} style={{ fontSize: '12px', padding: '4px 8px' }}>
                  {groupData.status === 'new' ? 'New' : 'Active'}
                </Tag>
              </div>
              <Button
                type="text"
                icon={<ArrowLeftOutlined style={{ fontSize: '14px', color: '#1890ff' }} />}
                onClick={() => navigate('/teacher/groups')}
                style={{ color: '#595959', marginBottom: '12px', fontSize: '12px' }}
              >
                Back to Groups
              </Button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <StyledInfoItem>
                  <CalendarOutlined style={{ fontSize: '14px', color: '#1890ff', marginRight: '6px' }} />
                  Start: <span style={{ fontWeight: 500, marginLeft: '4px' }}>{groupData.start_date || 'N/A'}</span>
                </StyledInfoItem>
                <StyledInfoItem>
                  <CalendarOutlined style={{ fontSize: '14px', color: '#1890ff', marginRight: '6px' }} />
                  End: <span style={{ fontWeight: 500, marginLeft: '4px' }}>{groupData.end_date || 'N/A'}</span>
                </StyledInfoItem>
                <StyledInfoItem>
                  <ClockCircleOutlined style={{ fontSize: '14px', color: '#1890ff', marginRight: '6px' }} />
                  Time: <span style={{ fontWeight: 500, marginLeft: '4px' }}>{groupData.start_time && groupData.end_time ? `${groupData.start_time} - ${groupData.end_time}` : 'N/A'}</span>
                </StyledInfoItem>
                <StyledInfoItem>
                  Price: <span style={{ fontWeight: 500, marginLeft: '4px' }}>{groupData.course?.price?.toLocaleString() || '0'} sum</span>
                </StyledInfoItem>
              </div>
              <div style={{ marginTop: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>{groupData.course?.title || 'No Course'}</h3>
                <p style={{ fontSize: '12px', color: '#595959', marginTop: '4px' }}>{groupData.course?.description || 'No description'}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: '#595959', marginTop: '8px' }}>
                  <span>Duration: {groupData.course?.duration || 0} months</span>
                  <span>Lessons per week: {groupData.course?.lessons_in_a_week || 0}</span>
                  <span>Lesson duration: {groupData.course?.lesson_duration || 0} min</span>
                  <span>Lessons per month: {groupData.course?.lessons_in_a_month || 0}</span>
                </div>
              </div>
            </>
          )}
        </StyledSidebarCard>

        {/* Main Content */}
        <StyledMainCard>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#595959', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TeamOutlined style={{ color: '#1890ff' }} /> Teachers
            </h3>
            {isGroupLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} title={false} />
            ) : groupData.groupTeachers.length > 0 ? (
              <StyledTable
                columns={teacherColumns}
                dataSource={groupData.groupTeachers}
                rowKey="id"
                pagination={false}
                locale={{ emptyText: 'No teachers in group' }}
              />
            ) : (
              <p style={{ fontSize: '12px', color: '#595959' }}>No teachers assigned to this group.</p>
            )}
          </div>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#595959', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TeamOutlined style={{ color: '#1890ff' }} /> Students
            </h3>
            {isGroupLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} title={false} />
            ) : groupData.groupStudents.length > 0 ? (
              <StyledTable
                columns={studentColumns}
                dataSource={groupData.groupStudents}
                rowKey="id"
                pagination={false}
                locale={{ emptyText: 'No students in group' }}
              />
            ) : (
              <p style={{ fontSize: '12px', color: '#595959' }}>No students assigned to this group.</p>
            )}
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#595959', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarOutlined style={{ color: '#1890ff' }} /> Lessons
            </h3>
            {isGroupLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} title={false} />
            ) : groupData.lessons.length > 0 ? (
              <StyledTable
                columns={lessonColumns}
                dataSource={groupData.lessons}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'No lessons scheduled' }}
              />
            ) : (
              <p style={{ fontSize: '12px', color: '#595959' }}>No lessons scheduled for this group.</p>
            )}
          </div>
        </StyledMainCard>
      </StyledContentWrapper>
    </StyledContainer>
  );
};

export default SingleGroupPage;
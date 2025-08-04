import { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, Collapse, Skeleton, Button, Tag } from 'antd';
import { CalendarOutlined, ArrowLeftOutlined, TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroup } from '@hooks';
import GroupTeachers from '../../components/group/group-teachers';
import GroupLessons from '../../components/group/group-lessons';
import GroupStudents from '../../components/group/group-students';

const { Panel } = Collapse;

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

const StyledCollapse = styled(Collapse)`
  background: transparent;
  border: none;
`;

const StyledPanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #595959;
`;

const StyledInfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #595959;
  margin-bottom: 8px;
`;

const SingleGroup = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dataById, students, lessons, teachers, isLoading } = useGroup({ page: 1, limit: 10 }, Number(id));
  const groupData: any = dataById?.data?.group
    ? dataById.data.group
    : { course: { title: '', price: 0, description: '', duration: 0, lessons_in_a_week: 0, lesson_duration: 0 } };

  useEffect(() => {
    console.log('isLoading:', isLoading);
    console.log('students:', students);
    console.log('students?.data:', students?.data);
    console.log('lessons:', lessons);
    console.log('lessons?.data?.lessons:', lessons?.data?.lessons);
  }, [isLoading, students, lessons]);

  const lessonsList = lessons?.data?.lessons || [];

  return (
    <StyledContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledContentWrapper>
        {/* Sidebar */}
        <StyledSidebarCard>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} title={false} />
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#000' }}>{groupData.name || 'Unnamed Group'}</h2>
                {groupData.status === 'new' ? (
                  <Tag color="#f56a00" style={{ fontSize: '12px', padding: '4px 8px' }}>New</Tag>
                ) : (
                  <Tag color="#52c41a" style={{ fontSize: '12px', padding: '4px 8px' }}>Active</Tag>
                )}
              </div>
              <Button
                type="text"
                icon={<ArrowLeftOutlined style={{ fontSize: '14px' }} />}
                onClick={() => navigate('/admin/groups')}
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
                  Price: <span style={{ fontWeight: 500, marginLeft: '4px' }}>{groupData.course?.price?.toLocaleString() || 0} sum</span>
                </StyledInfoItem>
              </div>
              <div style={{ marginTop: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>{groupData.course?.title || 'No Course'}</h3>
                <p style={{ fontSize: '12px', color: '#595959', marginTop: '4px' }}>{groupData.course?.description || 'No description'}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: '#595959', marginTop: '8px' }}>
                  <span>Duration: {groupData.course?.duration || 0} month</span>
                  <span>Per week: {groupData.course?.lessons_in_a_week || 0} lesson</span>
                  <span>Lesson time: {groupData.course?.lesson_duration || 0} min</span>
                </div>
              </div>
            </>
          )}
        </StyledSidebarCard>

        {/* Main Content */}
        <StyledMainCard>
          <StyledCollapse defaultActiveKey={['1', '2', '3']} expandIconPosition="end">
            <Panel
              header={
                <StyledPanelHeader>
                  <TeamOutlined style={{ fontSize: '14px', color: '#1890ff' }} />
                  <h3>Teachers</h3>
                </StyledPanelHeader>
              }
              key="1"
              style={{ marginBottom: '12px' }}
            >
              {isLoading || !teachers?.data ? (
                <Skeleton active paragraph={{ rows: 4 }} title={false} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GroupTeachers teachers={teachers.data} />
                </motion.div>
              )}
            </Panel>
            <Panel
              header={
                <StyledPanelHeader>
                  <CalendarOutlined style={{ fontSize: '14px', color: '#1890ff' }} />
                  <h3>Lessons</h3>
                </StyledPanelHeader>
              }
              key="2"
              style={{ marginBottom: '12px' }}
            >
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 4 }} title={false} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GroupLessons lessons={lessonsList} />
                </motion.div>
              )}
            </Panel>
            <Panel
              header={
                <StyledPanelHeader>
                  <TeamOutlined style={{ fontSize: '14px', color: '#1890ff' }} />
                  <h3>Students</h3>
                </StyledPanelHeader>
              }
              key="3"
            >
              {isLoading || !students?.data ? (
                <Skeleton active paragraph={{ rows: 4 }} title={false} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GroupStudents students={students.data} id={id} />
                </motion.div>
              )}
            </Panel>
          </StyledCollapse>
        </StyledMainCard>
      </StyledContentWrapper>
    </StyledContainer>
  );
};

export default SingleGroup;
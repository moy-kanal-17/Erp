import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, Skeleton, Alert, Tag, Button } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getUserTokenFromToken } from '@helpers';

const fetchLessonById = async (id: number) => {
   const token= getUserTokenFromToken()
  const response = await axios.get(`https://erp-edu.uz/api/lessons/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('Lesson fetch response:', response);
  return response.data.lesson; 
};

const useLessonById = (id: number) => {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: () => fetchLessonById(id),
    enabled: !!id,
    refetchOnMount: 'always',
    retry: 1,
    staleTime: 0,
  });
};

const StyledContainer = styled(motion.div)`
  width: 100%;
  min-height: calc(100vh - 112px);
  padding: 2%;
  background: transparent;
`;

const StyledCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  margin: 0 auto;
`;

const StyledInfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #595959;
  margin-bottom: 12px;
`;

const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useLessonById(Number(id));

  // Debug logs
  console.log('Lesson data:', data);
  console.log('isLoading:', isLoading);
  console.log('Error:', error);
  console.log('ID:', id);

  if (!id || isNaN(Number(id))) {
    return (
      <StyledContainer>
        <Alert message="Invalid lesson ID" type="error" showIcon />
      </StyledContainer>
    );
  }

  const lessonData = data || {
    id: 0,
    title: '',
    notes: '',
    date: '',
    status: '',
    room: { id: 0, name: '' },
    group: { id: 0, name: '' },
  };

  return (
    <StyledContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {error && <Alert message={`Error loading lesson: ${error.message}`} type="error" showIcon />}
      {!isLoading && !data && <Alert message="Lesson not found" type="error" showIcon />}
      <StyledCard>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} title={false} />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#000' }}>{lessonData.title || 'Unnamed Lesson'}</h2>
              <Tag
                color={lessonData.status === 'completed' ? '#52c41a' : lessonData.status === 'cancelled' ? '#f56a00' : '#1890ff'}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                {lessonData.status || 'N/A'}
              </Tag>
            </div>
            <Button
              type="text"
              icon={<ArrowLeftOutlined style={{ fontSize: '14px', color: '#1890ff' }} />}
              onClick={() => navigate(`/teacher/groups/${lessonData.group?.id || ''}`)}
              style={{ color: '#595959', marginBottom: '16px', fontSize: '12px' }}
            >
              Back to Group
            </Button>
            <StyledInfoItem>
              <span style={{ fontWeight: 500, marginRight: '8px' }}>ID:</span> {lessonData.id || 'N/A'}
            </StyledInfoItem>
            <StyledInfoItem>
              <CalendarOutlined style={{ fontSize: '14px', color: '#1890ff', marginRight: '8px' }} />
              Date: <span style={{ fontWeight: 500, marginLeft: '4px' }}>{lessonData.date ? new Date(lessonData.date).toLocaleDateString('en-US') : 'N/A'}</span>
            </StyledInfoItem>
            <StyledInfoItem>
              <ClockCircleOutlined style={{ fontSize: '14px', color: '#1890ff', marginRight: '8px' }} />
              Time: <span style={{ fontWeight: 500, marginLeft: '4px' }}>{lessonData.group?.start_time && lessonData.group?.end_time ? `${lessonData.group.start_time} - ${lessonData.group.end_time}` : 'N/A'}</span>
            </StyledInfoItem>
            <StyledInfoItem>
              <span style={{ fontWeight: 500, marginRight: '8px' }}>Group:</span> {lessonData.group?.name || 'N/A'}
            </StyledInfoItem>
            <StyledInfoItem>
              <span style={{ fontWeight: 500, marginRight: '8px' }}>Room:</span> {lessonData.room?.name || 'N/A'}
            </StyledInfoItem>
            <StyledInfoItem>
              <span style={{ fontWeight: 500, marginRight: '8px' }}>Notes:</span> {lessonData.notes || 'N/A'}
            </StyledInfoItem>
          </>
        )}
      </StyledCard>
    </StyledContainer>
  );
};

export default LessonPage;
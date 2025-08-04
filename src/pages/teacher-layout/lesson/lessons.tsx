import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, Skeleton, Alert, Tag, Button, Table, Select } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { apiConfig } from '@api/config';
import { useState } from 'react';

// Define types
interface Lesson {
  id: number;
  title: string;
  notes: string;
  date: string;
  status: string;
  room: { id: number; name: string };
  group: { id: number; name: string; start_time: string; end_time: string };
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface GroupStudent {
  id: number;
  student?: Student; // Optional to handle null
  status: boolean;
  start_date: string;
  end_date: string;
}

interface GroupResponse {
  message: string;
  data: { isAttended: boolean; message: string };
  group: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    groupStudents: GroupStudent[];
    lessons: Lesson[];
  };
    groupStudents: GroupStudent[];

}

interface AttendanceData {
  studentId: number;
  status: 'came' | 'did not came' | 'late' | 'pending';
}

interface BulkAttendancePayload {
  lessonTitle: string;
  lessonId: number;
  students: AttendanceData[];
}

const fetchLessonById = async (id: number): Promise<Lesson> => {
  const response = await apiConfig().getRequest(`https://erp-edu.uz/api/lessons/${id}`);
  console.log('Lesson fetch response:', response);
  return response?.data.lesson;
};

const fetchGroupById = async (groupId: number): Promise<GroupResponse> => {
  const response = await apiConfig().getRequest(`https://erp-edu.uz/api/group/${groupId}/teacher`);
  console.log('Group fetch response:', response);
  return response?.data;
};

const submitBulkAttendance = async (payload: BulkAttendancePayload) => {
  const response = await apiConfig().postRequest('https://erp-edu.uz/api/attendance/bulk-update', payload);
  console.log('Bulk attendance submit response:', response);
  return response?.data;
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

const useGroupById = (groupId: number) => {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: () => fetchGroupById(groupId),
    enabled: !!groupId,
    retry: 1,
    staleTime: 0,
  });
};

const useSubmitBulkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitBulkAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group'] });
      queryClient.invalidateQueries({ queryKey: ['lesson'] });
    },
    onError: (error: unknown) => {
      console.error('Bulk attendance submit error:', error);
    },
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
  margin-bottom: 16px;
`;

const StyledInfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #595959;
  margin-bottom: 12px;
`;

const SubmitAllButton = styled(Button)`
  background: #1890ff;
  border-radius: 8px;
  margin-top: 16px;
`;

const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lessonId = Number(id);
  const { data: lessonData, isLoading: isLoadingLesson, error: lessonError } = useLessonById(lessonId);
  const { data: groupData, isLoading: isLoadingGroup, error: groupError } = useGroupById(lessonData?.group?.id || 0);
  const { mutate: submitBulkAttendanceMutate,  } = useSubmitBulkAttendance();
  const [attendanceData, setAttendanceData] = useState<Record<number, AttendanceData>>({});

  // Debug logs
  console.log('Lesson data:', lessonData);
  console.log('Group data:', groupData);
  console.log('isLoadingLesson:', isLoadingLesson);
  console.log('isLoadingGroup:', isLoadingGroup);
  console.log('Lesson Error:', lessonError);
  console.log('Group Error:', groupError);
  console.log('ID:', id);
  console.log('Attendance Data:', attendanceData);
  console.log('Invalid students:', groupData?.group.groupStudents.filter((student) => !student.student || !student.student.id));

  if (!id || isNaN(lessonId)) {
    return (
      <StyledContainer>
        <Alert message="Invalid lesson ID" type="error" showIcon />
      </StyledContainer>
    );
  }

  const defaultLessonData: Lesson = {
    id: 0,
    title: '',
    notes: '',
    date: '',
    status: '',
    room: { id: 0, name: '' },
    group: { id: 0, name: '', start_time: '', end_time: '' },
  };

  const lesson = lessonData || defaultLessonData;

  const handleAttendanceChange = (studentId: number, value: AttendanceData['status']) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        studentId,
        status: value,
      },
    }));
  };

  const handleSubmitAll = () => {
    if (!lessonData || !validStudents.length) {
      console.log('No lesson data or valid students to submit');
      return;
    }
    const payload: BulkAttendancePayload = {
      lessonTitle: lessonData.title,
      lessonId,
      students: validStudents
        .filter((student) => attendanceData[student.student!.id])
        .map((student) => ({
          studentId: student.student!.id,
          status: attendanceData[student.student!.id].status,
        })),
    };
    console.log('Bulk attendance payload:', payload);
    submitBulkAttendanceMutate(payload, {
      onSuccess: () => {
        setAttendanceData({}); // Clear after submission
      },
    });
  };

  const validStudents = groupData?.groupStudents.filter((student) => student.student && student.student.id) || [];

  const columns = [
    {
      title: 'ID',
      key: 'id',
      render: (_: any, record: GroupStudent) => record.student?.id || record.id,
      width: '10%',
    },
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: GroupStudent) =>
        record.student ? `${record.student.first_name} ${record.student.last_name || ''}` : 'Unknown Student',
      width: '40%',
    },
    {
      title: 'Attendance Status',
      key: 'status',
      render: (_: any, record: GroupStudent) => (
        <Select
          value={record.student ? attendanceData[record.student.id]?.status || 'pending' : undefined}
          onChange={(value) => record.student && handleAttendanceChange(record.student.id, value)}
          style={{ width: '100%' }}
          options={[
            { value: 'came', label: 'Came' },
            { value: 'did not came', label: 'Did Not Came' },
            { value: 'late', label: 'Late' },
            { value: 'pending', label: 'Pending' },
          ]}

          placeholder={record.student ? 'Select status' : 'N/A'}
        />
      ),
      width: '50%',
    },
  ];

  return (
    <StyledContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {(lessonError || groupError) && (
        <Alert
          message={lessonError?.message || groupError?.message || 'Error loading data'}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}
      {!isLoadingLesson && !lessonData && <Alert message="Lesson not found" type="error" showIcon style={{ marginBottom: '16px' }} />}
      {groupData?.data.isAttended && (
        <Alert
          message={groupData.data.message || 'Attendance for this lesson has already been taken.'}
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}
      <StyledCard>
        {isLoadingLesson ? (
          <Skeleton active paragraph={{ rows: 6 }} title={false} />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#000' }}>{lesson.title || 'Unnamed Lesson'}</h2>
              <Tag
                color={lesson.status === 'completed' ? '#52c41a' : lesson.status === 'cancelled' ? '#f56a00' : '#1890ff'}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                {lesson.status || 'N/A'}
              </Tag>
            </div>
            <Button
              type="text"
              icon={<ArrowLeftOutlined style={{ fontSize: '14px', color: '#1890ff' }} />}
              onClick={() => navigate(`/teacher/groups/${lesson.group?.id || ''}`)}
              style={{ color: '#595959', marginBottom: '16px', fontSize: '12px' }}
            >
              Back to Group
            </Button>
            <StyledInfoItem>
              <span style={{ fontWeight: 500, marginRight: '8px' }}>ID:</span> {lesson.id || 'N/A'}
            </StyledInfoItem>
            <StyledInfoItem>
              <CalendarOutlined style={{ fontSize: '14px', color: '#1890ff', marginRight: '8px' }} />
              Date: <span style={{ fontWeight: 500, marginLeft: '4px' }}>{lesson.date ? new Date(lesson.date).toLocaleDateString('en-US') : 'N/A'}</span>
            </StyledInfoItem>
            <StyledInfoItem>
              <ClockCircleOutlined style={{ fontSize: '14px', color: '#1890ff', marginRight: '8px' }} />
              Time: <span style={{ fontWeight: 500, marginLeft: '4px' }}>{lesson.group?.start_time && lesson.group?.end_time ? `${lesson.group.start_time} - ${lesson.group.end_time}` : 'N/A'}</span>
            </StyledInfoItem>
            <StyledInfoItem>
              <span style={{ fontWeight: 500, marginRight: '8px' }}>Group:</span> {lesson.group?.name || 'N/A'}
            </StyledInfoItem>
            <StyledInfoItem>
              <span style={{ fontWeight: 500, marginRight: '8px' }}>Room:</span> {lesson.room?.name || 'N/A'}
            </StyledInfoItem>
            <StyledInfoItem>
              <span style={{ fontWeight: 500, marginRight: '8px' }}>Notes:</span> {lesson.notes || 'N/A'}
            </StyledInfoItem>
          </>
        )}
      </StyledCard>
      <StyledCard title="Attendance">
        {isLoadingGroup ? (
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        ) : validStudents.length >= 0 ? (
          <>
            <Table
              columns={columns}
              dataSource={validStudents.map((student) => ({ ...student, key: student.student?.id || student.id }))}
              pagination={false}
              rowKey={(record) => record.student?.id?.toString() || record.id.toString()}
              style={{ marginTop: '16px' }}
            />
            <SubmitAllButton
              type="primary"
              onClick={handleSubmitAll}
              // disabled={isSubmittingAttendance || groupData?.data.isAttended || !Object.keys(attendanceData).length}
            >
              Submit All Attendance
            </SubmitAllButton>
          </>
        ) : (
          <Alert
            message="No valid students found in this group"
            description="Some student records may be missing or incomplete. Try adding students to the group."
            type="warning"
            showIcon
          />
        )}
      </StyledCard>
    </StyledContainer>
  );
};

export default LessonPage;
import  { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Collapse, Skeleton, Button } from 'antd';
import { Calendar, Clock, ArrowLeft, Users } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroup } from '@hooks';
import GroupTeachers from '../../components/group/group-teachers';
import GroupLessons from '../../components/group/group-lessons';
import GroupStudents from '../../components/group/group-students';

const { Panel } = Collapse;

const SingleGroup = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dataById, students, lessons, teachers, isLoading } = useGroup({ page: 1, limit: 10 }, Number(id));
  const groupData: any = dataById?.data?.group
    ? dataById.data.group
    : { course: { title: '', price: 0, description: '', duration: 0, lessons_in_a_week: 0, lesson_duration: 0 } };

  // Отладка данных lessons
  useEffect(() => {
    console.log('isLoading:', isLoading);
    console.log('lessons:', lessons);
    console.log('lessons?.data?.lessons:', lessons?.data?.lessons);

  }, [isLoading, lessons]);

  // Гибкая проверка lessons
  const lessonsList = lessons?.data?.lessons  || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 min-h-screen p-4 sm:p-6"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <Card className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4">
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} title={false} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">{groupData.name || 'Unnamed Group'}</h2>
                {groupData.status === 'new' ? (
                  <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">New</span>
                ) : (
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Active</span>
                )}
              </div>
              <Button
                type="text"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate('/admin/groups')}
                className="text-gray-600 hover:text-gray-800 mb-3"
              >
                Back to Groups
              </Button>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-blue-500" />
                  Start: <span className="font-medium ml-1">{groupData.start_date || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-blue-500" />
                  End: <span className="font-medium ml-1">{groupData.end_date || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-blue-500" />
                  Time: <span className="font-medium ml-1">{groupData.start_time && groupData.end_time ? `${groupData.start_time} - ${groupData.end_time}` : 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  Price: <span className="font-medium ml-1">{groupData.course?.price?.toLocaleString() || 0} sum</span>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-semibold text-gray-800">{groupData.course?.title || 'No Course'}</h3>
                <p className="text-xs text-gray-600 mt-1">{groupData.course?.description || 'No description'}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-2">
                  <span>Duration: {groupData.course?.duration || 0} month</span>
                  <span>Per week: {groupData.course?.lessons_in_a_week || 0} lesson</span>
                  <span>Lesson time: {groupData.course?.lesson_duration || 0} min</span>
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Main Content */}
        <Card className="w-full md:w-3/4 bg-white rounded-lg shadow-md overflow-hidden">
          <Collapse
            defaultActiveKey={['1', '2', '3']}
            expandIconPosition="end"
            className="bg-transparent border-none"
            style={{ background: 'transparent' }}
          >
            <Panel
              header={
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-700">Teachers</h3>
                </div>
              }
              key="1"
              className="mb-3"
            >
              {isLoading || !teachers?.data ? (
                <Skeleton active paragraph={{ rows: 4 }} title={false} />
              ) : teachers.data.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GroupTeachers teachers={teachers.data} />
                </motion.div>
              ) : (
                <p className="text-gray-500 text-xs">No teachers assigned to this group.</p>
              )}
            </Panel>
            <Panel
              header={
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-700">Lessons</h3>
                </div>
              }
              key="2"
              className="mb-3"
            >
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 4 }} title={false} />
              ) : lessonsList.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >

                  <GroupLessons lessons={lessonsList} />
                </motion.div>
              ) : (
                <p className="text-gray-500 text-xs">No lessons scheduled for this group.</p>
              )}
            </Panel>
            <Panel
              header={
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-700">Students</h3>
                </div>
              }
              key="3"
            >
              {isLoading || !students?.data ? (
                <Skeleton active paragraph={{ rows: 4 }} title={false} />
              ) : students.data.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GroupStudents students={students.data} id={id} />
                </motion.div>
              ) : (
                <p className="text-gray-500 text-xs">No students assigned to this group.</p>
              )}
            </Panel>
          </Collapse>
        </Card>
      </div>
    </motion.div>
  );
};

export default SingleGroup;
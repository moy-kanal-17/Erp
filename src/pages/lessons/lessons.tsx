import  { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Select, Button, Tag, Tooltip } from 'antd';
import { Calendar, Plus,  ChevronLeft, ChevronRight } from 'lucide-react';
import type { GroupLessonsType, Lesson } from '../../types/lessons';
import { lessonsService } from '@service';
import { Notification } from '@helpers';
import LessonModal from './lessonModal';
import { DeleteFilled, EditFilled } from '@ant-design/icons';

const { Option } = Select;

const getStylesByStatus = (status: string) => {
  const s = status.toLowerCase();
  const base =
    'inline-block w-40 h-32 p-3 rounded-lg border cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-white m-1.5';

  switch (s) {
    case 'cancelled':
    case 'bekor qilingan':
      return {
        container: `${base} border-red-200 text-red-700 hover:shadow-red-100`,
        tag: 'bg-red-500 text-white',
        tooltipColor: '#ff4d4f',
        tooltipText: '#fff',
      };
    case 'completed':
    case 'tugagan':
      return {
        container: `${base} border-green-200 text-green-700 hover:shadow-green-100`,
        tag: 'bg-green-500 text-white',
        tooltipColor: '#52c41a',
        tooltipText: '#fff',
      };
    case 'in_progress':
      return {
        container: `${base} border-yellow-200 text-yellow-700 hover:shadow-yellow-100`,
        tag: 'bg-yellow-500 text-white',
        tooltipColor: '#faad14',
        tooltipText: '#000',
      };
    case 'new':
    case 'yangi':
      return {
        container: `${base} border-blue-200 text-blue-700 hover:shadow-blue-100`,
        tag: 'bg-blue-500 text-white',
        tooltipColor: '#1890ff',
        tooltipText: '#fff',
      };
    default:
      return {
        container: `${base} border-gray-200 text-gray-700 hover:shadow-gray-100`,
        tag: 'bg-gray-500 text-white',
        tooltipColor: '#d9d9d9',
        tooltipText: '#000',
      };
  }
};

const GroupLessons = ({ lessons }: GroupLessonsType) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredLessons = filterStatus === 'all'
    ? lessons
    : lessons.filter(lesson => lesson.status.toLowerCase() === filterStatus.toLowerCase());

  const sortedLessons = [...filteredLessons].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const goNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const isStartDisabled = () => !containerRef.current || scrollPosition <= 5;
  const isEndDisabled = () =>
    !containerRef.current ||
    scrollPosition + containerRef.current.clientWidth >= containerRef.current.scrollWidth - 5;

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setModalOpen(true);
  };

  const deleteLesson = async (id: number) => {
    try {
      const res = await lessonsService.deleteLessons(id);
      if (!res) {
        throw new Error('Error deleting lesson');
      }
      Notification('success', 'Lesson Deleted', `Lesson with ID ${id} deleted successfully`);
    } catch (error) {
      Notification('error', 'Error Delete!', `Error in deleting lesson by ID ${id}`);
      console.error(error);
    }
  };

  const formatDayAndMonth = (date: string) => {
    const newDate = date.split('T')[0];
    const [_, month, day] = newDate.split('-');
    return `${day}.${month}`;
  };

  return (
    <Card className="w-full rounded-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-3 lesson-header">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-md">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white !text-white">Lessons</h2>
              <p className="text-xs text-white/80 !text-white/80">Group lessons</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select
              defaultValue="all"
              onChange={setFilterStatus}
              className="w-32"
              size="middle"
            >
              <Option value="all">All ({lessons.length})</Option>
              <Option value="new">New ({lessons.filter(l => ['new', 'yangi'].includes(l.status.toLowerCase())).length})</Option>
              <Option value="completed">Completed! ({lessons.filter(l => ['completed', 'tugagan'].includes(l.status.toLowerCase())).length})</Option>
              <Option value="in_progress">In Progress ({lessons.filter(l => l.status.toLowerCase() === 'in_progress').length})</Option>
              <Option value="cancelled">Canceled ({lessons.filter(l => ['cancelled', 'bekor qilingan'].includes(l.status.toLowerCase())).length})</Option>
            </Select>
            <Select
              defaultValue="asc"
              onChange={setSortOrder}
              className="w-32"
              size="middle"
            >
              <Option value="asc">Sort by Date (Asc)</Option>
              <Option value="desc">Sort by Date (Desc)</Option>
            </Select>
            <Button
              type="primary"
              icon={<Plus className="w-3 h-3" />}
              onClick={() => setModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 h-8"
              size="middle"
            >
              Add Lesson
            </Button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white bg-white/10 rounded-md p-3">
          <span>All: <strong>{lessons.length}</strong></span>
          <span>
            <Tag color="green">Completed!</Tag> {lessons.filter(l => ['completed', 'tugagan'].includes(l.status.toLowerCase())).length}
          </span>
          <span>
            <Tag color="red">Canceled</Tag> {lessons.filter(l => ['cancelled', 'bekor qilingan'].includes(l.status.toLowerCase())).length}
          </span>
          <span>
            <Tag color="yellow">In Progress</Tag> {lessons.filter(l => l.status.toLowerCase() === 'in_progress').length}
          </span>
          <span>
            <Tag color="blue">New</Tag> {lessons.filter(l => ['new', 'yangi'].includes(l.status.toLowerCase())).length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex items-center gap-3">
        <Button
          type="primary"
          icon={<ChevronLeft className="w-3 h-3" />}
          onClick={goPrev}
          disabled={isStartDisabled()}
          className="bg-blue-500 hover:bg-blue-600 h-8 w-8 flex items-center justify-center"
          size="middle"
        />
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <motion.div
            className="flex gap-1 p-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {sortedLessons.length > 0 ? (
              sortedLessons.map((lesson, index) => {
                const styles = getStylesByStatus(lesson.status);
                const dateInfo = formatDayAndMonth(lesson.date);
                return (
                  <Tooltip
                    key={lesson.id || index}
                    title={lesson.notes}
                    color={styles.tooltipColor}
                    overlayInnerStyle={{ color: styles.tooltipText }}
                  >
                    <motion.div
                      className={styles.container}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-xs font-bold">{dateInfo}</div>
                          <div className="text-[10px] font-medium text-gray-600">{lesson.title || 'No title'}</div>
                        </div>
                        <Tag className={`${styles.tag} text-[10px]`}>{lesson.status || 'Unknown'}</Tag>
                      </div>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="small"
                          icon={<EditFilled className="w-3 h-3" />}
                          onClick={() => handleEdit(lesson)}
                          className="h-6"
                        />
                        <Button
                          size="small"
                          icon={<DeleteFilled className="w-3 h-3" />}
                          onClick={() => deleteLesson(lesson.id)}
                          className="h-6"
                          danger
                        />
                      </div>
                    </motion.div>
                  </Tooltip>
                );
              })
            ) : (
              <p className="text-gray-500 text-xs text-center w-full">No lessons found for this filter.</p>
            )}
          </motion.div>
        </div>
        <Button
          type="primary"
          icon={<ChevronRight className="w-3 h-3" />}
          onClick={goNext}
          disabled={isEndDisabled()}
          className="bg-blue-500 hover:bg-blue-600 h-8 w-8 flex items-center justify-center"
          size="middle"
        />
      </div>

      <LessonModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingLesson(null);
        }}
        onSubmit={(updatedLesson) => {
          console.log('Edited lesson:', updatedLesson);
          setModalOpen(false);
          setEditingLesson(null);
        }}
        initialData={editingLesson}
      />
    </Card>
  );
};

export default GroupLessons;
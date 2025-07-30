import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Select, Tag } from 'antd';
import { Calendar } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  notes: string;
  date: string;
  status: 'new' | 'completed' | 'in_progress' | 'cancelled' | 'yangi' | 'tugagan' | 'bekor qilingan';
}

interface GroupLessonsProps {
  lessons: Lesson[];
}

const GroupLessons: React.FC<GroupLessonsProps> = ({ lessons }) => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Фильтрация уроков
  const filteredLessons = useMemo(() => {
    if (!statusFilter) return lessons;
    return lessons.filter(lesson => lesson.status === statusFilter);
  }, [lessons, statusFilter]);

  // Статистика по статусам
  const stats = useMemo(() => {
    const counts: Record<string, number> = {
      new: 0,
      completed: 0,
      in_progress: 0,
      cancelled: 0,
      yangi: 0,
      tugagan: 0,
      bekor_qilingan: 0,
    };
    lessons.forEach(lesson => {
      counts[lesson.status] = (counts[lesson.status] || 0) + 1;
    });
    return counts;
  }, [lessons]);

  // Опции для фильтра
  const statusOptions = [
    { label: 'All', value: null },
    { label: 'New', value: 'new' },
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Yangi', value: 'yangi' },
    { label: 'Tugagan', value: 'tugagan' },
    { label: 'Bekor qilingan', value: 'bekor_qilingan' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Фильтр */}
      <div className="flex items-center gap-2">
        <Select
          defaultValue={null}
          onChange={value => setStatusFilter(value)}
          options={statusOptions}
          className="w-40"
          placeholder="Filter by status"
        />
      </div>

      {/* Статистика */}
      <div className="lesson-stats flex flex-wrap gap-2 text-xs text-black">
        <span>Total: {lessons.length}</span>
        <Tag color="blue">New: {stats.new}</Tag>
        <Tag color="green">Completed: {stats.completed}</Tag>
        <Tag color="orange">In Progress: {stats.in_progress}</Tag>
        <Tag color="red">Cancelled: {stats.cancelled}</Tag>
        <Tag color="purple">Yangi: {stats.yangi}</Tag>
        <Tag color="cyan">Tugagan: {stats.tugagan}</Tag>
        <Tag color="gray">Bekor qilingan: {stats.bekor_qilingan}</Tag>
      </div>

      {/* Список уроков с горизонтальной прокруткой */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
          {filteredLessons.map(lesson => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-64 bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-800">{lesson.title}</h4>
                <Tag
                  color={
                    lesson.status === 'new' || lesson.status === 'yangi'
                      ? 'blue'
                      : lesson.status === 'completed' || lesson.status === 'tugagan'
                      ? 'green'
                      : lesson.status === 'in_progress'
                      ? 'orange'
                      : 'red'
                  }
                >
                  {lesson.status}
                </Tag>
              </div>
              <div className="flex items-center text-xs text-gray-600 mb-2">
                <Calendar className="w-4 h-4 mr-1.5 text-blue-500" />
                {new Date(lesson.date).toLocaleDateString()}
              </div>
              <p className="text-xs text-gray-500">{lesson.notes || 'No notes'}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GroupLessons;
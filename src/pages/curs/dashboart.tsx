import { useState } from 'react';
import {
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  Settings,
  Search,
  Bell,
} from 'lucide-react';
import { useCourse, useBranch, useStudents } from '../../hooks';
import type { ParamsType } from '@types';

interface Course {
  id: number;
  title: string;
  students: number;
  progress: number;
  category: string;
}

interface Branch {
  id: number;
  name: string;
  students: number;
  courses: number;
  status: string;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const params: ParamsType = { page: 1, limit: 10 };


  const { data: courseResp } = useCourse(params);
  const courseData: Course[] = courseResp || [];


  const { data: branchResp } = useBranch(params);
  const branchData: Branch[] = branchResp?.branch || [];


  const { data: studentResp } = useStudents(params);
  const totalStudents: number = studentResp?.data.total || 0;

  const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}
            {change}% from last month
          </p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const CourseCard = ({ course }: { course: Course }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{course.title}</h3>
          <p className="text-sm text-gray-600">{course.category}</p>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {course.students} students
        </span>
      </div>
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Dashboard Panel</h1>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search courses, branches..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['overview', 'branches', 'courses', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Users} title="Total Students" value={totalStudents} change={12} color="bg-blue-500" />
              <StatCard icon={BookOpen} title="Active Courses" value={courseData.length} change={8} color="bg-green-500" />
              <StatCard icon={BarChart3} title="Branches" value={branchData.length} change={0} color="bg-purple-500" />
              <StatCard icon={TrendingUp} title="Completion Rate" value="78%" change={5} color="bg-orange-500" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Popular Courses</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View all</button>
                </div>
              </div>
              <div className="p-6">
                {courseData.length === 0 ? (
                  <p>No courses found</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {courseData.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Branch Performance</h2>
              </div>
              <div className="p-6">
                {branchData.length === 0 ? (
                  <p>No branches found</p>
                ) : (
                  <div className="space-y-4">
                    {branchData.map((branch) => (
                      <div key={branch.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{branch.name}</h3>
                          <p className="text-sm text-gray-600">
                            {branch.students} students • {branch.courses} courses
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {branch.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">All Branches</h2>
            </div>
            <div className="p-6">
              {branchData.length === 0 ? (
                <p>No branches found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {branchData.map((branch) => (
                    <div key={branch.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{branch.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Students: {branch.students}</p>
                        <p>Courses: {branch.courses}</p>
                        <p>Status: <span className="capitalize">{branch.status}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">All Courses</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <span>Add Course</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseData.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">Advanced analytics and reporting features coming soon!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

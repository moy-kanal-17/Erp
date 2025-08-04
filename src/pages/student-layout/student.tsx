import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Award, 
  Bell, 
  Settings, 
  ChevronRight,
  Clock,
  TrendingUp,
  MessageSquare,
  Search,
  Filter,
  Camera,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  UserCircle,
  Lock
} from 'lucide-react';
import { apiConfig } from '@api/config';
import { getUserIdFromToken } from '@helpers';
import { Alert, Skeleton } from 'antd';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useProfile } from '@hooks';

// Define types
interface Course {
  id: number;
  name: string;
  progress: number;
  grade: string;
  color?: string;
}

interface Assignment {
  id: number;
  title: string;
  due_date: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
}

interface Grade {
  id: number;
  subject: string;
  assignment: string;
  grade: string;
  date: string;
}

interface StudentData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  courses: Course[];
  assignments: Assignment[];
  grades: Grade[];
}

const fetchStudentData = async (id: number): Promise<StudentData> => {
  const response = await apiConfig().getRequest(`https://erp-edu.uz/api/students/${id}`);
  console.log('Student fetch response:', response);
  return response?.data.student;
};

const useStudentData = (id: number) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => fetchStudentData(id),
    enabled: !!id,
    retry: 1,
    staleTime: 0,
  });
};

const StyledContainer = styled(motion.div)`
  min-height: calc(100vh - 112px);
  padding: 2%;
  background: linear-gradient(135deg, #e6f0ff 0%, #fff 50%, #f3e8ff 100%);
`;

const StyledCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  padding: 24px;
  margin-bottom: 16px;
`;

const TabButton = ({ id, label, icon: Icon, isActive, onClick }: { id: string; label: string; icon: any; isActive: boolean; onClick: (id: string) => void }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string; value: string; icon: any; color: string; trend?: string }) => (
  <StyledCard className="hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-green-500 text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </StyledCard>
);

const CourseCard = ({ course }: { course: Course }) => (
  <StyledCard className="hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${course.color}`}></div>
        <h3 className="font-semibold text-gray-900">{course.name}</h3>
      </div>
      <span className="text-2xl font-bold text-gray-900">{course.grade}</span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Progress</span>
        <span className="font-medium text-gray-900">{course.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${course.color} transition-all duration-500`}
          style={{ width: `${course.progress}%` }}
        ></div>
      </div>
    </div>
    <button className="mt-4 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-50 group-hover:text-blue-600">
      View Details
      <ChevronRight size={16} />
    </button>
  </StyledCard>
);

const AssignmentItem = ({ assignment }: { assignment: Assignment }) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <StyledCard className="hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{assignment.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{assignment.subject}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-md border ${priorityColors[assignment.priority]}`}>
            {assignment.priority}
          </span>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              Due in {new Date(assignment.due_date).toLocaleDateString('en-US')}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Clock size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500">Reminder set</span>
            </div>
          </div>
        </div>
      </div>
    </StyledCard>
  );
};

const Student: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications] = useState(3);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    profile, 
    isLoading: isLoadingProfile, 
    isError: isProfileError, 
    error: profileError,
    updateProfile,
    isUpdatingProfile,
    updatePassword,
    isUpdatingPassword,
    updateAvatar,
    isUpdatingAvatar
  } = useProfile('students');
  
  const id = getUserIdFromToken();
  const { data: studentData, isLoading: isLoadingStudent, isError: isStudentError, error: studentError } = useStudentData(id || 0);

  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    bio: profile?.bio || ''
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    password: '',
    confirm_password: ''
  });

  // Update form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    updatePassword(passwordData);
    setPasswordData({ old_password: '', password: '', confirm_password: '' });
    setIsChangingPassword(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatar(file);
    }
  };

  // Debug logs
  console.log('Profile data:', profile);
  console.log('Student data:', studentData);
  console.log('isLoadingProfile:', isLoadingProfile);
  console.log('isLoadingStudent:', isLoadingStudent);
  console.log('Profile Error:', profileError);
  console.log('Student Error:', studentError);

  // Map colors to courses
  const courseColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
  const enhancedCourses = studentData?.courses?.map((course, index) => ({
    ...course,
    color: courseColors[index % courseColors.length]
  })) || [];

  return (
    <StyledContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <User size={20} className="text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Welcome back, {profile?.first_name || 'Student'}!
                </h1>
                <p className="text-sm text-gray-600">Ready to continue learning?</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search courses, assignments..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Handling */}
        {(isProfileError || isStudentError) && (
          <Alert
            message={profileError?.message || studentError?.message || 'Error loading data'}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}
        {(isLoadingProfile || isLoadingStudent) && (
          <StyledCard>
            <Skeleton active paragraph={{ rows: 6 }} title={false} />
          </StyledCard>
        )}

        {/* Navigation Tabs */}
        {!isLoadingProfile && !isLoadingStudent && (
          <>
            <StyledCard className="p-1">
              <div className="flex gap-2">
                <TabButton 
                  id="overview" 
                  label="Overview" 
                  icon={BookOpen} 
                  isActive={activeTab === 'overview'} 
                  onClick={setActiveTab} 
                />
                <TabButton 
                  id="courses" 
                  label="Courses" 
                  icon={BookOpen} 
                  isActive={activeTab === 'courses'} 
                  onClick={setActiveTab} 
                />
                <TabButton 
                  id="assignments" 
                  label="Assignments" 
                  icon={Calendar} 
                  isActive={activeTab === 'assignments'} 
                  onClick={setActiveTab} 
                />
                <TabButton 
                  id="grades" 
                  label="Grades" 
                  icon={Award} 
                  isActive={activeTab === 'grades'} 
                  onClick={setActiveTab} 
                />
                <TabButton 
                  id="profile" 
                  label="Profile" 
                  icon={UserCircle} 
                  isActive={activeTab === 'profile'} 
                  onClick={setActiveTab} 
                />
              </div>
            </StyledCard>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    title="Email" 
                    value={studentData?.email || 'N/A'} 
                    icon={Award} 
                    color="bg-green-400" 
                    trend={studentData?.email || undefined}
                  />
                  <StatCard 
                    title="Active Courses" 
                    value={studentData?.courses?.length.toString() || '0'} 
                    icon={BookOpen} 
                    color="bg-blue-500" 
                  />
                  <StatCard 
                    title="Pending Tasks" 
                    value={studentData?.assignments?.length.toString() || '0'} 
                    icon={Calendar} 
                    color="bg-orange-500" 
                  />
                  <StatCard 
                    title="Messages" 
                    value="12"
                    icon={MessageSquare} 
                    color="bg-purple-500" 
                  />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Courses Overview */}
                  <div className="lg:col-span-2">
                    <StyledCard>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
                      </div>
                      {enhancedCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {enhancedCourses.slice(0, 4).map(course => (
                            <CourseCard key={course.id} course={course} />
                          ))}
                        </div>
                      ) : (
                        <Alert message="No courses found" type="info" showIcon />
                      )}
                    </StyledCard>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Upcoming Assignments */}
                    <StyledCard>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Upcoming Deadlines</h3>
                        <Filter size={16} className="text-gray-400" />
                      </div>
                      {studentData?.assignments?.length ? (
                        <div className="space-y-3">
                          {studentData.assignments.map(assignment => (
                            <AssignmentItem key={assignment.id} assignment={assignment} />
                          ))}
                        </div>
                      ) : (
                        <Alert message="No upcoming assignments" type="info" showIcon />
                      )}
                    </StyledCard>

                    {/* Recent Grades */}
                    <StyledCard>
                      <h3 className="font-bold text-gray-900 mb-4">Recent Grades</h3>
                      {studentData?.grades?.length ? (
                        <div className="space-y-4">
                          {studentData.grades.map((grade) => (
                            <div key={grade.id} className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{grade.assignment}</p>
                                <p className="text-xs text-gray-600">{grade.subject}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-lg text-gray-900">{grade.grade}</span>
                                <p className="text-xs text-gray-500">{new Date(grade.date).toLocaleDateString('en-US')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Alert message="No recent grades" type="info" showIcon />
                      )}
                    </StyledCard>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <StyledCard>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit size={16} />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isUpdatingProfile}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <Save size={16} />
                          {isUpdatingProfile ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Avatar Section */}
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                          {profile?.avatar_url ? (
                            <img 
                              src={profile.avatar_url} 
                              alt="Avatar" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            `${profile?.first_name?.[0] || 'U'}${profile?.last_name?.[0] || 'S'}`
                          )}
                        </div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUpdatingAvatar}
                          className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          <Camera size={16} />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {profile?.first_name} {profile?.last_name}
                      </h3>
                      <p className="text-gray-600">{profile?.email}</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <div className={`w-2 h-2 rounded-full ${profile?.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-600">
                          {profile?.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Profile Form */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{profile?.first_name}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{profile?.last_name}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Mail size={16} />
                          Email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{profile?.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Phone size={16} />
                          Phone
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{profile?.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <MapPin size={16} />
                          Address
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{formData.address || 'Not provided'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        {isEditing ? (
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900">{formData.bio || 'No bio provided'}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                          <p className="text-gray-900 font-medium capitalize">{profile?.gender}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                          <p className="text-gray-900 font-medium">
                            {profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </StyledCard>

                {/* Password Change Section */}
                <StyledCard>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Lock size={20} />
                      Change Password
                    </h3>
                    {!isChangingPassword ? (
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Change Password
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleChangePassword}
                          disabled={isUpdatingPassword}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                        <button
                          onClick={() => setIsChangingPassword(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {isChangingPassword && (
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          name="old_password"
                          value={passwordData.old_password}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          name="password"
                          value={passwordData.password}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirm_password"
                          value={passwordData.confirm_password}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </StyledCard>
              </div>
            )}

            {/* Other Tabs */}
            {activeTab === 'courses' && (
              <StyledCard>
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Courses</h2>
                {enhancedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enhancedCourses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <Alert message="No courses found" type="info" showIcon />
                )}
              </StyledCard>
            )}
            {activeTab === 'assignments' && (
              <StyledCard>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Assignments</h2>
                {studentData?.assignments?.length ? (
                  <div className="space-y-3">
                    {studentData.assignments.map(assignment => (
                      <AssignmentItem key={assignment.id} assignment={assignment} />
                    ))}
                  </div>
                ) : (
                  <Alert message="No upcoming assignments" type="info" showIcon />
                )}
              </StyledCard>
            )}
            {activeTab === 'grades' && (
              <StyledCard>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Grades</h2>
                {studentData?.grades?.length ? (
                  <div className="space-y-4">
                    {studentData.grades.map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{grade.assignment}</p>
                          <p className="text-xs text-gray-600">{grade.subject}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg text-gray-900">{grade.grade}</span>
                          <p className="text-xs text-gray-500">{new Date(grade.date).toLocaleDateString('en-US')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert message="No recent grades" type="info" showIcon />
                )}
              </StyledCard>
            )}
          </>
        )}
      </div>
    </StyledContainer>
  );
};

export default Student;
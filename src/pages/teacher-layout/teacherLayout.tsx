import  { useState } from 'react';
import { 
  User, 

  Calendar, 
  Shield, 
  Edit3, 
  Camera, 
  Save, 
  X, 
  Settings, 
  Bell, 
  Lock, 
  Home,
  Search,
  Menu,
  LogOut,
  BookOpen,
  Award,
  Clock,
  Users
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, ] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@school.edu',
    phone: '+1 (555) 123-4567',
    address: '123 Education St, Academic City, AC 12345',
    role: 'Senior Mathematics Teacher',
    department: 'Mathematics & Sciences',
    joinDate: '2019-09-01',
    employeeId: 'TCH-2019-001',
    bio: 'Passionate educator with over 8 years of experience in mathematics and science education. Committed to fostering critical thinking and problem-solving skills in students.',
    qualifications: ['M.Ed in Mathematics', 'B.Sc in Applied Mathematics', 'Teaching Certification']
  });
  const navigate = Navigate;

  const [tempData, setTempData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field:string , value:string ) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    navigate({ to: '/' });
    console.log('Logging out...');
  };

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'courses', label: 'My Courses', icon: BookOpen },
    { key: 'settings', label: 'Settings', icon: Settings }
  ];

  const stats = [
    { label: 'Students Taught', value: '245', icon: Users, color: 'bg-blue-500' },
    { label: 'Courses', value: '8', icon: BookOpen, color: 'bg-green-500' },
    { label: 'Years Experience', value: '8+', icon: Award, color: 'bg-purple-500' },
    { label: 'Classes This Week', value: '24', icon: Clock, color: 'bg-orange-500' }
  ];

  const ProfileField = ({
    label,
    value,
    field,
    type = 'text',
    editable = true
  }: {
    label: string;
    value: string;
    field: keyof typeof profileData;
    type?: string;
    editable?: boolean;
  }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {isEditing && editable ? (
        type === 'textarea' ? (
          <textarea
            value={tempData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        ) : (
          <input
            type={type}
            value={tempData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )
      ) : (
        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{value}</p>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              🎓
            </div>
            {!sidebarCollapsed && (
              <span className="ml-3 text-xl font-semibold">Teacher ERP</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => navigate({to: `/teacher/${item.key}`})}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                      activeTab === item.key
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ACADEMIC YEAR: 2024-2025
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="px-6 pb-6">
                <div className="flex items-end -mt-16 mb-4">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold text-gray-600">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </div>
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="ml-6 flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    <p className="text-xl text-gray-600">{profileData.role}</p>
                    <p className="text-gray-500">{profileData.department}</p>
                  </div>
                  <div className="flex space-x-3">
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSave}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField 
                    label="First Name" 
                    value={profileData.firstName} 
                    field="firstName" 
                  />
                  <ProfileField 
                    label="Last Name" 
                    value={profileData.lastName} 
                    field="lastName" 
                  />
                  <ProfileField 
                    label="Email Address" 
                    value={profileData.email} 
                    field="email" 
                    type="email" 
                  />
                  <ProfileField 
                    label="Phone Number" 
                    value={profileData.phone} 
                    field="phone" 
                    type="tel" 
                  />
                </div>
                
                <ProfileField 
                  label="Address" 
                  value={profileData.address} 
                  field="address" 
                />
                
                <ProfileField 
                  label="Bio" 
                  value={profileData.bio} 
                  field="bio" 
                  type="textarea" 
                />
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Details</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Shield className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{profileData.role}</p>
                        <p className="text-sm">{profileData.department}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Joined</p>
                        <p className="text-sm">{new Date(profileData.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <User className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Employee ID</p>
                        <p className="text-sm">{profileData.employeeId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Qualifications</h2>
                  <div className="space-y-2">
                    {profileData.qualifications.map((qual, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <Award className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-sm">{qual}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Security</h2>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <Lock className="w-4 h-4 mr-3 text-gray-500" />
                        <span className="text-sm">Change Password</span>
                      </div>
                      <span className="text-gray-400">›</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-3 text-gray-500" />
                        <span className="text-sm">Two-Factor Authentication</span>
                      </div>
                      <span className="text-gray-400">›</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
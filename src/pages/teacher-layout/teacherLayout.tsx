import { useState } from 'react';
import {
  User, Calendar, Shield, Edit3, Camera, Save, X, Bell, Lock, Search,
  BookOpen, Award, Clock, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Form, Input, Button, message, Modal } from 'antd';
import { useProfile } from '@hooks';

const Profile = () => {
  const {
    profile,
    isLoading,
    isError,
    error,
    updatePassword,
    isUpdatingPassword,
    updateAvatar,
    isUpdatingAvatar,
    updateProfile,
    isUpdatingProfile,
  } = useProfile('teacher');
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      first_name: profile?.first_name,
      last_name: profile?.last_name,
      email: profile?.email,
      phone: profile?.phone,
      address: profile?.address,
 
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await updateProfile(values);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      message.error('Failed to save profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handlePasswordSubmit = async () => {
    try {
      const values = await passwordForm.validateFields();
      await updatePassword(values);
      setIsPasswordModalOpen(false);
      passwordForm.resetFields();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatar(file);
    }
  };

  const stats = [
    { label: 'Students Taught', value: profile?.students_taught || '245', icon: Users, color: 'bg-blue-500' },
    { label: 'Courses', value: profile?.courses || '8', icon: BookOpen, color: 'bg-green-500' },
    { label: 'Years Experience', value: profile?.years_experience || '8+', icon: Award, color: 'bg-purple-500' },
    { label: 'Classes This Week', value: profile?.classes_this_week || '24', icon: Clock, color: 'bg-orange-500' },
  ];

  const ProfileField = ({
    label,
    value,
    field,
    type = 'text',
  }: {
    label: string;
    value: string;
    field: string;
    type?: string;
  }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {isEditing ? (
        type === 'textarea' ? (
          <Form.Item name={field} rules={[{ required: true, message: `${label} is required!` }]}>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </Form.Item>
        ) : (
          <Form.Item name={field} rules={[{ required: true, message: `${label} is required!` }]}>
            <Input
              type={type}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </Form.Item>
        )
      ) : (
        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{value || 'N/A'}</p>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100 justify-center items-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen bg-gray-100 justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error?.message || 'Failed to load profile'}</p>
          <Button type="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
       ಮ

        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen bg-gray-100"
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
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
                {profile?.first_name?.[0] || 'J'}{profile?.last_name?.[0] || 'S'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {/* <div className="max-w-6xl mx-auto"> */}
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-[#0f172a] to-[#1e3a8a]"></div>
              <div className="px-6 pb-6">
                <div className="flex items-end -mt-16 mb-4">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold text-gray-600">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        `${profile?.first_name?.[0] || 'J'}${profile?.last_name?.[0] || 'S'}`
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                        disabled={isUpdatingAvatar}
                      />
                    </label>
                  </div>
                  <div className="ml-6 flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile?.first_name} {profile?.last_name}
                    </h1>
                    <p className="text-xl text-gray-600">{profile?.role}</p>
                    <p className="text-gray-500">{profile?.department}</p>
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
                          disabled={isUpdatingProfile}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                <Form form={form} layout="vertical">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField
                      label="First Name"
                      value={profile?.first_name}
                      field="first_name"
                    />
                    <ProfileField
                      label="Last Name"
                      value={profile?.last_name}
                      field="last_name"
                    />
                    <ProfileField
                      label="Email Address"
                      value={profile?.email}
                      field="email"
                      type="email"
                    />
                    <ProfileField
                      label="Phone Number"
                      value={profile?.phone}
                      field="phone"
                      type="tel"
                    />
                  </div>

                </Form>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Profile Picture</label>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Details</h2>
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600">
                        <Shield className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{profile?.role}</p>
                          <p className="text-sm">{profile?.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Joined</p>
                          <p className="text-sm">{profile?.join_date ? new Date(profile.join_date).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Employee ID</p>
                          <p className="text-sm">{profile?.employee_id}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Qualifications</h2>
                    <div className="space-y-2">
                      {(profile?.qualifications || []).map((qual: string, index: number) => (
                        <div key={index} className="flex items-center text-gray-700">
                          <Award className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm">{qual}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Security</h2>
                    <div className="space-y-3">
                      <button
                        className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setIsPasswordModalOpen(true)}
                      >
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
            </main>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isPasswordModalOpen ? 1 : 0, scale: isPasswordModalOpen ? 1 : 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal
                open={isPasswordModalOpen}
                title={
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    Change Password
                  </div>
                }
                onCancel={() => {
                  setIsPasswordModalOpen(false);
                  passwordForm.resetFields();
                }}
                onOk={handlePasswordSubmit}
                okText="Save"
                cancelText="Cancel"
                confirmLoading={isUpdatingPassword}
              >
                <Form form={passwordForm} layout="vertical">
                  <Form.Item
                    name="old_password"
                    label="Old Password"
                    rules={[{ required: true, message: 'Please enter your old password' }]}
                  >
                    <Input.Password placeholder="Enter old password" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="New Password"
                    rules={[{ required: true, message: 'Please enter a new password' }]}
                  >
                    <Input.Password placeholder="Enter new password" />
                  </Form.Item>
                  <Form.Item
                    name="confirm_password"
                    label="Confirm New Password"
                    rules={[
                      { required: true, message: 'Please confirm your new password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm new password" />
                  </Form.Item>
                </Form>
              </Modal>
            </motion.div>
          </div>
        </motion.div>
      );
};

export default Profile;
// import React from 'react';
import { Card, Avatar, Button,  } from 'antd';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserOutlined, BellOutlined } from '@ant-design/icons';

// const { Title } = Typography;

const TeacherDashboard = () => {
  const attendanceData = [
    { date: 'Mar 25', Students: 9, Employees: 3, Visitors: 0 },
    { date: 'Mar 26', Students: 7, Employees: 4, Visitors: 0 },
    { date: 'Mar 27', Students: 0, Employees: 0, Visitors: 0 },
    { date: 'Mar 28', Students: 0, Employees: 0, Visitors: 0 },
    { date: 'Mar 29', Students: 7, Employees: 4, Visitors: 1.5 },
    { date: 'Today', Students: 6, Employees: 2, Visitors: 0 },
    { date: 'Mar 31', Students: 0, Employees: 0, Visitors: 2 }
  ];

  const feeCollectionData = [
    { month: 'Jan', amount: 8000 },
    { month: 'Feb', amount: 12000 },
    { month: 'Mar', amount: 15000 },
    { month: 'Apr', amount: 10000 },
    { month: 'May', amount: 18000 },
    { month: 'Jun', amount: 14000 }
  ];

  const tasks = [
    {
      id: 1,
      description: "Complete the student data verification",
      priority: "High",
      assignedTo: "edemo3 - Regina",
      status: "TODO",
      date: "2021-Mar-25"
    }
  ];

  const newsFeeds = [
    {
      id: 1,
      title: "Welcome to portal",
      date: "30-03-2021",
      excerpt: "coding for iphone"
    },
    {
      id: 2,
      title: "School Management Software",
      date: "25-02-2021"
    },
    {
      id: 3,
      title: "Welcome to ERP",
      date: "18-02-2021",
      excerpt: "The application is now online"
    }
  ];

  return (
    <Card title="Dashboard Overview">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-800">21</div>
              <div className="text-sm text-gray-600 mt-1">TOTAL STUDENTS</div>
            </div>
            <Avatar style={{ backgroundColor: '#efdbff' }} icon={<UserOutlined style={{ color: '#722ed1' }} />} size={48} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-800">4</div>
              <div className="text-sm text-gray-600 mt-1">TOTAL EMPLOYEES</div>
            </div>
            <Avatar style={{ backgroundColor: '#bae7ff' }} icon={<UserOutlined style={{ color: '#1890ff' }} />} size={48} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-800">10</div>
              <div className="text-sm text-gray-600 mt-1">TOTAL COURSE</div>
            </div>
            <Avatar style={{ backgroundColor: '#d9f7be' }} icon={<UserOutlined style={{ color: '#52c41a' }} />} size={48} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-800">9</div>
              <div className="text-sm text-gray-600 mt-1">TOTAL BATCH</div>
            </div>
            <Avatar style={{ backgroundColor: '#e6f4ff' }} icon={<UserOutlined style={{ color: '#1677ff' }} />} size={48} />
          </div>
        </Card>
      </div>
      <Card title="Daily Attendance Overview" style={{ marginBottom: 24 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Attendance</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Students</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Employees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Visitors</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Students" fill="#ef4444" />
              <Bar dataKey="Employees" fill="#3b82f6" />
              <Line type="monotone" dataKey="Visitors" stroke="#10b981" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Task Manager" className="lg:col-span-2">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                      {task.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">📅 {task.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      ⚠️ {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.assignedTo}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div className="space-y-6">
          <Card title="News Feeds">
            {newsFeeds.map((news) => (
              <div key={news.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                <Avatar style={{ backgroundColor: '#e6f4ff' }} icon={<BellOutlined style={{ color: '#1677ff' }} />} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                    {news.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">📅 {news.date}</div>
                  {news.excerpt && (
                    <div className="text-xs text-gray-600 mt-1">{news.excerpt}</div>
                  )}
                </div>
              </div>
            ))}
            <div className="text-center">
              <Button type="link">View all</Button>
            </div>
          </Card>
          <Card title="Birthday Notifications">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Avatar style={{ backgroundColor: '#f0f0f0' }} icon={<UserOutlined style={{ color: '#8c8c8c' }} />} size={48} className="mb-2" />
                <div className="text-lg font-bold">0</div>
                <div className="text-xs text-gray-600">Students</div>
              </div>
              <div>
                <Avatar style={{ backgroundColor: '#f0f0f0' }} icon={<UserOutlined style={{ color: '#8c8c8c' }} />} size={48} className="mb-2" />
                <div className="text-lg font-bold">0</div>
                <div className="text-xs text-gray-600">Staff</div>
              </div>
              <div>
                <Avatar style={{ backgroundColor: '#f0f0f0' }} icon={<UserOutlined style={{ color: '#8c8c8c' }} />} size={48} className="mb-2" />
                <div className="text-lg font-bold">0</div>
                <div className="text-xs text-gray-600">Employees</div>
              </div>
            </div>
          </Card>
          <Card title="Fee Collection of the Day">
            <div className="text-xs text-gray-500 mb-4">📅 30-03-2021</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar style={{ backgroundColor: '#e6f4ff' }} size="small" icon={<span>💰</span>} />
                  <span className="text-sm">Amount</span>
                </div>
                <span className="font-bold">12650</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar style={{ backgroundColor: '#d9f7be' }} size="small" icon={<span>💳</span>} />
                  <span className="text-sm">Discount</span>
                </div>
                <span className="font-bold">200</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar style={{ backgroundColor: '#efdbff' }} size="small" icon={<span>💸</span>} />
                  <span className="text-sm">Fine</span>
                </div>
                <span className="font-bold">100</span>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={feeCollectionData}>
                    <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default TeacherDashboard;
import  { useState } from 'react';
import { 
  Users, 
   
  BookOpen, 
  GraduationCap,
  BarChart3,
  Calendar,
  Settings,
  Bell,
  Search,
  Menu,
  Home,
  DollarSign,
  Book,
  Bus,
  Building,
  MessageSquare,
  Award,
  FileText,
  Download,
  Newspaper,
  MessageCircle,
  User,
  ChevronDown,
  
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('Activity');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sample data for charts
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

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Settings, label: 'Settings' },
    { icon: GraduationCap, label: 'Academic' },
    { icon: DollarSign, label: 'HR/Payroll' },
    { icon: Users, label: 'Student' },
    { icon: DollarSign, label: 'Finance' },
    { icon: Book, label: 'Library' },
    { icon: Bus, label: 'Transport' },
    { icon: Building, label: 'Hostel' },
    { icon: MessageSquare, label: 'Messages/SMS' },
    { icon: Award, label: 'Store Management' },
    { icon: TrendingUp, label: 'Performance' },
    { icon: Calendar, label: 'Events' },
    { icon: Settings, label: 'Integration' },
    { icon: CheckCircle, label: 'Task Manager' },
    { icon: FileText, label: 'Reports' },
    { icon: Download, label: 'Withdrawal' },
    { icon: Download, label: 'Data Export' },
    { icon: Newspaper, label: 'Newsfeeds' },
    { icon: MessageCircle, label: 'Feedback' },
    { icon: Book, label: 'Moodle' }
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-slate-800 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="font-bold text-sm">Demo Public School</h2>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700 cursor-pointer transition-colors ${
                item.active ? 'bg-slate-700 border-r-2 border-blue-500' : ''
              }`}
            >
              <item.icon className="w-4 h-4" />
              {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400">
            © 2015-21 Web-School ERP V5.0
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ACADEMIC YEAR: CBSE - 2021
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-medium">admin</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-800">21</div>
                  <div className="text-sm text-gray-600 mt-1">TOTAL STUDENTS</div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-800">4</div>
                  <div className="text-sm text-gray-600 mt-1">TOTAL EMPLOYEES</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-800">10</div>
                  <div className="text-sm text-gray-600 mt-1">TOTAL COURSE</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-800">9</div>
                  <div className="text-sm text-gray-600 mt-1">TOTAL BATCH</div>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="border-b border-gray-200">
              <div className="flex">
                {['Activity', 'Schedule', 'Fee reports'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-2 px-6 py-3">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Support</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Daily Attendance Chart */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Daily Attendance Overview</h3>
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
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Manager */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Task manager</h3>
              </div>
              <div className="overflow-x-auto">
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
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* News Feeds */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 bg-blue-600 text-white rounded-t-lg">
                  <h3 className="font-semibold">NEWS FEEDS</h3>
                </div>
                <div className="p-4 space-y-4">
                  {newsFeeds.map((news) => (
                    <div key={news.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 text-blue-600" />
                      </div>
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
                    <button className="text-blue-600 text-sm hover:underline">View all</button>
                  </div>
                </div>
              </div>

              {/* Birthday Notifications */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold">Birthday Notifications</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="text-lg font-bold">0</div>
                      <div className="text-xs text-gray-600">Students</div>
                    </div>
                    <div>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="text-lg font-bold">0</div>
                      <div className="text-xs text-gray-600">Staff</div>
                    </div>
                    <div>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="text-lg font-bold">0</div>
                      <div className="text-xs text-gray-600">Employees</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Collection */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold">Fee collection of the day</h3>
                  <div className="text-xs text-gray-500">📅 30-03-2021</div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-xs">💰</span>
                      </div>
                      <span className="text-sm">Amount</span>
                    </div>
                    <span className="font-bold">12650</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-xs">💳</span>
                      </div>
                      <span className="text-sm">Discount</span>
                    </div>
                    <span className="font-bold">200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                        <span className="text-xs">💸</span>
                      </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
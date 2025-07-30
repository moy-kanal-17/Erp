import { Outlet } from 'react-router-dom';

const TeacherPaneLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a]">
      <h1>Teacher Panel</h1>
      <Outlet />
    </div>
  );
};

export default TeacherPaneLayout;
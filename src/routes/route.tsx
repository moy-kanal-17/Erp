import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "../App";
import { SignIn, SignUp, NotFound, TeacherLayout, AdminLayout, Worker, SingleGroup,Student, StudentLayout, Groups, LayoutProtect, LoginProtect, Curs, GroupPage, TeacherDashboard,  Profile, TeacherPaneLayout, AdminProfile, TeacherGroupsPage, TeacherSingleGroupsPage, LessonPage, ForgetPassword, 
  // Attendace
 } from "@pages";
import Branchs from "../pages/branchs/branch";
import Rooms from "../pages/rooms/rooms";
import Dashboart from "../pages/curs/dashboart";
import Attendace from "../pages/teacher-layout/attendace/teacher.attendace";

// import TeacherSpisoks from "../pages/teacher-layout/teacher";
// import TeachersPage from "../pages/teacher-layout/teacher";
// import Test from "../pages/test/test";
const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<LoginProtect><SignIn/></LoginProtect>}/>
        <Route path="sign-up" element={<SignUp/>}/>
        <Route path="forget-password" element={<ForgetPassword/>}/>
        
        {/* ADMIN LAYOUT */}
        <Route path="admin" element={<LayoutProtect><AdminLayout/></LayoutProtect>}>
        <Route index element={<Dashboart/>}/>
         <Route path="groups" element={<Groups/>}/>
         <Route path="group/:id" element={<SingleGroup/>}/>
         <Route path="students" element={<Student/>}/>
         <Route path="teachers" element={<TeacherLayout/>} />
         <Route path="courses" element={<Curs/>} />
         <Route path="branch" element={<Branchs/>} />
         <Route path="rooms" element={<Rooms/>} />
         <Route path="profile" element={<AdminProfile/>}/>

         <Route path="lessons" element={<GroupPage/>}></Route>

        
        <Route path="*" element={<NotFound/>}/>



        </Route>
         {/* <Route path="test" element={<Test/>} /> */}


        {/* TEACHER LAYOUT */}
        <Route path="teacher" element={<LayoutProtect><TeacherPaneLayout/></LayoutProtect>}>
          <Route path="groups" element={<TeacherGroupsPage/>}/>
          <Route path="group/:id" element={<TeacherSingleGroupsPage/>}/>
          <Route path="lesson/:id" element={<LessonPage/>}/>


          <Route index  element={<TeacherDashboard/>}/>
          <Route path="dashboard" element={<TeacherDashboard/>}/>
          <Route path="profile" element={<Profile></Profile>}/>
          <Route path="attendance" element={<Attendace/>}/>
          <Route path="*" element={<NotFound/>}/>

        </Route>
        {/* STUDENT LAYOUT */}
        <Route path="student" element={<StudentLayout/>}>

        </Route>

        <Route path="worker" element={<Worker/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default Router;

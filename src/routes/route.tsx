import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "../App";
import { SignIn, SignUp, NotFound, TeacherLayout, AdminLayout, Worker, SingleGroup,Student, StudentLayout, Groups, LayoutProtect, LoginProtect, Curs, GroupPage } from "@pages";
import Branchs from "../pages/branchs/branch";
import Rooms from "../pages/rooms/rooms";
const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<LoginProtect><SignIn/></LoginProtect>}/>
        <Route path="sign-up" element={<SignUp/>}/>
        
        {/* ADMIN LAYOUT */}
        <Route path="admin" element={<LayoutProtect><AdminLayout/></LayoutProtect>}>
         <Route path="groups" element={<Groups/>}/>
         <Route path="group/:id" element={<SingleGroup/>}/>
         <Route path="students" element={<Student/>}/>
         <Route path="teachers" element={<TeacherLayout/>} />
         <Route path="courses" element={<Curs/>} />
         <Route path="branch" element={<Branchs/>} />
         <Route path="rooms" element={<Rooms/>} />
         <Route path="lessons" element={<GroupPage/>}></Route>

        
        <Route path="*" element={<NotFound/>}/>



        </Route>

        {/* TEACHER LAYOUT */}
        <Route path="teacher" element={<TeacherLayout/>}>

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

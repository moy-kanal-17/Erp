import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "../App";
import { SignIn, SignUp, NotFound, TeacherLayout, AdminLayout, Worker, SingleGroup, StudentLayout, Groups, LayoutProtect, LoginProtect } from "@pages";
const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<LoginProtect><SignIn/></LoginProtect>}/>
        <Route path="sign-up" element={<SignUp/>}/>
        
        {/* ADMIN LAYOUT */}
        <Route path="admin" element={<LayoutProtect><AdminLayout/></LayoutProtect>}>
         <Route index element={<Groups/>}/>
         <Route path="group/:id" element={<SingleGroup/>}/>
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

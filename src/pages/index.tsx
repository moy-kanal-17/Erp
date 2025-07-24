import { lazy } from "react";

const SignIn = lazy(()=> import('./auth/sign-in'))
const SignUp = lazy(()=> import('./auth/sign-up'))
const NotFound = lazy(()=> import('./not-found/not-found'))
const StudentLayout = lazy(()=> import('./student-layout/student'))
const AdminLayout = lazy(()=> import('./admin-layout/admin'))
const TeacherLayout = lazy(()=> import('./teacher-layout/teacherSpisoks.tsx'))
const Groups = lazy(()=> import('./groups/groups'))
const LayoutProtect = lazy(()=> import('./protect-routes/layout-protect'))
const LoginProtect = lazy(()=> import('./protect-routes/login-protect'))
const Worker = lazy(()=> import('./worker/worker'))
const SingleGroup = lazy(()=> import('./groups/single-group'))
const Student = lazy(()=> import('./admin-layout/users'))
const  Curs = lazy(() => import("./curs/curs.tsx"));
const  Rooms = lazy(() => import("./rooms/rooms.tsx"));
const  GroupPage = lazy(() => import("./lessons/lessosG.tsx"));



export {SignIn,Curs,GroupPage,Rooms, Student,SignUp, NotFound, StudentLayout, SingleGroup, AdminLayout, TeacherLayout, Groups, LayoutProtect, LoginProtect, Worker}
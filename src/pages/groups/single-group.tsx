 import { useGroups } from "@hooks";
 import { Calendar, Clock } from "lucide-react";
 import { useParams } from "react-router-dom";
 import GroupTeachers from "../../components/group/group-teachers";
 import GroupLessons from "../lessons/lessons";
 import GroupStudents from "../../components/group/group-students";
 

 const SingleGroup = () => {
  const { id } = useParams<{ id: string }>();
  const { dataById, students, lessons, teachers } = useGroups({page:1,limit:10}, Number(id));
  const groupData: any = dataById
   ? dataById.data.group
   : { course: { title: "", price: 0 } };
 

  return (
   <div className="bg-gray-100 min-h-screen p-6 sm:p-10">
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
     <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
       <h1 className="text-xl font-semibold text-gray-900">{groupData.name}</h1>
       <div className="mt-2 md:mt-0 flex items-center text-sm text-gray-500">
        {groupData.status === "new" ? (
         <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">
          New
         </span>
        ) : (
         <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
          Active
         </span>
        )}
       </div>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
       <div className="flex items-center text-sm text-gray-600">
        <Calendar className="w-4 h-4 mr-2" />
        Start: <span className="font-medium">{groupData.start_date}</span>
       </div>
       <div className="flex items-center text-sm text-gray-600">
        <Calendar className="w-4 h-4 mr-2" />
        End: <span className="font-medium">{groupData.end_date}</span>
       </div>
       <div className="flex items-center text-sm text-gray-600">
        <Clock className="w-4 h-4 mr-2" />
        Time: <span className="font-medium">{groupData.start_time} - {groupData.end_time}</span>
       </div>
       <div className="flex items-center text-sm text-gray-600">
        Price: <span className="font-medium">{groupData.course?.price?.toLocaleString()} sum</span>
       </div>
      </div>
     </div>
     <div className="p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{groupData.course?.title}</h2>
      <p className="text-gray-700 mb-4">{groupData.course?.description}</p>
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
       <span>Duration: {groupData.course?.duration} month</span>
       <span>Per week: {groupData.course?.lessons_in_a_week} lesson</span>
       <span>Lesson time: {groupData.course?.lesson_duration} min</span>
      </div>
 

      <div className="mt-6">
       <h3 className="text-md font-semibold text-gray-700 mb-2">Teachers</h3>
       {teachers?.data && teachers.data.length > 0 ? (
        <GroupTeachers teachers={teachers.data} />
       ) : (
        <p className="text-gray-500">No teachers assigned to this group.</p>
       )}
      </div>
 

      <div className="mt-6">
       <h3 className="text-md font-semibold text-gray-700 mb-2">Lessons</h3>
       {lessons?.data?.lessons && lessons.data.lessons.length > 0 ? (
        <GroupLessons lessons={lessons.data.lessons} />
       ) : (
        <p className="text-gray-500">No lessons scheduled for this group.</p>
       )}
      </div>
 

      <div className="mt-6">
       <h3 className="text-md font-semibold text-gray-700 mb-2">Students</h3>
       {students?.data && students.data.length > 0 ? (
        <GroupStudents students={students.data} id={id} />
       ) : (
        <p className="text-gray-500">No students enrolled in this group.</p>
       )}
      </div>
     </div>
    </div>
   </div>
  );
 };
 

 export default SingleGroup;

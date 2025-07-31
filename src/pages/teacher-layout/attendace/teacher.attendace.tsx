import { getUserIdFromToken } from "@helpers";
import { useTeacherGroupStudents } from "@hooks";

const Attendace = () => {

const Teacherid=getUserIdFromToken()
console.log("Teacherid", Teacherid);

const students = useTeacherGroupStudents(Teacherid!);
console.log("students", students);

  return (
<div>

</div>
  )
}

export default Attendace;

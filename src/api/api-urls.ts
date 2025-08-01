export class ApiUrls {

    // AUTH
    public static AUTH:string = "/log-in"

    // GROUPS
    public static GROUPS: string = "/group"
    public static GROUP_students: string = "/group-students"
    public static GROUP_TEACHER: string = "/group-teachers"

    //STUDENTS
    public static STUDENTS: string = '/students'
    // TECHERS
    public static TEACHERS: string = '/teacher'

    // COURSES
    public static COURSES: string = "/courses"


    public static ROOMS:string = '/rooms'


    //Lessons
    public static LEASSONS:string = '/lessons'

    //PROFILE
    public static PROFILE: string = "/profile";


	// AUTH

	public static LOGOUT: string = "/log-out";
	public static BRANCHES: string = "/branches";
	public static TEACHER: string = "/teacher";
	public static LESSONS: string = "/lessons";
	public static GROUP_LESSONS: string = this.LESSONS + "/group";
	public static GROUP_TEACHERS: string = "/group-teachers";
	public static GROUP_TEACHERS_DEACTIVATE: string = "/group-teachers/deactivate";

  public static GROUP_TEACHERS_MY: string = "/group-teachers/my-groups";

	public static GROUP_TEACHERS_BY_GROUP_ID: string =
		this.GROUP_TEACHERS + "/by-group";

    public static GROUP_TEACHERS_BY_TEACHER_ID: string =
		this.GROUP_TEACHERS + "/by-teacher";


	public static GROUP_STUDENTS: string = "/group-students";
	public static GROUP_STUDENTS_BY_GROUP_ID: string =
		this.GROUP_STUDENTS + "/by-group";
	public static UPDATE_LESSONS_STATUS_AND_NOTES=(id:number):string=>`${this.LESSONS}/${id}/status`
}






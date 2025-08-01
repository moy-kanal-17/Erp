export interface Group {
    id?: number,
    name: string,
    courseId: number,
    status: string,
    start_date: Date,
    // end_date: Date
    
}


export interface GroupTeacher {
  id: number;
  group: { id: number; name: string }; 
  teacher: { id: number; first_name: string; last_name: string };
  status: boolean;
  start_date: string;
  end_date: string;
}

// export interface BRanch
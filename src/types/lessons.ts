export interface Lesson {
  id: number;
  title: string;
  notes:string;
  status:string
  date: string;
}

export interface GroupLessonsType {
  lessons: Lesson[];
}

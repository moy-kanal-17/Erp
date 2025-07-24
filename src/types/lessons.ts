export interface Lesson {
  id: number;
  title: string;
  notes:string;
  status:string
}

export interface GroupLessonsType {
  lessons: Lesson[];
}

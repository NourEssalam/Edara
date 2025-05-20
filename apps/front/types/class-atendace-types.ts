export interface Class {
  classId: number;
  className: string;
}

export interface Course {
  courseId: number;
  courseName: string;
  classes: Class[];
}

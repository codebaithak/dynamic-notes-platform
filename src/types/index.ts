
export interface Subject {
  id: string;
  title: string;
  description: string;
  image: string;
  lessonsCount: number;
  progress?: number;
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  order: number;
}


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

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'user';
  avatar?: string;
}

export interface Comment {
  id: string;
  lessonId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
}

export type EditorContentType = 'text' | 'code' | 'image' | 'diagram' | 'mermaid';

export interface EditorBlock {
  id: string;
  type: EditorContentType;
  content: string;
  language?: string; // For code blocks
  caption?: string; // For images
}

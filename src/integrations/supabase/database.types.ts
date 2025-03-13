
import { Database } from './types';

// Define database table types based on our schema
export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: 'admin' | 'staff' | 'user';
  created_at: string | null;
};

export type Subject = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export type Lesson = {
  id: string;
  subject_id: string;
  title: string;
  content: string;
  lesson_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export type Comment = {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: Profile;
};

export type UserProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
};

// Type for subject with progress calculation
export type SubjectWithProgress = Subject & {
  progress?: number;
  lessonsCount: number;
};

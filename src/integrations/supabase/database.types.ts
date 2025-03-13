
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

// Extend Database type for Supabase
export type Tables = Database['public']['Tables'];

declare global {
  type Database = {
    public: {
      Tables: {
        profiles: {
          Row: Profile;
          Insert: Omit<Profile, 'id' | 'created_at'>;
          Update: Partial<Omit<Profile, 'id'>>;
        };
        subjects: {
          Row: Subject;
          Insert: Omit<Subject, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Omit<Subject, 'id' | 'created_at' | 'updated_at'>>;
        };
        lessons: {
          Row: Lesson;
          Insert: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Omit<Lesson, 'id' | 'created_at' | 'updated_at'>>;
        };
        comments: {
          Row: Comment;
          Insert: Omit<Comment, 'id' | 'created_at' | 'user'>;
          Update: Partial<Omit<Comment, 'id' | 'created_at' | 'user'>>;
        };
        user_progress: {
          Row: UserProgress;
          Insert: Omit<UserProgress, 'id' | 'created_at'>;
          Update: Partial<Omit<UserProgress, 'id' | 'created_at'>>;
        };
      };
      Views: {
        [key: string]: {
          Row: Record<string, unknown>;
          Insert: Record<string, unknown>;
          Update: Record<string, unknown>;
        };
      };
      Functions: {
        get_subject_progress: {
          Args: { subject_id: string; current_user_id: string };
          Returns: number;
        };
      };
      Enums: {
        [key: string]: never;
      };
      CompositeTypes: {
        [key: string]: never;
      };
    };
  };
}

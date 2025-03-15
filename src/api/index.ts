import { supabase } from '@/integrations/supabase/client';
import { 
  Subject, 
  Lesson, 
  Comment, 
  UserProgress, 
  Profile,
  SubjectWithProgress
} from '@/integrations/supabase/database.types';

// Subjects API
export const getSubjects = async (): Promise<SubjectWithProgress[]> => {
  console.log('Fetching subjects');
  const { data: { session } } = await supabase.auth.getSession();
  
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*');

  if (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }

  // Get lessons count for each subject
  const subjectsWithCount = await Promise.all(
    subjects.map(async (subject) => {
      const { count } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('subject_id', subject.id);

      // Get progress if user is authenticated
      let progress = undefined;
      
      if (session?.user) {
        try {
          const { data: result } = await supabase
            .rpc('get_subject_progress', {
              subject_id: subject.id,
              current_user_id: session.user.id
            });
          progress = result;
        } catch (progressError) {
          console.error('Error getting subject progress:', progressError);
          // Continue without progress if there's an error
        }
      }

      return {
        ...subject,
        lessonsCount: count || 0,
        progress
      } as SubjectWithProgress;
    })
  );

  return subjectsWithCount;
};

export const getSubjectById = async (id: string): Promise<SubjectWithProgress | null> => {
  console.log('Fetching subject by ID:', id);
  const { data: { session } } = await supabase.auth.getSession();
  
  const { data: subject, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching subject:', error);
    throw error;
  }

  if (!subject) {
    return null;
  }

  // Get lessons count
  const { count } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .eq('subject_id', id);

  // Get progress if user is authenticated
  let progress = undefined;
  
  if (session?.user) {
    try {
      const { data: result } = await supabase
        .rpc('get_subject_progress', {
          subject_id: id,
          current_user_id: session.user.id
        });
      progress = result;
    } catch (progressError) {
      console.error('Error getting subject progress:', progressError);
      // Continue without progress if there's an error
    }
  }

  return {
    ...subject,
    lessonsCount: count || 0,
    progress
  } as SubjectWithProgress;
};

export const createSubject = async (subject: Omit<Subject, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<Subject> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const { data, error } = await supabase
    .from('subjects')
    .insert([
      { 
        ...subject, 
        created_by: session?.user?.id
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating subject:', error);
    throw error;
  }

  return data;
};

export const updateSubject = async (id: string, subject: Partial<Subject>): Promise<Subject> => {
  const { data, error } = await supabase
    .from('subjects')
    .update(subject)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating subject:', error);
    throw error;
  }

  return data;
};

export const deleteSubject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
};

// Lessons API
export const getLessonsBySubjectId = async (subjectId: string): Promise<Lesson[]> => {
  console.log('Fetching lessons for subject ID:', subjectId);
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('subject_id', subjectId)
    .order('lesson_order', { ascending: true });

  if (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }

  return data;
};

export const getLessonById = async (id: string): Promise<Lesson | null> => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching lesson:', error);
    throw error;
  }

  return data;
};

export const createLesson = async (lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<Lesson> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const { data, error } = await supabase
    .from('lessons')
    .insert([
      { 
        ...lesson, 
        created_by: session?.user?.id
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }

  return data;
};

export const updateLesson = async (id: string, lesson: Partial<Lesson>): Promise<Lesson> => {
  const { data, error } = await supabase
    .from('lessons')
    .update(lesson)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }

  return data;
};

export const deleteLesson = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};

// User Progress API
export const markLessonAsCompleted = async (lessonId: string): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error('User must be authenticated to mark lesson as completed');
  }

  // Check if entry already exists
  const { data: existing } = await supabase
    .from('user_progress')
    .select('*')
    .eq('lesson_id', lessonId)
    .eq('user_id', session.user.id)
    .single();

  if (existing) {
    // Update existing entry
    const { error } = await supabase
      .from('user_progress')
      .update({ 
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', existing.id);

    if (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  } else {
    // Create new entry
    const { error } = await supabase
      .from('user_progress')
      .insert([
        {
          lesson_id: lessonId,
          user_id: session.user.id,
          completed: true,
          completed_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error creating lesson progress:', error);
      throw error;
    }
  }
};

export const getUserProgressForSubject = async (subjectId: string): Promise<{ lessonId: string, completed: boolean }[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return [];
  }

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('subject_id', subjectId);

  if (!lessons || lessons.length === 0) {
    return [];
  }

  const lessonIds = lessons.map(lesson => lesson.id);

  const { data: progress } = await supabase
    .from('user_progress')
    .select('lesson_id, completed')
    .eq('user_id', session.user.id)
    .in('lesson_id', lessonIds);

  if (!progress) {
    return lessonIds.map(id => ({ lessonId: id, completed: false }));
  }

  // Create a map of progress
  const progressMap: Record<string, boolean> = {};
  progress.forEach(item => {
    progressMap[item.lesson_id] = item.completed;
  });

  // Create an array with all lessons and their completed status
  return lessonIds.map(id => ({
    lessonId: id,
    completed: progressMap[id] || false
  }));
};

// Comments API
export const getCommentsByLessonId = async (lessonId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:profiles(id, name, avatar, role)
    `)
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }

  return data;
};

export const createComment = async (comment: { lessonId: string, content: string }): Promise<Comment> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error('User must be authenticated to create a comment');
  }

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        lesson_id: comment.lessonId,
        user_id: session.user.id,
        content: comment.content
      }
    ])
    .select(`
      *,
      user:profiles(id, name, avatar, role)
    `)
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw error;
  }

  return data;
};

export const deleteComment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Authentication methods
export const getCurrentUser = async () => {
  console.log('Getting current user');
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    throw error;
  }
  
  return session?.user || null;
};

export const getCurrentUserProfile = async () => {
  console.log('Getting current user profile');
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Error getting session:', sessionError);
    throw sessionError;
  }
  
  if (!session?.user) {
    console.log('No session found when getting user profile');
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    throw profileError;
  }

  return profile;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
};

export const updateProfile = async (profile: Partial<Profile>) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error('User must be authenticated to update profile');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', session.user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// File storage methods
export const uploadFile = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('learning-platform')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('learning-platform')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const deleteFile = async (path: string) => {
  const { error } = await supabase.storage
    .from('learning-platform')
    .remove([path]);

  if (error) {
    throw error;
  }
};

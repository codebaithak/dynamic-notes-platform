
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/integrations/supabase/database.types';

// Function to update a user's role (admin only)
export const updateUserRole = async (userId: string, role: 'admin' | 'staff' | 'user'): Promise<Profile> => {
  // Check if the current user is an admin
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error('You must be logged in to perform this action');
  }
  
  // Get the current user's profile to check if they are an admin
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (!currentUserProfile || currentUserProfile.role !== 'admin') {
    throw new Error('Only administrators can update user roles');
  }
  
  // Update the target user's role
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
  
  return data;
};

// Function to get all users (admin only)
export const getAllUsers = async (): Promise<Profile[]> => {
  // Check if the current user is an admin
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error('You must be logged in to perform this action');
  }
  
  // Get the current user's profile to check if they are an admin
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (!currentUserProfile || currentUserProfile.role !== 'admin') {
    throw new Error('Only administrators can view all users');
  }
  
  // Get all users
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  
  return data;
};

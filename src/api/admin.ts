
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/integrations/supabase/database.types';

// Function to update a user's role (admin only)
export const updateUserRole = async (userId: string, role: 'admin' | 'staff' | 'user'): Promise<Profile> => {
  // Check if the current user is an admin
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    console.error('No session found when updating user role');
    throw new Error('You must be logged in to perform this action');
  }
  
  // Get the current user's profile to check if they are an admin
  const { data: currentUserProfile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    throw new Error('Could not verify admin permissions');
  }
  
  if (!currentUserProfile || currentUserProfile.role !== 'admin') {
    console.error('Non-admin tried to update user role:', currentUserProfile?.role);
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
    console.error('No session found when fetching all users');
    throw new Error('You must be logged in to perform this action');
  }
  
  // Get the current user's profile to check if they are an admin
  const { data: currentUserProfile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    throw new Error('Could not verify admin permissions');
  }
  
  if (!currentUserProfile || currentUserProfile.role !== 'admin') {
    console.error('Non-admin tried to view all users:', currentUserProfile?.role);
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

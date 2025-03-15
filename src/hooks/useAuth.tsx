
import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { getCurrentUser, getCurrentUserProfile } from '@/api';
import { Profile } from '@/integrations/supabase/database.types';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  user: any | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isStaff: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserAndProfile = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching current user and profile...');
      
      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);
      
      if (currentUser) {
        setUser(currentUser);
        try {
          const userProfile = await getCurrentUserProfile();
          console.log('User profile:', userProfile);
          setProfile(userProfile);
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Still set isLoading to false even if profile fetch fails
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error in auth state check:', error);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUserAndProfile();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        if (session?.user) {
          setUser(session.user);
          try {
            const userProfile = await getCurrentUserProfile();
            setProfile(userProfile);
          } catch (profileError) {
            console.error('Error fetching user profile on auth change:', profileError);
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isStaff: profile?.role === 'staff' || profile?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


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

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          try {
            const userProfile = await getCurrentUserProfile();
            setProfile(userProfile);
          } catch (profileError) {
            console.error('Error getting user profile:', profileError);
            // Don't set profile to null if there's an error fetching the profile
            // This prevents an infinite loading state if the profile fetch fails
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error getting user:', error);
        setUser(null);
        setProfile(null);
      } finally {
        // Ensure loading state is always turned off, even if there's an error
        setIsLoading(false);
      }
    };

    getUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          try {
            const userProfile = await getCurrentUserProfile();
            setProfile(userProfile);
          } catch (profileError) {
            console.error('Error getting user profile during auth change:', profileError);
            // Don't prevent the app from loading if profile fetch fails
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        // Always set loading to false after auth state change
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


import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/integrations/supabase/database.types';

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

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log(`Fetching profile for user: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Exception when fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // First, check if there's an existing session
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session ? 'Session exists' : 'No session');
        
        if (session?.user) {
          // We found a session, set the user
          setUser(session.user);
          
          // Fetch the profile
          const profileData = await fetchUserProfile(session.user.id);
          setProfile(profileData);
        } else {
          // No session found
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Set up auth change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          setUser(session.user);
          
          // Don't set loading to true if we're just refreshing the session
          if (event !== 'TOKEN_REFRESHED') {
            setIsLoading(true);
          }
          
          // Fetch profile
          const profileData = await fetchUserProfile(session.user.id);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Auth state updated:', {
      user: user?.id,
      profile: profile?.id,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: profile?.role === 'admin',
      isStaff: profile?.role === 'staff' || profile?.role === 'admin',
    });
  }, [user, profile, isLoading]);

  // Prepare context value
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

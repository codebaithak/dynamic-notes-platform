
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/integrations/supabase/database.types';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isStaff: false,
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
        setError(error);
        return null;
      }

      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Exception when fetching profile:', error);
      setError(error instanceof Error ? error : new Error('Unknown error fetching profile'));
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST to catch any auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession ? 'Session exists' : 'No session');
        
        // Always update our session state
        setSession(currentSession);
        
        if (event === 'SIGNED_OUT' || !currentSession) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          
          // Don't set loading to true if we're just refreshing the token
          if (event !== 'TOKEN_REFRESHED') {
            setIsLoading(true);
          }
          
          // Fetch profile
          const profileData = await fetchUserProfile(currentSession.user.id);
          setProfile(profileData);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', initialSession ? 'Session exists' : 'No session');
        
        if (initialSession?.user) {
          setUser(initialSession.user);
          setSession(initialSession);
          
          console.log('Getting current user profile');
          const profileData = await fetchUserProfile(initialSession.user.id);
          setProfile(profileData);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing auth'));
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Prepare context value
  const value = {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isStaff: profile?.role === 'staff' || profile?.role === 'admin',
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

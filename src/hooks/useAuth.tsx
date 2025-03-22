
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
  const [authInitialized, setAuthInitialized] = useState(false);

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
    // Combined function to handle auth state changes
    const handleAuthChange = async (currentSession: Session | null) => {
      try {
        if (!currentSession?.user) {
          // User is not authenticated
          setUser(null);
          setSession(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }
        
        // User is authenticated, update state
        setUser(currentSession.user);
        setSession(currentSession);
        
        // Fetch profile data
        const profileData = await fetchUserProfile(currentSession.user.id);
        setProfile(profileData);
      } catch (err) {
        console.error('Error handling auth change:', err);
        setError(err instanceof Error ? err : new Error('Unknown error handling auth change'));
      } finally {
        setIsLoading(false);
      }
    };

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // First, check for an existing session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial auth check:', initialSession ? 'Session exists' : 'No session');
        
        // Handle initial session state
        await handleAuthChange(initialSession);
        
        // Then set up listener for future auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, changedSession) => {
          console.log('Auth state changed:', event);
          await handleAuthChange(changedSession);
        });
        
        // Store subscription for cleanup
        return subscription;
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing auth'));
        setIsLoading(false);
        return null;
      } finally {
        setAuthInitialized(true);
      }
    };

    // Initialize auth and store subscription
    const subscriptionPromise = initializeAuth();
    
    // Cleanup subscription on unmount
    return () => {
      subscriptionPromise.then(subscription => {
        if (subscription) {
          subscription.unsubscribe();
        }
      });
    };
  }, []);

  // Prepare context value
  const value = {
    user,
    session,
    profile,
    isLoading: isLoading && !authInitialized, // Only show loading if auth is not initialized
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isStaff: profile?.role === 'staff' || profile?.role === 'admin',
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

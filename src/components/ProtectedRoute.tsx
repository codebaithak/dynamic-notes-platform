
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading, user, profile, session } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) {
      console.log('ProtectedRoute: Loading auth state...');
    } else {
      console.log('ProtectedRoute: Auth state loaded', {
        isAuthenticated,
        isAdmin,
        userId: user?.id,
        profileId: profile?.id,
        role: profile?.role,
        hasSession: !!session
      });
      
      if (!isAuthenticated) {
        console.log('ProtectedRoute: User not authenticated, will redirect to /auth');
      } else if (requireAdmin && !isAdmin) {
        console.log('ProtectedRoute: Admin access required but user is not admin, will redirect to /subjects');
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, requireAdmin, user, profile, session]);

  // Show loading UI while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-center text-lg font-medium">Verifying your credentials...</p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Please wait a moment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If admin is required but user is not admin, redirect to subjects
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/subjects" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

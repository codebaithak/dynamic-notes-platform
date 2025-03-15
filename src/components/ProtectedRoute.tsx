
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) {
      console.log('ProtectedRoute: Loading auth state...');
    } else if (!isAuthenticated) {
      console.log('ProtectedRoute: User not authenticated, will redirect');
    } else if (requireAdmin && !isAdmin) {
      console.log('ProtectedRoute: Admin access required but user is not admin');
    } else {
      console.log('ProtectedRoute: Access granted to', user?.id);
    }
  }, [isLoading, isAuthenticated, isAdmin, requireAdmin, user]);

  // Show loading UI while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-center text-lg font-medium">Loading your profile...</p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Please wait while we verify your credentials
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to auth page');
    // Save the location they were trying to access for potential redirect after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Log debugging info for admin access
  if (requireAdmin) {
    console.log('Admin check - isAdmin:', isAdmin, 'User:', user?.id);
  }

  // If admin is required but user is not admin, redirect to subjects
  if (requireAdmin && !isAdmin) {
    console.log('Admin access required but user is not admin, redirecting to subjects');
    return <Navigate to="/subjects" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

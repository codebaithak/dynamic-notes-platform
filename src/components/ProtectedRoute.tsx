
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

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
    return <Navigate to="/auth" replace />;
  }

  // If admin is required but user is not admin, redirect to subjects
  if (requireAdmin && !isAdmin) {
    console.log('Admin access required but user is not admin, redirecting to subjects');
    return <Navigate to="/subjects" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

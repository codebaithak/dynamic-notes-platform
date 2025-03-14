
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import SubjectsPage from "./pages/SubjectsPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import LessonPage from "./pages/LessonPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminEditor from "./pages/admin/AdminEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/subject/:subjectId" element={<SubjectDetailPage />} />
            <Route 
              path="/subject/:subjectId/lesson/:lessonId" 
              element={
                <ProtectedRoute>
                  <LessonPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/subjects" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSubjects />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/subjects/:subjectId/lessons" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLessons />
                </ProtectedRoute>
              } 
            />
            {/* Redirect double slash to single slash */}
            <Route 
              path="/admin/subjects//lessons" 
              element={<Navigate to="/admin/subjects" replace />} 
            />
            <Route 
              path="/admin/editor/:type/:id" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminEditor />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Menu, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import LessonContent from "@/components/LessonContent";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getSubjectById, getLessonById, getLessonsBySubjectId } from "@/api";
import { useToast } from "@/hooks/use-toast";

const LessonPage = () => {
  const { subjectId, lessonId } = useParams<{ subjectId: string, lessonId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch subject details
  const { 
    data: subject, 
    isLoading: isLoadingSubject, 
    error: subjectError 
  } = useQuery({
    queryKey: ['subject', subjectId],
    queryFn: () => getSubjectById(subjectId || ''),
    enabled: !!subjectId,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching subject:", error);
        toast({
          title: "Error",
          description: "Failed to load subject details. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  // Fetch lessons for this subject
  const { 
    data: lessons = [], 
    isLoading: isLoadingLessons, 
    error: lessonsError 
  } = useQuery({
    queryKey: ['lessons', subjectId],
    queryFn: () => getLessonsBySubjectId(subjectId || ''),
    enabled: !!subjectId,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching lessons:", error);
        toast({
          title: "Error",
          description: "Failed to load lessons. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  // Fetch current lesson
  const {
    data: lesson,
    isLoading: isLoadingLesson,
    error: lessonError
  } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => getLessonById(lessonId || ''),
    enabled: !!lessonId,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching lesson:", error);
        toast({
          title: "Error",
          description: "Failed to load lesson content. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Find previous and next lessons
  const sortedLessons = [...lessons].sort((a, b) => a.lesson_order - b.lesson_order);
  const currentIndex = lesson ? sortedLessons.findIndex(l => l.id === lesson.id) : -1;
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;

  const isLoading = isLoadingSubject || isLoadingLessons || isLoadingLesson;
  const error = subjectError || lessonsError || lessonError;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl p-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !subject || !lesson) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
            <p className="mb-6">The lesson you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/subjects">Back to Subjects</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 flex">
        {/* Lesson sidebar - mobile version as a drawer */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Lessons</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-4">
              <h3 className="mb-2 text-sm font-medium">{subject.title}</h3>
              <ul className="space-y-1">
                {sortedLessons.map((l) => (
                  <li key={l.id}>
                    <Link 
                      to={`/subject/${subject.id}/lesson/${l.id}`}
                      className={`
                        flex items-center px-3 py-2 text-sm rounded-md 
                        ${l.id === lesson.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                      `}
                    >
                      <span className="mr-2 text-xs">{l.lesson_order}.</span>
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollArea>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-auto">
          <div className="container py-6">
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleSidebar} 
                className="lg:hidden"
              >
                <Menu className="h-4 w-4 mr-2" />
                Lessons
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="ml-auto"
              >
                <Link to={`/subject/${subject.id}`} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Subject
                </Link>
              </Button>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
              <p className="text-muted-foreground">
                Lesson {lesson.lesson_order} of {sortedLessons.length} in {subject.title}
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <LessonContent 
                  content={lesson.content} 
                  previousUrl={prevLesson ? `/subject/${subject.id}/lesson/${prevLesson.id}` : undefined}
                  nextUrl={nextLesson ? `/subject/${subject.id}/lesson/${nextLesson.id}` : undefined}
                  homeUrl={`/subject/${subject.id}`}
                />
              </CardContent>
            </Card>

            <Separator className="my-8" />

            <div className="flex items-center justify-between">
              {prevLesson ? (
                <Button variant="outline" asChild>
                  <Link to={`/subject/${subject.id}/lesson/${prevLesson.id}`} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Previous Lesson
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Lesson
                </Button>
              )}

              {nextLesson ? (
                <Button asChild>
                  <Link to={`/subject/${subject.id}/lesson/${nextLesson.id}`} className="flex items-center gap-2">
                    Next Lesson
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  asChild
                >
                  <Link to={`/subject/${subject.id}`} className="flex items-center gap-2">
                    Complete Subject
                    <BookOpen className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonPage;

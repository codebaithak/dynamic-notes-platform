
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Menu, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import LessonContent from "@/components/LessonContent";
import { subjects, lessons } from "@/lib/mock-data";
import { Subject, Lesson } from "@/types";

const LessonPage = () => {
  const { subjectId, lessonId } = useParams<{ subjectId: string, lessonId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [subjectLessons, setSubjectLessons] = useState<Lesson[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be a database query
    const foundSubject = subjects.find(s => s.id === subjectId);
    const foundLessons = lessons[subjectId || ""] || [];
    const foundLesson = foundLessons.find(l => l.id === lessonId) || null;
    
    setSubject(foundSubject || null);
    setSubjectLessons(foundLessons);
    setLesson(foundLesson);
    setLoading(false);
  }, [subjectId, lessonId]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Find previous and next lessons
  const currentIndex = lesson ? subjectLessons.findIndex(l => l.id === lesson.id) : -1;
  const prevLesson = currentIndex > 0 ? subjectLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < subjectLessons.length - 1 ? subjectLessons[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading lesson...</p>
        </main>
      </div>
    );
  }

  if (!subject || !lesson) {
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
                {subjectLessons.map((l) => (
                  <li key={l.id}>
                    <Link 
                      to={`/subject/${subject.id}/lesson/${l.id}`}
                      className={`
                        flex items-center px-3 py-2 text-sm rounded-md 
                        ${l.id === lesson.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                      `}
                    >
                      <span className="mr-2 text-xs">{l.order}.</span>
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
                Lesson {lesson.order} of {subjectLessons.length} in {subject.title}
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <LessonContent content={lesson.content} />
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

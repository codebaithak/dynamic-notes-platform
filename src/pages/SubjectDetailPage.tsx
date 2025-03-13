
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, List } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { subjects, lessons } from "@/lib/mock-data";
import { Subject, Lesson } from "@/types";

const SubjectDetailPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [subjectLessons, setSubjectLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be a database query
    const foundSubject = subjects.find(s => s.id === subjectId);
    const foundLessons = lessons[subjectId || ""] || [];
    
    setSubject(foundSubject || null);
    setSubjectLessons(foundLessons);
    setLoading(false);
  }, [subjectId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading subject...</p>
        </main>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Subject Not Found</h1>
            <p className="mb-6">The subject you're looking for doesn't exist or has been removed.</p>
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
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/subjects" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Subjects
              </Link>
            </Button>
            
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="w-full lg:w-2/3">
                <h1 className="text-3xl font-bold tracking-tight mb-2">{subject.title}</h1>
                <p className="text-muted-foreground mb-4">{subject.description}</p>
                
                {subject.progress !== undefined && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Overall Progress</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                )}
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <List className="h-5 w-5" />
                    Lessons ({subjectLessons.length})
                  </h2>
                  
                  {subjectLessons.length > 0 ? (
                    <div className="space-y-3">
                      {subjectLessons.map((lesson) => (
                        <Card key={lesson.id} className="transition-all hover:shadow-md">
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg flex justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-normal text-muted-foreground">
                                  {lesson.order}.
                                </span>
                                {lesson.title}
                              </div>
                              <Button asChild size="sm">
                                <Link to={`/subject/${subject.id}/lesson/${lesson.id}`}>
                                  Start
                                </Link>
                              </Button>
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 border rounded-lg bg-muted/30">
                      <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No lessons available</h3>
                      <p className="text-muted-foreground">
                        Lessons for this subject will be added soon.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="w-full lg:w-1/3 sticky top-20">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="text-blue-600 hover:underline">
                          Download subject materials
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-600 hover:underline">
                          Reference books
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-600 hover:underline">
                          Community discussions
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubjectDetailPage;

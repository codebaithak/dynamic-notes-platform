
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Eye,
  ArrowUp,
  ArrowDown,
  Book,
  Loader
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getSubjectById, getLessonsBySubjectId, deleteLesson, updateLesson } from "@/api";

const AdminLessons = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
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
      onError: (err: Error) => {
        console.error("Error fetching subject:", err);
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
      onError: (err: Error) => {
        console.error("Error fetching lessons:", err);
        toast({
          title: "Error",
          description: "Failed to load lessons. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  // Delete lesson mutation
  const deleteMutation = useMutation({
    mutationFn: deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', subjectId] });
      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setLessonToDelete(null);
    },
    onError: (error: any) => {
      console.error("Error deleting lesson:", error);
      toast({
        title: "Error",
        description: "Failed to delete lesson. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update lesson order mutation
  const updateOrderMutation = useMutation({
    mutationFn: (data: { id: string, lesson: Partial<any> }) => 
      updateLesson(data.id, data.lesson),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', subjectId] });
    },
    onError: (error: any) => {
      console.error("Error updating lesson order:", error);
      toast({
        title: "Error",
        description: "Failed to update lesson order. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (lessonId: string) => {
    setLessonToDelete(lessonId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (lessonToDelete) {
      deleteMutation.mutate(lessonToDelete);
    }
  };

  const handleMoveLesson = (lesson: any, direction: 'up' | 'down') => {
    const sortedLessons = [...lessons].sort((a, b) => a.lesson_order - b.lesson_order);
    const currentIndex = sortedLessons.findIndex(l => l.id === lesson.id);
    
    if (direction === 'up' && currentIndex > 0) {
      const prevLesson = sortedLessons[currentIndex - 1];
      
      // Swap orders
      updateOrderMutation.mutate({
        id: lesson.id,
        lesson: { lesson_order: prevLesson.lesson_order }
      });
      
      updateOrderMutation.mutate({
        id: prevLesson.id,
        lesson: { lesson_order: lesson.lesson_order }
      });
    } 
    else if (direction === 'down' && currentIndex < sortedLessons.length - 1) {
      const nextLesson = sortedLessons[currentIndex + 1];
      
      // Swap orders
      updateOrderMutation.mutate({
        id: lesson.id,
        lesson: { lesson_order: nextLesson.lesson_order }
      });
      
      updateOrderMutation.mutate({
        id: nextLesson.id,
        lesson: { lesson_order: lesson.lesson_order }
      });
    }
  };

  const isLoading = isLoadingSubject || isLoadingLessons;
  const error = subjectError || lessonsError;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading lessons...</p>
        </main>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Subject Not Found</h1>
            <p className="mb-6">The subject you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/admin/subjects">Back to Subjects</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Sort lessons by order
  const sortedLessons = [...filteredLessons].sort((a, b) => a.lesson_order - b.lesson_order);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/admin/subjects" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Subjects
              </Link>
            </Button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Lessons for {subject.title}
                </h1>
                <p className="text-muted-foreground">
                  Manage and organize lessons for this subject
                </p>
              </div>
              <Button asChild>
                <Link to={`/admin/editor/lesson/new?subjectId=${subject.id}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lesson
                </Link>
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {sortedLessons.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Order</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>{lesson.lesson_order}</TableCell>
                      <TableCell className="font-medium">{lesson.title}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleMoveLesson(lesson, 'up')}
                            disabled={
                              updateOrderMutation.isPending || 
                              lesson.lesson_order === Math.min(...sortedLessons.map(l => l.lesson_order))
                            }
                          >
                            {updateOrderMutation.isPending ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <ArrowUp className="h-4 w-4" />
                            )}
                            <span className="sr-only">Move up</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleMoveLesson(lesson, 'down')}
                            disabled={
                              updateOrderMutation.isPending || 
                              lesson.lesson_order === Math.max(...sortedLessons.map(l => l.lesson_order))
                            }
                          >
                            {updateOrderMutation.isPending ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )}
                            <span className="sr-only">Move down</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/subject/${subject.id}/lesson/${lesson.id}`} className="flex items-center">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/editor/lesson/${lesson.id}`} className="flex items-center">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteClick(lesson.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/30">
              <Book className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No lessons available</h3>
              <p className="text-muted-foreground mb-6">
                This subject doesn't have any lessons yet. Get started by adding a lesson.
              </p>
              <Button asChild>
                <Link to={`/admin/editor/lesson/new?subjectId=${subject.id}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Lesson
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the lesson.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLessons;

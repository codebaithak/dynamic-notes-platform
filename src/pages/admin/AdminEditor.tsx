
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  Image, 
  Code, 
  FileText,
  AlertCircle,
  Sparkles,
  Loader
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { 
  getSubjects, 
  getSubjectById, 
  createSubject, 
  updateSubject, 
  deleteSubject,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
} from "@/api";

type EditorType = 'subject' | 'lesson';

const AdminEditor = () => {
  const { type, id } = useParams<{ type: EditorType, id: string }>();
  const [searchParams] = useSearchParams();
  const subjectIdFromParams = searchParams.get('subjectId');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectIdFromParams || "");
  const [image, setImage] = useState("");
  const [lesson_order, setLessonOrder] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showAiPreview, setShowAiPreview] = useState(false);

  const isNewItem = id === 'new';
  const isSubjectEditor = type === 'subject';
  const isLessonEditor = type === 'lesson';

  // Fetch subjects for the dropdown
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
    meta: {
      onError: (err: Error) => {
        console.error("Error fetching subjects:", err);
        toast({
          title: "Error",
          description: "Failed to load subjects. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  // Fetch subject or lesson data if editing
  const { data: currentItem, isLoading: isLoadingItem } = useQuery({
    queryKey: [isSubjectEditor ? 'subject' : 'lesson', id],
    queryFn: () => isSubjectEditor 
      ? getSubjectById(id) 
      : getLessonById(id),
    enabled: !isNewItem && !!id,
    meta: {
      onError: (err: Error) => {
        console.error(`Error fetching ${type}:`, err);
        toast({
          title: "Error",
          description: `Failed to load ${type} details. Please try again later.`,
          variant: "destructive",
        });
      }
    }
  });

  // Fetch the max lesson order from the subject if creating a new lesson
  const { data: subjectLessons = [] } = useQuery({
    queryKey: ['lessons', selectedSubjectId],
    queryFn: () => getLessonsBySubjectId(selectedSubjectId),
    enabled: isLessonEditor && isNewItem && !!selectedSubjectId,
    meta: {
      onError: (err: Error) => {
        console.error("Error fetching lessons:", err);
      }
    }
  });

  // Set up mutations for saving
  const createSubjectMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({
        title: "Success",
        description: "Subject created successfully",
      });
      navigate("/admin/subjects");
    },
    onError: (error: any) => {
      console.error("Error creating subject:", error);
      toast({
        title: "Error",
        description: "Failed to create subject. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateSubjectMutation = useMutation({
    mutationFn: (data: { id: string, subject: Partial<any> }) => 
      updateSubject(data.id, data.subject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['subject', id] });
      toast({
        title: "Success",
        description: "Subject updated successfully",
      });
      navigate("/admin/subjects");
    },
    onError: (error: any) => {
      console.error("Error updating subject:", error);
      toast({
        title: "Error",
        description: "Failed to update subject. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createLessonMutation = useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', selectedSubjectId] });
      toast({
        title: "Success",
        description: "Lesson created successfully",
      });
      navigate(`/admin/subjects/${selectedSubjectId}/lessons`);
    },
    onError: (error: any) => {
      console.error("Error creating lesson:", error);
      toast({
        title: "Error",
        description: "Failed to create lesson. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateLessonMutation = useMutation({
    mutationFn: (data: { id: string, lesson: Partial<any> }) => 
      updateLesson(data.id, data.lesson),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', selectedSubjectId] });
      queryClient.invalidateQueries({ queryKey: ['lesson', id] });
      toast({
        title: "Success",
        description: "Lesson updated successfully",
      });
      navigate(`/admin/subjects/${selectedSubjectId}/lessons`);
    },
    onError: (error: any) => {
      console.error("Error updating lesson:", error);
      toast({
        title: "Error",
        description: "Failed to update lesson. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: () => isSubjectEditor 
      ? deleteSubject(id || '')
      : deleteLesson(id || ''),
    onSuccess: () => {
      if (isSubjectEditor) {
        queryClient.invalidateQueries({ queryKey: ['subjects'] });
        navigate("/admin/subjects");
      } else {
        queryClient.invalidateQueries({ queryKey: ['lessons', selectedSubjectId] });
        navigate(`/admin/subjects/${selectedSubjectId}/lessons`);
      }
      toast({
        title: "Success",
        description: `${type === 'subject' ? 'Subject' : 'Lesson'} deleted successfully`,
      });
    },
    onError: (error: any) => {
      console.error(`Error deleting ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${type}. Please try again.`,
        variant: "destructive",
      });
    }
  });

  // Effect to set initial values when editing an existing item
  useEffect(() => {
    if (!isNewItem && currentItem) {
      if (isSubjectEditor && 'title' in currentItem) {
        setTitle(currentItem.title);
        setDescription(currentItem.description);
        setImage(currentItem.image || '');
      } else if (isLessonEditor && 'title' in currentItem) {
        setTitle(currentItem.title);
        setContent(currentItem.content);
        setSelectedSubjectId(currentItem.subject_id);
        setLessonOrder(currentItem.lesson_order);
      }
    }
  }, [currentItem, isNewItem, isSubjectEditor, isLessonEditor]);

  // Effect to set the next lesson order when creating a new lesson
  useEffect(() => {
    if (isLessonEditor && isNewItem && subjectLessons.length > 0) {
      const maxOrder = Math.max(...subjectLessons.map(lesson => lesson.lesson_order));
      setLessonOrder(maxOrder + 1);
    }
  }, [isLessonEditor, isNewItem, subjectLessons]);

  const handleSave = () => {
    if (isSubjectEditor) {
      const subjectData = {
        title,
        description,
        image: image || null
      };

      if (isNewItem) {
        createSubjectMutation.mutate(subjectData);
      } else {
        updateSubjectMutation.mutate({ 
          id: id || '', 
          subject: subjectData 
        });
      }
    } else if (isLessonEditor) {
      if (!selectedSubjectId) {
        toast({
          title: "Error",
          description: "Please select a subject",
          variant: "destructive",
        });
        return;
      }

      const lessonData = {
        title,
        content,
        subject_id: selectedSubjectId,
        lesson_order: lesson_order
      };

      if (isNewItem) {
        createLessonMutation.mutate(lessonData);
      } else {
        updateLessonMutation.mutate({ 
          id: id || '', 
          lesson: lessonData 
        });
      }
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteItemMutation.mutate();
  };

  const requestAiSuggestion = () => {
    // Mock AI suggestion
    setTimeout(() => {
      setAiSuggestion(
        "# Suggested Content\n\nHere's a comprehensive explanation of this topic with key points:\n\n" +
        "## Main Concepts\n\n" +
        "- Important point 1\n" +
        "- Important point 2\n" +
        "- Important point 3\n\n" +
        "```javascript\n" +
        "// Example code\n" +
        "function example() {\n" +
        "  console.log('This is a code example');\n" +
        "}\n" +
        "```\n\n" +
        "## Further Reading\n\n" +
        "Check these resources for more information..."
      );
      setShowAiPreview(true);
    }, 1500);
  };

  const isSaving = 
    createSubjectMutation.isPending || 
    updateSubjectMutation.isPending ||
    createLessonMutation.isPending ||
    updateLessonMutation.isPending;

  const isDeleting = deleteItemMutation.isPending;

  if (isLoadingItem && !isNewItem) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading editor...</p>
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
            <Button 
              variant="ghost" 
              asChild 
              className="mb-4"
            >
              <Link 
                to={isSubjectEditor ? "/admin/subjects" : `/admin/subjects/${selectedSubjectId}/lessons`} 
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {isNewItem ? `New ${type}` : `Edit ${type}`}
                </h1>
                <p className="text-muted-foreground">
                  {isSubjectEditor 
                    ? "Create or edit subject details"
                    : "Create or edit lesson content"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                {!isNewItem && (
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`${type} title`}
                className="mt-1"
              />
            </div>

            {isSubjectEditor && (
              <>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Subject description"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {isLessonEditor && (
              <>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <select
                    id="subject"
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full mt-1 border border-input bg-background px-3 py-2 text-sm rounded-md"
                    disabled={!isNewItem}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="order">Lesson Order</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={lesson_order}
                    onChange={(e) => setLessonOrder(parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Content Editor</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={requestAiSuggestion}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Suggest
                      </Button>
                      <Button variant="outline" size="sm">
                        <Image className="mr-2 h-4 w-4" />
                        Add Image
                      </Button>
                      <Button variant="outline" size="sm">
                        <Code className="mr-2 h-4 w-4" />
                        Add Code
                      </Button>
                    </div>
                  </div>

                  <Tabs defaultValue="editor">
                    <TabsList className="mb-4">
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="editor">
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="# Lesson Content
                        
Use Markdown to format your content. You can include:
- Headers with # symbols
- **Bold** and *italic* text
- Lists like this one
- Code blocks with ```
- And more!"
                        className="min-h-[400px] font-mono"
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <div className="border rounded-md p-4 min-h-[400px] prose max-w-none">
                        <p>Preview will be shown here...</p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {selectedSubjectId === "" && isNewItem && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Missing subject</AlertTitle>
                      <AlertDescription>
                        Please select a subject for this lesson.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the {type}.
              {isSubjectEditor && " All lessons within this subject will also be deleted."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAiPreview} onOpenChange={setShowAiPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Content Suggestion
            </DialogTitle>
            <DialogDescription>
              Review this AI-generated content. You can copy parts you like into your lesson.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 rounded-md border p-4 max-h-[50vh] overflow-auto">
            <pre className="whitespace-pre-wrap text-sm">{aiSuggestion}</pre>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                navigator.clipboard.writeText(aiSuggestion);
              }}
            >
              Copy to Clipboard
            </Button>
            <Button onClick={() => {
              setContent(aiSuggestion);
              setShowAiPreview(false);
            }}>
              Use This Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEditor;

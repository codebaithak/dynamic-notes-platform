
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubjectById, getLessonById, createSubject, updateSubject, createLesson, updateLesson, getNextLessonOrder } from "@/api";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SubjectWithProgress, Lesson } from "@/integrations/supabase/database.types";
import RichTextEditor from "@/components/RichTextEditor";
import ContentPreview from "@/components/ContentPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type EditorType = "subject" | "lesson";

const AdminEditor = () => {
  const { type, id } = useParams<{ type: EditorType; id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // State for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [lessonOrder, setLessonOrder] = useState(0);
  const [subjectId, setSubjectId] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Validate parameters
  useEffect(() => {
    if (!type || (type !== "subject" && type !== "lesson")) {
      navigate("/admin", { replace: true });
    }
  }, [type, navigate]);

  // Get subject ID from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subjectIdFromUrl = urlParams.get("subjectId");
    
    if (isNew && type === "lesson" && subjectIdFromUrl) {
      setSubjectId(subjectIdFromUrl);
      
      // Get next lesson order when creating a new lesson
      const fetchNextOrder = async () => {
        if (subjectIdFromUrl) {
          try {
            const nextOrder = await getNextLessonOrder(subjectIdFromUrl);
            setLessonOrder(nextOrder);
          } catch (error) {
            console.error("Error getting next lesson order:", error);
            setLessonOrder(1); // Fallback to 1 if error occurs
          }
        }
      };
      
      fetchNextOrder();
    }
  }, [isNew, type]);

  // If not new, fetch existing data
  const fetchData = async () => {
    if (isNew) return null;
    
    if (type === "subject") {
      return await getSubjectById(id);
    } else {
      return await getLessonById(id);
    }
  };
  
  const { data, isLoading: dataLoading, error: dataError } = useQuery({
    queryKey: [type, id],
    queryFn: fetchData,
    enabled: !isNew && !!id && isAuthenticated && !authLoading,
    meta: {
      onError: (error: Error) => {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: `Failed to load ${type}: ${error.message}`,
          variant: "destructive",
        });
      }
    }
  });
  
  // Type guard to check if data is a Subject
  const isSubject = (data: any): data is SubjectWithProgress => {
    return data && 'description' in data;
  };
  
  // Type guard to check if data is a Lesson
  const isLesson = (data: any): data is Lesson => {
    return data && 'content' in data;
  };
  
  // Load data into form fields when available
  useEffect(() => {
    if (data && !dataLoading && !isInitialized) {
      console.log("Data loaded:", data);
      if (type === "subject" && isSubject(data)) {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setImage(data.image || "");
        setIsInitialized(true);
      } else if (type === "lesson" && isLesson(data)) {
        setTitle(data.title || "");
        setContent(data.content || "");
        setSubjectId(data.subject_id || "");
        setLessonOrder(data.lesson_order || 0);
        setIsInitialized(true);
      }
    }
  }, [data, dataLoading, type, isInitialized]);
  
  // Save mutations
  const subjectMutation = useMutation({
    mutationFn: (subject: any) => {
      if (isNew) {
        return createSubject(subject);
      } else {
        return updateSubject(id, subject);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast({
        title: "Success",
        description: `Subject ${isNew ? "created" : "updated"} successfully!`,
      });
      navigate("/admin/subjects");
    },
    onError: (error: Error) => {
      console.error("Subject mutation error:", error);
      toast({
        title: "Error",
        description: `Failed to save subject: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const lessonMutation = useMutation({
    mutationFn: (lesson: any) => {
      console.log("Submitting lesson:", lesson);
      if (isNew) {
        return createLesson(lesson);
      } else {
        return updateLesson(id, lesson);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", subjectId] });
      toast({
        title: "Success",
        description: `Lesson ${isNew ? "created" : "updated"} successfully!`,
      });
      navigate(`/admin/subjects/${subjectId}/lessons`);
    },
    onError: (error: Error) => {
      console.error("Lesson mutation error:", error);
      toast({
        title: "Error",
        description: `Failed to save lesson: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleSave = () => {
    if (type === "subject") {
      // Validate subject data
      if (!title.trim()) {
        toast({
          title: "Validation Error",
          description: "Subject title is required",
          variant: "destructive",
        });
        return;
      }
      
      // Submit subject
      subjectMutation.mutate({
        title,
        description,
        image: image || null,
      });
    } else if (type === "lesson") {
      // Validate lesson data
      if (!title.trim()) {
        toast({
          title: "Validation Error",
          description: "Lesson title is required",
          variant: "destructive",
        });
        return;
      }
      
      if (!subjectId) {
        toast({
          title: "Validation Error",
          description: "Subject ID is required",
          variant: "destructive",
        });
        return;
      }
      
      // Submit lesson
      lessonMutation.mutate({
        title,
        content,
        subject_id: subjectId,
        lesson_order: lessonOrder,
      });
    }
  };
  
  // Handle content update
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };
  
  // Handle preview tab click to sync content
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Checking authentication...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need admin privileges to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  if (!type || (type !== "subject" && type !== "lesson")) {
    return null; // Will redirect via the useEffect
  }
  
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? `New ${type}` : `Edit ${type}`}</CardTitle>
          <CardDescription>
            {type === "subject"
              ? "Create or edit a subject in your learning platform."
              : "Create or edit a lesson within a subject."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dataLoading && !isNew ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Enter ${type} title`}
                />
              </div>
              
              {type === "subject" ? (
                <>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter subject description"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="image" className="text-sm font-medium">
                      Image URL (optional)
                    </label>
                    <Input
                      id="image"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </>
              ) : (
                <>
                  <Tabs defaultValue="editor" className="w-full" onValueChange={handleTabChange}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="editor" className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium">
                          Lesson Content
                        </label>
                        <div className="min-h-[400px] border rounded-md relative">
                          <RichTextEditor 
                            value={content}
                            onChange={handleContentChange}
                            placeholder="Enter lesson content (rich text and markdown supported)"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Use the toolbar to format text, add images, embed code blocks, and more.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lessonOrder" className="text-sm font-medium">
                          Lesson Order
                        </label>
                        <Input
                          id="lessonOrder"
                          type="number"
                          value={lessonOrder}
                          onChange={(e) => setLessonOrder(Number(e.target.value))}
                          placeholder="Enter lesson order (e.g., 1, 2, 3)"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="preview">
                      <ContentPreview content={content} />
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() =>
              type === "subject"
                ? navigate("/admin/subjects")
                : navigate(`/admin/subjects/${subjectId}/lessons`)
            }
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              subjectMutation.isPending ||
              lessonMutation.isPending ||
              dataLoading
            }
          >
            {subjectMutation.isPending || lessonMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminEditor;

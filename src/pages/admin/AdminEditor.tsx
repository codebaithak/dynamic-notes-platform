
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubjectById, getLessonById, createSubject, updateSubject, createLesson, updateLesson } from "@/api";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type EditorType = "subject" | "lesson";

const AdminEditor = () => {
  const { type, id } = useParams<{ type: EditorType; id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  
  // State for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [lessonOrder, setLessonOrder] = useState(0);
  const [subjectId, setSubjectId] = useState("");
  
  // Validate parameters
  if (!type || (type !== "subject" && type !== "lesson")) {
    navigate("/admin", { replace: true });
    return null;
  }
  
  // If not new, fetch existing data
  const fetchData = async () => {
    if (isNew) return null;
    
    if (type === "subject") {
      return await getSubjectById(id);
    } else {
      return await getLessonById(id);
    }
  };
  
  const { data, isLoading, error } = useQuery({
    queryKey: [type, id],
    queryFn: fetchData,
    enabled: !isNew && !!id,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: `Failed to load ${type}: ${error.message}`,
          variant: "destructive",
        });
      }
    }
  });
  
  // Load data into form fields when available
  useEffect(() => {
    if (data && !isLoading) {
      if (type === "subject") {
        const subject = data;
        setTitle(subject.title);
        setDescription(subject.description);
        setImage(subject.image || "");
      } else if (type === "lesson") {
        const lesson = data;
        setTitle(lesson.title);
        setContent(lesson.content);
        setSubjectId(lesson.subject_id);
        setLessonOrder(lesson.lesson_order);
      }
    }
  }, [data, isLoading, type]);
  
  // Get subject ID from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subjectIdFromUrl = urlParams.get("subjectId");
    
    if (isNew && type === "lesson" && subjectIdFromUrl) {
      setSubjectId(subjectIdFromUrl);
    }
  }, [isNew, type]);
  
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
      toast({
        title: "Error",
        description: `Failed to save subject: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const lessonMutation = useMutation({
    mutationFn: (lesson: any) => {
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
          {isLoading ? (
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
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">
                      Lesson Content
                    </label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter lesson content (markdown supported)"
                      rows={10}
                    />
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
              isLoading
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


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
  Sparkles
} from "lucide-react";
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
import { subjects, lessons } from "@/lib/mock-data";
import { Subject, Lesson, EditorBlock } from "@/types";

type EditorType = 'subject' | 'lesson';

const AdminEditor = () => {
  const { type, id } = useParams<{ type: EditorType, id: string }>();
  const [searchParams] = useSearchParams();
  const subjectIdFromParams = searchParams.get('subjectId');
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectIdFromParams || "");
  const [image, setImage] = useState("");
  const [editorBlocks, setEditorBlocks] = useState<EditorBlock[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showAiPreview, setShowAiPreview] = useState(false);
  const [loading, setLoading] = useState(id !== 'new');

  const isNewItem = id === 'new';
  const isSubjectEditor = type === 'subject';
  const isLessonEditor = type === 'lesson';

  useEffect(() => {
    if (isNewItem) {
      setLoading(false);
      return;
    }

    // In a real app, this would be a database query
    if (isSubjectEditor) {
      const subject = subjects.find(s => s.id === id);
      if (subject) {
        setTitle(subject.title);
        setDescription(subject.description);
        setImage(subject.image);
      }
    } else if (isLessonEditor) {
      // Find the lesson
      let foundLesson: Lesson | undefined;
      let foundSubjectId = "";
      
      // Search through all subjects' lessons
      Object.entries(lessons).forEach(([subjId, lessonList]) => {
        const lesson = lessonList.find(l => l.id === id);
        if (lesson) {
          foundLesson = lesson;
          foundSubjectId = subjId;
        }
      });
      
      if (foundLesson) {
        setTitle(foundLesson.title);
        setContent(foundLesson.content);
        setSelectedSubjectId(foundSubjectId);
      }
    }
    
    setLoading(false);
  }, [id, type, isNewItem, isSubjectEditor, isLessonEditor]);

  const handleSave = () => {
    // In a real app, this would save to the database
    console.log("Saving...", { type, id, title, description, content, selectedSubjectId, image });
    
    if (isSubjectEditor) {
      if (isNewItem) {
        // Create new subject
        const newId = title.toLowerCase().replace(/\s+/g, '-');
        console.log("Creating new subject with ID:", newId);
      } else {
        // Update existing subject
        console.log("Updating subject with ID:", id);
      }
      navigate("/admin/subjects");
    } else if (isLessonEditor) {
      if (isNewItem) {
        // Create new lesson
        const newId = `${selectedSubjectId}-lesson-${Date.now()}`;
        console.log("Creating new lesson with ID:", newId);
      } else {
        // Update existing lesson
        console.log("Updating lesson with ID:", id);
      }
      navigate(`/admin/subjects/${selectedSubjectId}/lessons`);
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, this would delete from the database
    console.log("Deleting...", { type, id });
    
    if (isSubjectEditor) {
      navigate("/admin/subjects");
    } else if (isLessonEditor) {
      navigate(`/admin/subjects/${selectedSubjectId}/lessons`);
    }
    
    setIsDeleteDialogOpen(false);
  };

  const requestAiSuggestion = () => {
    // In a real app, this would call the Gemini API
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

  if (loading) {
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
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                {!isNewItem && (
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
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
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
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

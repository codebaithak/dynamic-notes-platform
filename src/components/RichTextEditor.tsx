
import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, FileUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [editorValue, setEditorValue] = useState('');
  const { toast } = useToast();
  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync the external value with the internal state
  useEffect(() => {
    if (value !== editorValue) {
      setEditorValue(value);
    }
  }, [value]);

  // Handle editor changes
  const handleChange = (newContent: string) => {
    setEditorValue(newContent);
    onChange(newContent);
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    
    input.click();
    
    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return;
      
      const file = input.files[0];
      setIsUploading(true);
      
      try {
        // Upload image to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('lesson-images')
          .upload(fileName, file);
          
        if (error) throw error;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('lesson-images')
          .getPublicUrl(fileName);
          
        // Get the Quill editor instance
        const quill = quillRef.current?.getEditor();
        
        // Insert the image at the current selection point
        if (quill) {
          // The error was here - we need to use a RangeStatic object instead of a number
          const range = quill.getSelection() || { index: 0, length: 0 };
          quill.insertEmbed(range.index, 'image', publicUrl);
          // Move cursor after image
          quill.setSelection(range.index + 1, 0);
        }
        
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } catch (error: any) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: `Failed to upload image: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };
  };

  // Handle Markdown file upload
  const handleMarkdownUpload = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processMarkdownFile = async (file: File) => {
    setIsUploading(true);
    
    try {
      const text = await file.text();
      
      // Set the markdown content directly to the editor
      setEditorValue(text);
      onChange(text);
      
      toast({
        title: "Success",
        description: "Markdown file loaded successfully",
      });
    } catch (error: any) {
      console.error('Error reading markdown file:', error);
      toast({
        title: "Error",
        description: `Failed to read markdown file: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    processMarkdownFile(file);
    
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Custom toolbar options
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'code-block'],
        ['clean']
      ],
      handlers: {
        'image': handleImageUpload
      }
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image', 'code-block'
  ];

  return (
    <div className="rich-text-editor relative min-h-[200px]">
      {isUploading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Processing content...</p>
          </div>
        </div>
      )}
      
      <div className="mb-4 flex items-center gap-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleMarkdownUpload}
          className="flex items-center gap-2"
        >
          <FileUp className="h-4 w-4" />
          Upload Markdown
        </Button>
        <span className="text-sm text-muted-foreground">
          Upload a README.md file or any markdown file
        </span>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="min-h-[200px]"
      />
    </div>
  );
};

export default RichTextEditor;

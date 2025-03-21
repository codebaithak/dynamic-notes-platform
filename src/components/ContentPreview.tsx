
import React from 'react';
import LessonContent from './LessonContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentPreviewProps {
  content: string;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ content }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="markdown">Raw HTML</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="border p-4 rounded-md">
            <LessonContent content={content} />
          </TabsContent>
          <TabsContent value="markdown" className="border p-4 rounded-md">
            <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-2 rounded overflow-x-auto">
              {content}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentPreview;

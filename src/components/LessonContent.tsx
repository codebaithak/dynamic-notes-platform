
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface LessonContentProps {
  content: string;
  previousUrl?: string;
  nextUrl?: string;
  homeUrl?: string;
}

const LessonContent: React.FC<LessonContentProps> = ({ 
  content,
  previousUrl,
  nextUrl,
  homeUrl
}) => {
  if (!content) {
    return null;
  }

  // Tutorial navigation
  const renderNavigation = () => {
    if (!previousUrl && !nextUrl && !homeUrl) return null;

    return (
      <div className="flex justify-between items-center my-6 w-full">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2" 
          disabled={!previousUrl}
          onClick={() => previousUrl && window.location.href = previousUrl}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {homeUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => window.location.href = homeUrl}
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          disabled={!nextUrl}
          onClick={() => nextUrl && window.location.href = nextUrl}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // If content appears to be HTML (from rich text editor)
  if (content.includes('<p>') || content.includes('<h1>') || content.includes('<div>') || content.includes('<img')) {
    return (
      <div className="lesson-content space-y-6">
        {renderNavigation()}
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {renderNavigation()}
      </div>
    );
  }
  
  // Otherwise treat as markdown
  return (
    <div className="lesson-content space-y-6">
      {renderNavigation()}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="my-6">
                  <div className="flex items-center justify-between bg-zinc-800 text-white px-4 py-2 text-sm rounded-t-md">
                    <span>{match[1]}</span>
                    <span className="text-xs opacity-70">Example</span>
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                    className="rounded-t-none"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline" className="mt-1 text-xs">
                      Try it Yourself
                    </Button>
                  </div>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            blockquote({ node, children, ...props }) {
              return (
                <Card className="not-prose p-4 my-6 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                  <blockquote {...props}>{children}</blockquote>
                </Card>
              );
            },
            img({ node, ...props }) {
              return (
                <div className="my-6">
                  <img className="rounded-lg mx-auto max-w-full" {...props} alt={props.alt || "Image"} />
                  {props.alt && (
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      {props.alt}
                    </p>
                  )}
                </div>
              );
            },
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4 py-2 border-b">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold mt-6 mb-3 py-1">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold mt-5 mb-2 text-green-600 dark:text-green-400">
                {children}
              </h3>
            ),
            ul: ({ children }) => (
              <ul className="my-4 list-disc ml-6 space-y-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="my-4 list-decimal ml-6 space-y-2">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="pl-2">{children}</li>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="border-collapse border border-slate-400 w-full">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-slate-400 bg-slate-100 dark:bg-slate-700 p-2 text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-slate-400 p-2">{children}</td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      {renderNavigation()}
    </div>
  );
};

export default LessonContent;

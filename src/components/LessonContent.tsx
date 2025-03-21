
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Card } from '@/components/ui/card';

interface LessonContentProps {
  content: string;
}

const LessonContent: React.FC<LessonContentProps> = ({ content }) => {
  if (!content) {
    return null;
  }

  // If content appears to be HTML (from rich text editor)
  if (content.includes('<p>') || content.includes('<h1>') || content.includes('<div>') || content.includes('<img')) {
    return (
      <div 
        className="lesson-content prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  
  // Otherwise treat as markdown
  return (
    <div className="lesson-content prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          blockquote({ node, children, ...props }) {
            return (
              <Card className="not-prose p-4 my-4 border-l-4 border-blue-500">
                <blockquote {...props}>{children}</blockquote>
              </Card>
            );
          },
          img({ node, ...props }) {
            return (
              <div className="my-4">
                <img className="rounded-lg mx-auto max-w-full" {...props} alt={props.alt || "Image"} />
                {props.alt && (
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {props.alt}
                  </p>
                )}
              </div>
            );
          },
          h1: ({ children }) => <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold mt-5 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default LessonContent;

import { useMemo } from 'react';
import { marked } from 'marked';

interface RenderMarkdownProps {
  content: string;
  className?: string;
}

marked.setOptions({ breaks: false, gfm: true });

export function RenderMarkdown({ content, className }: RenderMarkdownProps) {
  const html = useMemo(() => marked.parse(content) as string, [content]);

  return (
    <div
      className={['prose max-w-none', className].filter(Boolean).join(' ')}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

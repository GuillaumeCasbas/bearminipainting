import { useMemo } from 'react';
import { Marked, Renderer } from 'marked';

interface RenderMarkdownProps {
  content: string;
  className?: string;
}

const renderer: Partial<Renderer> = {
  heading({ tokens, depth }) {
    const text = this.parser!.parseInline(tokens);
    const sizeClass =
      depth === 1 ? 'text-4xl' : depth === 2 ? 'text-2xl' : depth === 3 ? 'text-xl' : 'text-lg';
    return `<h${depth} class="${sizeClass} font-bold text-gray-900 mt-6 mb-3">${text}</h${depth}>`;
  },
  paragraph({ tokens }) {
    const text = this.parser!.parseInline(tokens);
    return `<p class="text-gray-600 mb-4">${text}</p>`;
  },
  list({ items, ordered }) {
    const tag = ordered ? 'ol' : 'ul';
    const cls = ordered
      ? 'list-decimal list-inside text-gray-600 mb-4 space-y-1'
      : 'list-disc list-inside text-gray-600 mb-4 space-y-1';
    const body = items.map((item) => this.listitem!(item)).join('');
    return `<${tag} class="${cls}">${body}</${tag}>`;
  },
  listitem(item) {
    return `<li class="text-gray-600">${this.parser!.parseInline(item.tokens)}</li>`;
  },
  strong({ tokens }) {
    return `<strong class="font-semibold text-gray-900">${this.parser!.parseInline(tokens)}</strong>`;
  },
  link({ tokens, href }) {
    const text = this.parser!.parseInline(tokens);
    return `<a href="${href}" class="text-blue-600 hover:text-blue-800 underline">${text}</a>`;
  },
};

const markedInstance = new Marked({ renderer });

export function RenderMarkdown({ content, className }: RenderMarkdownProps) {
  const html = useMemo(() => markedInstance.parse(content) as string, [content]);

  return (
    <div
      className={['max-w-none', className].filter(Boolean).join(' ')}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

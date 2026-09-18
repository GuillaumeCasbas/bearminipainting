import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RenderMarkdown } from '../../../src/ui/components/RenderMarkdown';

describe('RenderMarkdown', () => {
  it('should render an H1 heading as an <h1> element with Tailwind classes', () => {
    render(<RenderMarkdown content="# Title" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Title');
    expect(heading.tagName).toBe('H1');
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-gray-900');
  });

  it('should render an H2 heading as an <h2> element', () => {
    render(<RenderMarkdown content="## Subtitle" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Subtitle');
  });

  it('should render bold text as <strong> with Tailwind classes', () => {
    render(<RenderMarkdown content="This is **bold** text" />);
    const strong = screen.getByText('bold');
    expect(strong.tagName).toBe('STRONG');
    expect(strong).toHaveClass('font-semibold', 'text-gray-900');
  });

  it('should render an unordered list with list items and Tailwind classes', () => {
    render(
      <RenderMarkdown
        content={`- First item
- Second item
- Third item`}
      />,
    );
    const list = screen.getByRole('list');
    const items = screen.getAllByRole('listitem');
    expect(list.tagName).toBe('UL');
    expect(list).toHaveClass('list-disc', 'list-inside', 'text-gray-600');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('First item');
    expect(items[2]).toHaveTextContent('Third item');
  });

  it('should render a markdown link as an <a> with href and Tailwind classes', () => {
    render(<RenderMarkdown content="[React](https://react.dev)" />);
    const link = screen.getByRole('link', { name: 'React' });
    expect(link).toHaveAttribute('href', 'https://react.dev');
    expect(link).toHaveClass('text-blue-600', 'hover:text-blue-800', 'underline');
  });

  it('should render a paragraph for plain text', () => {
    render(<RenderMarkdown content="Just a paragraph." />);
    expect(screen.getByText('Just a paragraph.').tagName).toBe('P');
  });

  it('should re-render when the content prop changes', () => {
    const { rerender } = render(<RenderMarkdown content="# First" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('First');

    rerender(<RenderMarkdown content="# Second" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Second');
  });

  it('should apply a custom className when provided', () => {
    render(<RenderMarkdown content="# Title" className="custom-prose" />);
    expect(screen.getByText('Title').closest('div')).toHaveClass('custom-prose');
  });
});

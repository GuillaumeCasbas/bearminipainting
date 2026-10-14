import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RenderMarkdown } from '../../../src/ui/components/RenderMarkdown';

describe('RenderMarkdown', () => {
  it('should render an H1 heading as a level 1 heading', () => {
    render(<RenderMarkdown content="# Title" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Title');
  });

  it('should render an H2 heading as a level 2 heading', () => {
    render(<RenderMarkdown content="## Subtitle" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Subtitle');
  });

  it('should render bold text with emphasis', () => {
    render(<RenderMarkdown content="This is **bold** text" />);
    expect(screen.getByText('bold')).toBeInTheDocument();
  });

  it('should render an unordered list with list items', () => {
    render(
      <RenderMarkdown
        content={`
- First item
- Second item
- Third item
`}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('First item');
    expect(items[2]).toHaveTextContent('Third item');
  });

  it('should render a markdown link as a link pointing to its target', () => {
    render(<RenderMarkdown content="[React](https://react.dev)" />);
    const link = screen.getByRole('link', { name: 'React' });
    expect(link).toHaveAttribute('href', 'https://react.dev');
  });

  it('should render plain text content', () => {
    render(<RenderMarkdown content="Just a paragraph." />);
    expect(screen.getByText('Just a paragraph.')).toBeInTheDocument();
  });

  it('strips script tags injected via markdown content (XSS)', () => {
    render(<RenderMarkdown content={'Bold **text** <script>alert("xss")</script>'} />);

    expect(document.querySelector('script')).toBeNull();
    expect(document.body.innerHTML).not.toContain('alert');
  });

  it('neutralizes javascript: URLs from markdown links (XSS)', () => {
    render(<RenderMarkdown content={'[Click me](javascript:alert(1))'} />);

    const links = screen.queryAllByRole('link');
    links.forEach((link) => {
      expect(link.getAttribute('href') ?? '').not.toContain('javascript:');
    });
    expect(document.body.innerHTML).not.toContain('javascript:');
  });

  it('strips event handlers from raw HTML in markdown content (XSS)', () => {
    render(<RenderMarkdown content={'<img src=x onerror=alert(1)>Paragraph.'} />);

    expect(document.body.innerHTML).not.toContain('onerror');
    const img = document.querySelector('img');
    if (img) {
      expect(img.getAttribute('onerror')).toBeNull();
    }
  });

  it('should re-render when the content prop changes', () => {
    const { rerender } = render(<RenderMarkdown content="# First" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('First');
    rerender(<RenderMarkdown content="# Second" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Second');
  });
});

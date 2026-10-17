import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '../../../src/ui/components/Sidebar';

const renderSidebar = (isMobileOpen = false, onMobileOpenChange = jest.fn()) =>
  render(
    <Sidebar
      title="Create a new project"
      isMobileOpen={isMobileOpen}
      onMobileOpenChange={onMobileOpenChange}
    >
      <div data-testid="child">Form content</div>
    </Sidebar>,
  );

describe('Sidebar', () => {
  it('renders a desktop aside with children and no visible title (BEA-47)', () => {
    renderSidebar();
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveAttribute('aria-label', 'Create a new project');
    expect(within(aside).queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders a floating action button to open the sidebar on mobile', () => {
    renderSidebar();
    const fab = screen.getByRole('button', { name: 'Open sidebar' });
    expect(fab).toBeInTheDocument();
  });

  it('requests opening when the FAB is clicked', () => {
    const onMobileOpenChange = jest.fn();
    const { rerender } = renderSidebar(false, onMobileOpenChange);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));
    expect(onMobileOpenChange).toHaveBeenCalledWith(true);
    rerender(
      <Sidebar
        title="Create a new project"
        isMobileOpen={true}
        onMobileOpenChange={onMobileOpenChange}
      >
        <div data-testid="child">Form content</div>
      </Sidebar>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Create a new project');
    expect(within(dialog).getByTestId('child')).toBeInTheDocument();
    const aside = screen.getByRole('complementary');
    expect(within(aside).queryByTestId('child')).not.toBeInTheDocument();
  });

  it('requests closing when the close button is clicked', () => {
    const onMobileOpenChange = jest.fn();
    const { rerender } = renderSidebar(true, onMobileOpenChange);
    const closeButton = screen
      .getAllByRole('button', { name: 'Close sidebar' })
      .find((button) => button === document.activeElement);
    expect(closeButton).toBeDefined();
    fireEvent.click(closeButton!);
    expect(onMobileOpenChange).toHaveBeenCalledWith(false);
    rerender(
      <Sidebar
        title="Create a new project"
        isMobileOpen={false}
        onMobileOpenChange={onMobileOpenChange}
      >
        <div data-testid="child">Form content</div>
      </Sidebar>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('requests closing when clicking outside (backdrop)', () => {
    const onMobileOpenChange = jest.fn();
    const { rerender } = renderSidebar(true, onMobileOpenChange);
    const backdrop = screen
      .getAllByRole('button', { name: 'Close sidebar' })
      .find((button) => button !== document.activeElement);
    expect(backdrop).toBeDefined();
    fireEvent.click(backdrop!);
    expect(onMobileOpenChange).toHaveBeenCalledWith(false);
    rerender(
      <Sidebar
        title="Create a new project"
        isMobileOpen={false}
        onMobileOpenChange={onMobileOpenChange}
      >
        <div data-testid="child">Form content</div>
      </Sidebar>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('requests closing when Escape is pressed', () => {
    const onMobileOpenChange = jest.fn();
    const { rerender } = renderSidebar(true, onMobileOpenChange);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onMobileOpenChange).toHaveBeenCalledWith(false);
    rerender(
      <Sidebar
        title="Create a new project"
        isMobileOpen={false}
        onMobileOpenChange={onMobileOpenChange}
      >
        <div data-testid="child">Form content</div>
      </Sidebar>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

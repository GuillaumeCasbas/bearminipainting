import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '../../../src/ui/components/Sidebar';

describe('Sidebar', () => {
  it('renders a desktop aside with the provided title and children', () => {
    render(
      <Sidebar title="Add a project">
        <div data-testid="child">Form content</div>
      </Sidebar>
    );

    const aside = screen.getByRole('complementary');
    expect(aside).toHaveAttribute('aria-label', 'Add a project');
    expect(screen.getByText('Add a project')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders a floating action button to open the sidebar on mobile', () => {
    render(
      <Sidebar title="Add a project">
        <div>Form content</div>
      </Sidebar>
    );

    const fab = screen.getByRole('button', { name: 'Open sidebar' });
    expect(fab).toBeInTheDocument();
  });

  it('opens the mobile modal when the FAB is clicked', () => {
    render(
      <Sidebar title="Add a project">
        <div data-testid="child">Form content</div>
      </Sidebar>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Add a project');
    // The child is rendered only in the modal (not duplicated in the aside),
    // so input IDs stay unique and labels resolve to the visible inputs.
    expect(within(dialog).getByTestId('child')).toBeInTheDocument();
    const aside = screen.getByRole('complementary');
    expect(within(aside).queryByTestId('child')).not.toBeInTheDocument();
  });

  it('closes the modal when the close button is clicked', () => {
    render(
      <Sidebar title="Add a project">
        <div>Form content</div>
      </Sidebar>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // The dialog contains both the backdrop and the panel; the panel's close
    // button is the second one rendered in DOM order (after the backdrop).
    const closeButtons = screen.getAllByRole('button', { name: 'Close sidebar' });
    fireEvent.click(closeButtons[1]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal when clicking outside (backdrop)', () => {
    render(
      <Sidebar title="Add a project">
        <div>Form content</div>
      </Sidebar>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // The backdrop is the first "Close sidebar" button rendered in DOM order.
    const closeButtons = screen.getAllByRole('button', { name: 'Close sidebar' });
    fireEvent.click(closeButtons[0]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal when Escape is pressed', () => {
    render(
      <Sidebar title="Add a project">
        <div>Form content</div>
      </Sidebar>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

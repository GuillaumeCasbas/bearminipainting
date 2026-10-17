import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { Project } from '@/core/entities/Project';
import { CodeNotUniqueError } from '@/core/errors';
import { useProjectStore } from '@/ui/stores/projectStore';

jest.mock('@/di/container', () => ({
  getAllProjectsUseCase: { execute: jest.fn() },
  createProjectUseCase: { execute: jest.fn() },
  exportDataUseCase: { execute: jest.fn() },
  importDataUseCase: { execute: jest.fn() },
  createUnitUseCase: { execute: jest.fn() },
  getProjectByIdUseCase: { execute: jest.fn() },
  toggleTodoStatusUseCase: { execute: jest.fn() },
  addTodoToUnitUseCase: { execute: jest.fn() },
  deleteTodoUseCase: { execute: jest.fn() },
  deleteProjectUseCase: { execute: jest.fn() },
  deleteUnitUseCase: { execute: jest.fn() },
  reorderTodosUseCase: { execute: jest.fn() },
  updateUnitNameUseCase: { execute: jest.fn() },
  updateProjectNameUseCase: { execute: jest.fn() },
  updateUnitNotesUseCase: { execute: jest.fn() },
}));
import '@testing-library/jest-dom';
import { Sidebar } from '../../../src/ui/components/Sidebar';

describe('Sidebar', () => {
  it('renders a desktop aside with children and no visible title (BEA-47)', () => {
    render(
      <Sidebar title="Create a new project">
        <div data-testid="child">Form content</div>
      </Sidebar>
    );

    const aside = screen.getByRole('complementary');
    expect(aside).toHaveAttribute('aria-label', 'Create a new project');
    expect(within(aside).queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders a floating action button to open the sidebar on mobile', () => {
    render(
      <Sidebar title="Create a new project">
        <div>Form content</div>
      </Sidebar>
    );

    const fab = screen.getByRole('button', { name: 'Open sidebar' });
    expect(fab).toBeInTheDocument();
  });

  it('opens the mobile modal when the FAB is clicked', () => {
    render(
      <Sidebar title="Create a new project">
        <div data-testid="child">Form content</div>
      </Sidebar>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Create a new project');
    // The child is rendered only in the modal (not duplicated in the aside),
    // so input IDs stay unique and labels resolve to the visible inputs.
    expect(within(dialog).getByTestId('child')).toBeInTheDocument();
    const aside = screen.getByRole('complementary');
    expect(within(aside).queryByTestId('child')).not.toBeInTheDocument();
  });

  it('closes the modal when the close button is clicked', () => {
    render(
      <Sidebar title="Create a new project">
        <div data-testid="child">Form content</div>
      </Sidebar>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));

    // When the modal opens, focus moves to the panel's close button.
    const closeButton = screen
      .getAllByRole('button', { name: 'Close sidebar' })
      .find((button) => button === document.activeElement);
    expect(closeButton).toBeDefined();
    fireEvent.click(closeButton!);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal when clicking outside (backdrop)', () => {
    render(
      <Sidebar title="Create a new project">
        <div data-testid="child">Form content</div>
      </Sidebar>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));

    // The backdrop is the close control that did not receive focus on open.
    const backdrop = screen
      .getAllByRole('button', { name: 'Close sidebar' })
      .find((button) => button !== document.activeElement);
    expect(backdrop).toBeDefined();
    fireEvent.click(backdrop!);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal when Escape is pressed', () => {
    render(
      <Sidebar title="Create a new project">
        <div data-testid="child">Form content</div>
      </Sidebar>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('Sidebar PROJECT_CREATED subscription (BEA-93)', () => {
  it('closes the open mobile modal when a project is created', async () => {
    render(
      <Sidebar title="Create a new project">
        <div>Form content</div>
      </Sidebar>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const { createProjectUseCase, getAllProjectsUseCase } = jest.requireMock('@/di/container');
    createProjectUseCase.execute.mockResolvedValueOnce(
      new Project('proj-1', 'Orks', 'ORK', []),
    );
    getAllProjectsUseCase.execute.mockResolvedValueOnce([new Project('proj-1', 'Orks', 'ORK', [])]);

    await act(async () => {
      await useProjectStore.getState().addProject('Orks', 'ORK');
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps the mobile modal open when project creation fails', async () => {
    render(
      <Sidebar title="Create a new project">
        <div>Form content</div>
      </Sidebar>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const { createProjectUseCase } = jest.requireMock('@/di/container');
    createProjectUseCase.execute.mockRejectedValueOnce(new CodeNotUniqueError('ORK'));

    await act(async () => {
      await useProjectStore.getState().addProject('Orks', 'ORK');
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

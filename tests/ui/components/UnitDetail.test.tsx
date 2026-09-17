import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UnitDetail } from '../../../src/ui/components/UnitDetail';
import { Project } from '@/core/entities/Project';
import { Unit } from '@/core/entities/Unit';
import { Todo } from '@/core/entities/Todo';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: () => ({ unitId: 'unit-1' }),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock the project context
const mockGetUnitByIdUseCase = { execute: jest.fn() };
const mockGetProjectByIdUseCase = { execute: jest.fn() };
jest.mock('../../../src/ui/contexts/projectContext', () => ({
  useProjectContext: () => ({
    getUnitByIdUseCase: mockGetUnitByIdUseCase,
    getProjectByIdUseCase: mockGetProjectByIdUseCase,
  }),
}));

// Mock the project store
const mockUpdateUnitName = jest.fn();
const mockUseProjectStore = jest.fn();
jest.mock('../../../src/ui/stores/projectStore', () => ({
  useProjectStore: () => mockUseProjectStore(),
}));

// Mock the UI preferences store
const mockUseUiPreferencesStore = jest.fn();
jest.mock('../../../src/ui/stores/uiPreferencesStore', () => ({
  useUiPreferencesStore: () => mockUseUiPreferencesStore(),
}));

const makeTodo = (id: string, label: string, status: 'TODO' | 'DONE', order: number) =>
  new Todo(id, label, status, order);

const makeUnit = (overrides: Partial<Unit> = {}): Unit =>
  new Unit(
    overrides.id ?? 'unit-1',
    overrides.name ?? 'Intercessor Squad',
    overrides.code ?? 'INT-01',
    overrides.projectId ?? 'project-1',
    overrides.todos ?? [
      makeTodo('todo-1', 'Assembly', 'TODO', 10),
      makeTodo('todo-2', 'Primer', 'TODO', 20),
      makeTodo('todo-3', 'Basecoat', 'DONE', 30),
    ],
  );

const makeProject = (overrides: Partial<Project> = {}): Project =>
  new Project(
    overrides.id ?? 'project-1',
    overrides.name ?? 'Space Marines',
    overrides.code ?? 'SM',
    overrides.units ?? [makeUnit()],
  );

describe('UnitDetail - inline name editing (BEA-38)', () => {
  let mockProjects: Project[];

  beforeEach(() => {
    jest.clearAllMocks();
    mockProjects = [makeProject()];
    mockUseProjectStore.mockReturnValue({
      projects: mockProjects,
      toggleTodoStatus: jest.fn(),
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
      deleteUnit: jest.fn(),
      reorderTodos: jest.fn(),
      updateUnitName: mockUpdateUnitName,
    });
    mockUseUiPreferencesStore.mockReturnValue({
      hideDoneTodos: false,
      setHideDoneTodos: jest.fn(),
    });
  });

  it('should display an edit icon next to the unit name', () => {
    render(<UnitDetail />);

    expect(screen.getByRole('heading', { name: 'Intercessor Squad' })).toBeInTheDocument();
    expect(screen.getByLabelText('Edit unit name')).toBeInTheDocument();
  });

  it('should turn the name into a prefilled input when the edit icon is clicked', () => {
    render(<UnitDetail />);

    fireEvent.click(screen.getByLabelText('Edit unit name'));

    const input = screen.getByLabelText('Edit unit name') as HTMLInputElement;
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveValue('Intercessor Squad');
  });

  it('should display submit (✓) and cancel (✕) buttons in edit mode', () => {
    render(<UnitDetail />);

    fireEvent.click(screen.getByLabelText('Edit unit name'));

    expect(screen.getByLabelText('Save unit name')).toBeInTheDocument();
    expect(screen.getByLabelText('Cancel unit name edit')).toBeInTheDocument();
  });

  it('should save when the submit button is clicked', async () => {
    mockUpdateUnitName.mockResolvedValue(true);

    render(<UnitDetail />);

    fireEvent.click(screen.getByLabelText('Edit unit name'));
    const input = screen.getByLabelText('Edit unit name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Assault Squad' } });
    fireEvent.click(screen.getByLabelText('Save unit name'));

    await waitFor(() => {
      expect(mockUpdateUnitName).toHaveBeenCalledWith('unit-1', 'Assault Squad');
    });
  });

  it('should save when Enter is pressed', async () => {
    mockUpdateUnitName.mockResolvedValue(true);

    render(<UnitDetail />);

    fireEvent.click(screen.getByLabelText('Edit unit name'));
    const input = screen.getByLabelText('Edit unit name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Assault Squad' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(mockUpdateUnitName).toHaveBeenCalledWith('unit-1', 'Assault Squad');
    });
  });

  it('should cancel and restore the original name when the cancel button is clicked', async () => {
    render(<UnitDetail />);

    fireEvent.click(screen.getByLabelText('Edit unit name'));
    const input = screen.getByLabelText('Edit unit name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Changed Name' } });
    fireEvent.click(screen.getByLabelText('Cancel unit name edit'));

    await waitFor(() => {
      expect(mockUpdateUnitName).not.toHaveBeenCalled();
    });
    // Read-only name is restored
    expect(screen.getByRole('heading', { name: 'Intercessor Squad' })).toBeInTheDocument();
  });

  it('should show an error and block save when the name is empty', async () => {
    render(<UnitDetail />);

    fireEvent.click(screen.getByLabelText('Edit unit name'));
    const input = screen.getByLabelText('Edit unit name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByLabelText('Save unit name'));

    await waitFor(() => {
      expect(screen.getByText('Unit name cannot be empty')).toBeInTheDocument();
    });
    expect(mockUpdateUnitName).not.toHaveBeenCalled();
  });

  it('should show an error and block save when the name is whitespace only', async () => {
    render(<UnitDetail />);

    fireEvent.click(screen.getByLabelText('Edit unit name'));
    const input = screen.getByLabelText('Edit unit name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByLabelText('Save unit name'));

    await waitFor(() => {
      expect(screen.getByText('Unit name cannot be empty')).toBeInTheDocument();
    });
    expect(mockUpdateUnitName).not.toHaveBeenCalled();
  });

  it('should keep the input prefilled with the current name when editing starts', () => {
    render(<UnitDetail />);

    fireEvent.click(screen.getByLabelText('Edit unit name'));
    const input = screen.getByLabelText('Edit unit name') as HTMLInputElement;

    expect(input).toHaveValue('Intercessor Squad');
  });

  it('should exit edit mode after a successful save', async () => {
    mockUpdateUnitName.mockResolvedValue(true);

    render(<UnitDetail />);

    fireEvent.click(screen.getByLabelText('Edit unit name'));
    const input = screen.getByLabelText('Edit unit name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Assault Squad' } });
    fireEvent.click(screen.getByLabelText('Save unit name'));

    await waitFor(() => {
      expect(screen.queryByLabelText('Save unit name')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Cancel unit name edit')).not.toBeInTheDocument();
    });
  });

  it('should clear the error when the user starts typing again', async () => {
    render(<UnitDetail />);

    fireEvent.click(screen.getByLabelText('Edit unit name'));
    const input = screen.getByLabelText('Edit unit name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByLabelText('Save unit name'));

    await waitFor(() => {
      expect(screen.getByText('Unit name cannot be empty')).toBeInTheDocument();
    });

    // Start typing again
    fireEvent.change(input, { target: { value: 'A' } });

    await waitFor(() => {
      expect(screen.queryByText('Unit name cannot be empty')).not.toBeInTheDocument();
    });
  });

  it('should not call updateUnitName when the name is unchanged', async () => {
    render(<UnitDetail />);

    fireEvent.click(screen.getByLabelText('Edit unit name'));
    fireEvent.click(screen.getByLabelText('Save unit name'));

    await waitFor(() => {
      expect(mockUpdateUnitName).not.toHaveBeenCalled();
    });
  });

  it('should trim whitespace before saving', async () => {
    mockUpdateUnitName.mockResolvedValue(true);

    render(<UnitDetail />);

    fireEvent.click(screen.getByLabelText('Edit unit name'));
    const input = screen.getByLabelText('Edit unit name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '  Assault Squad  ' } });
    fireEvent.click(screen.getByLabelText('Save unit name'));

    await waitFor(() => {
      expect(mockUpdateUnitName).toHaveBeenCalledWith('unit-1', 'Assault Squad');
    });
  });
});

describe('UnitDetail - toggle DONE todos visibility (BEA-30)', () => {
  let mockProjects: Project[];

  const setupStoreMocks = (hideDoneTodos: boolean, unit?: Unit) => {
    mockProjects = [makeProject({ units: [unit ?? makeUnit()] })];
    mockUseProjectStore.mockReturnValue({
      projects: mockProjects,
      toggleTodoStatus: jest.fn(),
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
      deleteUnit: jest.fn(),
      reorderTodos: jest.fn(),
      updateUnitName: jest.fn(),
    });
    mockUseUiPreferencesStore.mockReturnValue({
      hideDoneTodos,
      setHideDoneTodos: jest.fn(),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When DONE todos are visible (hideDoneTodos = false)', () => {
    it('should display all todos (TODO and DONE)', () => {
      setupStoreMocks(false);

      render(<UnitDetail />);

      expect(screen.getByLabelText('Todo Assembly not completed')).toBeInTheDocument();
      expect(screen.getByLabelText('Todo Primer not completed')).toBeInTheDocument();
      expect(screen.getByLabelText('Todo Basecoat completed')).toBeInTheDocument();
    });

    it('should not show the hidden indicator', () => {
      setupStoreMocks(false);

      render(<UnitDetail />);

      expect(screen.queryByText(/done todo.* hidden/)).not.toBeInTheDocument();
    });

    it('should not show the reordering hint', () => {
      setupStoreMocks(false);

      render(<UnitDetail />);

      expect(
        screen.queryByText('Reordering is only available when all todos are visible.'),
      ).not.toBeInTheDocument();
    });

    it('should reflect true totals in the summary line (all todos)', () => {
      setupStoreMocks(false);

      render(<UnitDetail />);

      // 3 total, 1 completed (over ALL todos)
      expect(screen.getByText(/3 total,/)).toBeInTheDocument();
      expect(screen.getByText(/1 completed/)).toBeInTheDocument();
    });
  });

  describe('When DONE todos are hidden (hideDoneTodos = true)', () => {
    it('should only display TODO todos', () => {
      setupStoreMocks(true);

      render(<UnitDetail />);

      expect(screen.getByLabelText('Todo Assembly not completed')).toBeInTheDocument();
      expect(screen.getByLabelText('Todo Primer not completed')).toBeInTheDocument();
      // DONE todo (Basecoat) is hidden
      expect(screen.queryByLabelText('Todo Basecoat completed')).not.toBeInTheDocument();
    });

    it('should show an indicator with the number of hidden DONE todos', () => {
      setupStoreMocks(true);

      render(<UnitDetail />);

      expect(screen.getByText('1 done todo hidden')).toBeInTheDocument();
    });

    it('should pluralize the indicator when multiple DONE todos are hidden', () => {
      const unit = makeUnit({
        todos: [
          makeTodo('todo-1', 'Assembly', 'TODO', 10),
          makeTodo('todo-2', 'Basecoat', 'DONE', 30),
          makeTodo('todo-3', 'Effects', 'DONE', 40),
        ],
      });
      setupStoreMocks(true, unit);

      render(<UnitDetail />);

      expect(screen.getByText('2 done todos hidden')).toBeInTheDocument();
    });

    it('should show the reordering hint when DONE todos are hidden', () => {
      setupStoreMocks(true);

      render(<UnitDetail />);

      expect(
        screen.getByText('Reordering is only available when all todos are visible.'),
      ).toBeInTheDocument();
    });

    it('should reflect true totals in the summary line (all todos, not just visible)', () => {
      setupStoreMocks(true);

      render(<UnitDetail />);

      // Summary computed over ALL todos: 3 total, 1 completed
      expect(screen.getByText(/3 total,/)).toBeInTheDocument();
      expect(screen.getByText(/1 completed/)).toBeInTheDocument();
    });
  });

  describe('Hidden indicator edge cases', () => {
    it('should not show the indicator when there are no DONE todos (hidden)', () => {
      const unit = makeUnit({
        todos: [
          makeTodo('todo-1', 'Assembly', 'TODO', 10),
          makeTodo('todo-2', 'Primer', 'TODO', 20),
        ],
      });
      setupStoreMocks(true, unit);

      render(<UnitDetail />);

      expect(screen.queryByText(/done todo.* hidden/)).not.toBeInTheDocument();
    });

    it('should not show the indicator when all todos are visible even if some are DONE', () => {
      setupStoreMocks(false);

      render(<UnitDetail />);

      expect(screen.queryByText(/done todo.* hidden/)).not.toBeInTheDocument();
    });
  });

  describe('All todos DONE edge case', () => {
    it('should show a success message when all todos are DONE and DONE are hidden', () => {
      const unit = makeUnit({
        todos: [
          makeTodo('todo-1', 'Assembly', 'DONE', 10),
          makeTodo('todo-2', 'Primer', 'DONE', 20),
          makeTodo('todo-3', 'Basecoat', 'DONE', 30),
        ],
      });
      setupStoreMocks(true, unit);

      render(<UnitDetail />);

      expect(screen.getByText('All todos done 🎉')).toBeInTheDocument();
    });

    it('should keep the "Add a custom todo..." input available when all todos are DONE and hidden', () => {
      const unit = makeUnit({
        todos: [
          makeTodo('todo-1', 'Assembly', 'DONE', 10),
          makeTodo('todo-2', 'Primer', 'DONE', 20),
        ],
      });
      setupStoreMocks(true, unit);

      render(<UnitDetail />);

      expect(screen.getByPlaceholderText('Add a custom todo...')).toBeInTheDocument();
    });

    it('should not show the success message when all todos are DONE but DONE are visible', () => {
      const unit = makeUnit({
        todos: [
          makeTodo('todo-1', 'Assembly', 'DONE', 10),
          makeTodo('todo-2', 'Primer', 'DONE', 20),
        ],
      });
      setupStoreMocks(false, unit);

      render(<UnitDetail />);

      expect(screen.queryByText('All todos done 🎉')).not.toBeInTheDocument();
    });
  });

  describe('No todos edge case', () => {
    it('should show the empty state when a unit has no todos', () => {
      const unit = makeUnit({ todos: [] });
      setupStoreMocks(false, unit);

      render(<UnitDetail />);

      expect(screen.getByText('No todos for this unit.')).toBeInTheDocument();
      expect(screen.queryByText('All todos done 🎉')).not.toBeInTheDocument();
      expect(screen.queryByText(/done todo.* hidden/)).not.toBeInTheDocument();
    });

    it('should show the empty state when a unit has no todos even when DONE are hidden', () => {
      const unit = makeUnit({ todos: [] });
      setupStoreMocks(true, unit);

      render(<UnitDetail />);

      expect(screen.getByText('No todos for this unit.')).toBeInTheDocument();
      expect(screen.queryByText('All todos done 🎉')).not.toBeInTheDocument();
    });
  });

  describe('Completion rate always visible', () => {
    it('should display the completion rate when DONE todos are hidden', () => {
      setupStoreMocks(true);

      render(<UnitDetail />);

      // Unit has 1/3 done => 33%
      expect(screen.getByText('33%')).toBeInTheDocument();
    });

    it('should display the completion rate when DONE todos are visible', () => {
      setupStoreMocks(false);

      render(<UnitDetail />);

      expect(screen.getByText('33%')).toBeInTheDocument();
    });
  });
});

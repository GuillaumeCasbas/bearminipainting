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

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectDetail } from '../../../src/ui/components/ProjectDetail';
import { Project } from '@/core/entities/Project';
import { Unit } from '@/core/entities/Unit';
import { Todo } from '@/core/entities/Todo';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'project-1' }),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock the project context
const mockGetProjectByIdUseCase = { execute: jest.fn() };
jest.mock('../../../src/ui/contexts/projectContext', () => ({
  useProjectContext: () => ({
    getProjectByIdUseCase: mockGetProjectByIdUseCase,
  }),
}));

// Mock the project store
const mockAddUnit = jest.fn();
const mockDeleteProject = jest.fn();
jest.mock('../../../src/ui/stores/projectStore', () => ({
  useProjectStore: () => ({
    addUnit: mockAddUnit,
    deleteProject: mockDeleteProject,
  }),
}));

const makeTodo = (id: string, label: string, status: 'TODO' | 'DONE', order: number) =>
  new Todo(id, label, status, order);

const makeUnit = (id: string, name: string, code: string): Unit =>
  new Unit(id, name, code, 'project-1', [makeTodo('todo-1', 'Assembly', 'TODO', 10)]);

const makeProject = (units: Unit[]): Project =>
  new Project('project-1', 'Space Marines', 'SM', units);

describe('ProjectDetail add unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProjectByIdUseCase.execute.mockResolvedValue(makeProject([]));
  });

  it('displays the newly added unit immediately without re-fetching the project', async () => {
    mockGetProjectByIdUseCase.execute.mockResolvedValueOnce(makeProject([]));
    const updatedProject = makeProject([makeUnit('unit-1', 'Intercessors', 'INT-01')]);
    mockAddUnit.mockResolvedValueOnce(updatedProject);

    render(<ProjectDetail />);

    fireEvent.click(await screen.findByText('Add Unit'));
    const [nameInput, codeInput] = screen.getAllByRole('textbox');
    fireEvent.change(nameInput, { target: { value: 'Intercessors' } });
    fireEvent.change(codeInput, { target: { value: 'INT-01' } });
    fireEvent.click(screen.getByText('Submit'));

    expect(await screen.findByText('Intercessors')).toBeInTheDocument();

    // The initial load is the only call to getProjectByIdUseCase
    await waitFor(() => {
      expect(mockGetProjectByIdUseCase.execute).toHaveBeenCalledTimes(1);
    });
    expect(mockAddUnit).toHaveBeenCalledWith('project-1', 'Intercessors', 'INT-01');
  });

  it('keeps the previous display when addUnit returns null', async () => {
    mockGetProjectByIdUseCase.execute.mockResolvedValueOnce(makeProject([]));
    mockAddUnit.mockResolvedValueOnce(null);

    render(<ProjectDetail />);

    fireEvent.click(await screen.findByText('Add Unit'));
    const [nameInput, codeInput] = screen.getAllByRole('textbox');
    fireEvent.change(nameInput, { target: { value: 'Intercessors' } });
    fireEvent.change(codeInput, { target: { value: 'INT-01' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockAddUnit).toHaveBeenCalledTimes(1);
    });
    expect(
      screen.getByText('No units, please add new one to start your wonderful painting journey!'),
    ).toBeInTheDocument();
    expect(mockGetProjectByIdUseCase.execute).toHaveBeenCalledTimes(1);
  });
});

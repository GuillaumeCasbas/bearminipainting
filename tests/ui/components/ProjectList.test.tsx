import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectList from '../../../src/ui/components/ProjectList';
import { Project } from '@/core/entities/Project';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock the useProjectStore
const mockProjects: Project[] = [];
const mockIsLoading = false;
const mockUseProjectStore = jest.fn();

jest.mock('../../../src/ui/stores/projectStore', () => ({
  useProjectStore: () => mockUseProjectStore(),
}));

// Helper to create a test project
const createTestProject = (overrides = {}): Project => {
  return {
    ...new Project('test-id-1', 'Test Project', 'TEST-001', []),
    getCompletionRate: () => 0,
    ...overrides,
  };
};

describe('ProjectList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProjectStore.mockReturnValue({
      projects: mockProjects,
      isLoading: mockIsLoading,
    });
  });

  it('should display loading state', () => {
    mockUseProjectStore.mockReturnValue({
      projects: [],
      isLoading: true,
    });

    render(<ProjectList />);

    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
  });

  it('should display empty state when no projects', () => {
    render(<ProjectList />);

    expect(screen.getByText('My Projects')).toBeInTheDocument();
    expect(screen.getByText('No projects created yet.')).toBeInTheDocument();
  });

  it('should display projects in a table', () => {
    const testProject = createTestProject({
      id: 'proj-1',
      name: 'Space Marines',
      code: 'SM',
    });

    mockUseProjectStore.mockReturnValue({
      projects: [testProject],
      isLoading: false,
    });

    render(<ProjectList />);

    expect(screen.getByText('My Projects')).toBeInTheDocument();
    expect(screen.getByText('Space Marines')).toBeInTheDocument();
    expect(screen.getByText('SM')).toBeInTheDocument();
    // ID is truncated to 8 chars + "..."
    expect(screen.getByText('proj-1...')).toBeInTheDocument();
  });

  it('should display multiple projects', () => {
    const project1 = createTestProject({
      id: 'proj-1',
      name: 'Space Marines',
      code: 'SM',
    });
    const project2 = createTestProject({
      id: 'proj-2',
      name: 'Orks',
      code: 'ORK',
    });

    mockUseProjectStore.mockReturnValue({
      projects: [project1, project2],
      isLoading: false,
    });

    render(<ProjectList />);

    expect(screen.getByText('Space Marines')).toBeInTheDocument();
    expect(screen.getByText('Orks')).toBeInTheDocument();
    expect(screen.getByText('SM')).toBeInTheDocument();
    expect(screen.getByText('ORK')).toBeInTheDocument();
  });

  it('should display completion rate for each project', () => {
    const project = createTestProject({
      id: 'proj-1',
      name: 'Test Project',
      code: 'TEST',
      getCompletionRate: () => 50,
    });

    mockUseProjectStore.mockReturnValue({
      projects: [project],
      isLoading: false,
    });

    render(<ProjectList />);

    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should display table headers', () => {
    const project = createTestProject();

    mockUseProjectStore.mockReturnValue({
      projects: [project],
      isLoading: false,
    });

    render(<ProjectList />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
  });

  it('should truncate long project IDs', () => {
    const project = createTestProject({
      id: 'very-long-project-id-12345678',
      name: 'Test Project',
      code: 'TEST',
    });

    mockUseProjectStore.mockReturnValue({
      projects: [project],
      isLoading: false,
    });

    render(<ProjectList />);

    // Should display first 8 characters + "..." (very-lon + ...)
    expect(screen.getByText('very-lon...')).toBeInTheDocument();
  });

  describe('Completion rate badge colors (BEA-26)', () => {
    it('should display red badge for completion rate < 20%', () => {
      const project = createTestProject({
        id: 'proj-1',
        name: 'Test Project',
        code: 'TEST',
        getCompletionRate: () => 10,
      });

      mockUseProjectStore.mockReturnValue({
        projects: [project],
        isLoading: false,
      });

      render(<ProjectList />);

      const badge = screen.getByText('10%');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-red-500');
      expect(badge).toHaveClass('text-white');
    });

    it('should display orange badge for completion rate >= 20% and < 80%', () => {
      const project = createTestProject({
        id: 'proj-1',
        name: 'Test Project',
        code: 'TEST',
        getCompletionRate: () => 50,
      });

      mockUseProjectStore.mockReturnValue({
        projects: [project],
        isLoading: false,
      });

      render(<ProjectList />);

      const badge = screen.getByText('50%');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-orange-500');
      expect(badge).toHaveClass('text-white');
    });

    it('should display yellow badge for completion rate >= 80% and < 100%', () => {
      const project = createTestProject({
        id: 'proj-1',
        name: 'Test Project',
        code: 'TEST',
        getCompletionRate: () => 90,
      });

      mockUseProjectStore.mockReturnValue({
        projects: [project],
        isLoading: false,
      });

      render(<ProjectList />);

      const badge = screen.getByText('90%');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-yellow-500');
      expect(badge).toHaveClass('text-gray-800');
    });

    it('should display green badge for completion rate = 100%', () => {
      const project = createTestProject({
        id: 'proj-1',
        name: 'Test Project',
        code: 'TEST',
        getCompletionRate: () => 100,
      });

      mockUseProjectStore.mockReturnValue({
        projects: [project],
        isLoading: false,
      });

      render(<ProjectList />);

      const badge = screen.getByText('100%');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-green-500');
      expect(badge).toHaveClass('text-white');
    });
  });

  describe('Project list sorting (BEA-31)', () => {
    const makeProject = (id: string, name: string, code: string, rate: number): Project =>
      ({
        ...new Project(id, name, code, []),
        getCompletionRate: () => rate,
      }) as Project;

    const getRenderedNames = () =>
      screen.getAllByRole('row').slice(1).map((row) =>
        row.querySelector('a')?.textContent ?? ''
      );

    it('sorts projects by completion rate descending', () => {
      const projects = [
        makeProject('id-3', 'Bravo', 'B', 30),
        makeProject('id-1', 'Alpha', 'A', 90),
        makeProject('id-2', 'Charlie', 'C', 50),
      ];

      mockUseProjectStore.mockReturnValue({ projects, isLoading: false });
      render(<ProjectList />);

      expect(getRenderedNames()).toEqual(['Alpha', 'Charlie', 'Bravo']);
    });

    it('sorts projects with equal completion rate alphabetically by name (ASC)', () => {
      const projects = [
        makeProject('id-2', 'Orks', 'O', 50),
        makeProject('id-1', 'Space Marines', 'SM', 50),
        makeProject('id-3', 'Adeptus Custodes', 'AC', 50),
      ];

      mockUseProjectStore.mockReturnValue({ projects, isLoading: false });
      render(<ProjectList />);

      expect(getRenderedNames()).toEqual(['Adeptus Custodes', 'Orks', 'Space Marines']);
    });

    it('uses a deterministic tiebreak by id when completion rate and name are equal', () => {
      const projects = [
        makeProject('id-z', 'Twin', 'T2', 50),
        makeProject('id-a', 'Twin', 'T1', 50),
      ];

      mockUseProjectStore.mockReturnValue({ projects, isLoading: false });
      render(<ProjectList />);

      // id-a before id-z
      const rows = screen.getAllByRole('row').slice(1);
      expect(rows[0].textContent).toContain('id-a');
      expect(rows[1].textContent).toContain('id-z');
    });

    it('does not mutate the original projects array order in the store', () => {
      const projects = [
        makeProject('id-3', 'Bravo', 'B', 30),
        makeProject('id-1', 'Alpha', 'A', 90),
      ];
      const originalOrder = projects.map((p) => p.id);

      mockUseProjectStore.mockReturnValue({ projects, isLoading: false });
      render(<ProjectList />);

      expect(projects.map((p) => p.id)).toEqual(originalOrder);
    });
  });
});

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

const getRenderedCards = () => screen.getAllByTestId('project-card');

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

  it('should display one card per project instead of a table (BEA-47)', () => {
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

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByText('Space Marines')).toBeInTheDocument();
    expect(screen.getByText('Orks')).toBeInTheDocument();
    expect(screen.getByText('SM')).toBeInTheDocument();
    expect(screen.getByText('ORK')).toBeInTheDocument();
    expect(getRenderedCards()).toHaveLength(2);
  });

  it('should link each project name to its detail page', () => {
    const project = createTestProject({
      id: 'proj-1',
      name: 'Space Marines',
      code: 'SM',
    });

    mockUseProjectStore.mockReturnValue({
      projects: [project],
      isLoading: false,
    });

    render(<ProjectList />);

    const link = screen.getByRole('link', { name: 'Space Marines' });
    expect(link).toHaveAttribute('href', '/projects/proj-1');
  });

  it('should not display the internal project UUID (BEA-47)', () => {
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

    expect(screen.queryByText('very-lon...')).not.toBeInTheDocument();
    expect(screen.queryByText(/very-long-project-id/)).not.toBeInTheDocument();
  });

  it('should display the completion rate with a progress bar for each project (BEA-47)', () => {
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
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
  });

  describe('Project list sorting (BEA-31)', () => {
    const makeProject = (id: string, name: string, code: string, rate: number): Project =>
      ({
        ...new Project(id, name, code, []),
        getCompletionRate: () => rate,
      }) as Project;

    const getRenderedNames = () =>
      screen.getAllByRole('link').map((link) => link.textContent ?? '');

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

      const codes = screen
        .getAllByText(/T[12]/)
        .map((element) => element.textContent ?? '');
      expect(codes).toEqual(['T1', 'T2']);
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

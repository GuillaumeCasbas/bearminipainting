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
});

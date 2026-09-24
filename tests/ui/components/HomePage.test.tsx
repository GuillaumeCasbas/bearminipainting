import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HomePage } from '../../../src/ui/components/HomePage';

// Mock the child components to isolate HomePage layout tests
jest.mock('../../../src/ui/components/ProjectList', () => ({
  __esModule: true,
  default: () => <div data-testid="project-list">ProjectList</div>,
}));

jest.mock('../../../src/ui/components/ProjectForm', () => ({
  __esModule: true,
  ProjectForm: () => (
    <div data-testid="project-form">
      <h2>Create a new project</h2>
    </div>
  ),
}));

jest.mock('../../../src/ui/components/Sidebar', () => ({
  __esModule: true,
  Sidebar: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <aside data-testid="sidebar" aria-label={title}>
      {children}
    </aside>
  ),
}));

describe('HomePage', () => {
  it('renders the project list in the main area', () => {
    render(<HomePage />);

    expect(screen.getByTestId('project-list')).toBeInTheDocument();
  });

  it('renders the project form inside the sidebar', () => {
    render(<HomePage />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toContainElement(screen.getByTestId('project-form'));
  });

  it('labels the sidebar with the form title (BEA-47)', () => {
    render(<HomePage />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('aria-label', 'Create a new project');
  });

  it('renders main and sidebar as siblings', () => {
    render(<HomePage />);

    const main = screen.getByTestId('project-list').closest('main');
    const sidebar = screen.getByTestId('sidebar');

    expect(main).toBeInTheDocument();
    expect(sidebar).toBeInTheDocument();
    // Both are children of the layout container
    const layout = main?.parentElement;
    expect(layout).toContainElement(sidebar);
  });
});

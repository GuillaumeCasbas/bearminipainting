import { render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HomePage } from '../../../src/ui/components/HomePage';

// Mock the child components to isolate HomePage layout tests
jest.mock('../../../src/ui/components/ProjectList', () => ({
  __esModule: true,
  default: () => <div>ProjectList</div>,
}));
jest.mock('../../../src/ui/components/ProjectForm', () => ({
  __esModule: true,
  ProjectForm: () => (
    <div>
      <h2>Create a new project</h2>
    </div>
  ),
}));
jest.mock('../../../src/ui/components/Sidebar', () => ({
  __esModule: true,
  Sidebar: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <aside aria-label={title}>{children}</aside>
  ),
}));

jest.mock('../../../src/ui/stores/projectStore', () => ({
  useProjectStore: () => ({ projects: [] }),
}));

const renderHomePageSettled = async () => {
  render(<HomePage />);
  await waitFor(() => {
    expect(
      screen.getByText('Nothing that close yet. Push a miniature to the final stretch!'),
    ).toBeInTheDocument();
  });
};

describe('HomePage', () => {
  it('renders the project list in the main area', async () => {
    await renderHomePageSettled();
    const main = screen.getByRole('main');
    expect(within(main).getByText('ProjectList')).toBeInTheDocument();
  });

  it('renders the project form inside the sidebar', async () => {
    await renderHomePageSettled();
    const sidebar = screen.getByRole('complementary');
    expect(
      within(sidebar).getByRole('heading', { name: 'Create a new project' }),
    ).toBeInTheDocument();
  });

  it('labels the sidebar with the form title (BEA-47)', async () => {
    await renderHomePageSettled();
    expect(
      screen.getByRole('complementary', { name: 'Create a new project' }),
    ).toBeInTheDocument();
  });

  it('renders the "Almost there!" section in the main area, below the project list (BEA-48)', async () => {
    await renderHomePageSettled();
    const main = screen.getByRole('main');
    expect(
      within(main).getByRole('heading', { name: 'Almost there!' }),
    ).toBeInTheDocument();
  });
});

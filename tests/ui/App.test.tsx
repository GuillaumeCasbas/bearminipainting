import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../../src/ui/App';

let initialEntry = '/';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
  ),
}));

jest.mock('../../src/ui/stores/projectStore', () => ({
  useProjectStore: () => ({
    loadProjects: jest.fn(),
    toasts: [],
    removeToast: jest.fn(),
  }),
}));

jest.mock('../../src/ui/stores/uiPreferencesStore', () => ({
  useUiPreferencesStore: () => ({ initFromStorage: jest.fn() }),
}));

jest.mock('../../src/ui/components/HomePage', () => ({
  HomePage: () => <div data-testid="home-page" />,
}));

jest.mock('../../src/ui/components/ProjectDetail', () => ({
  ProjectDetail: () => <div data-testid="project-detail" />,
}));

jest.mock('../../src/ui/components/UnitDetail', () => ({
  UnitDetail: () => <div data-testid="unit-detail" />,
}));

jest.mock('../../src/ui/pages/AboutPage', () => ({
  AboutPage: () => <div data-testid="about-page" />,
}));

jest.mock('../../src/ui/components/SettingsPage', () => ({
  SettingsPage: () => <div data-testid="settings-page" />,
}));

const renderAppAt = (initialPath: string) => {
  initialEntry = initialPath;
  render(<App />);
};

describe('App layout (BEA-61)', () => {
  it('shows the "Hide completed todos" toggle only on the unit detail page', () => {
    renderAppAt('/units/unit-1');
    expect(
      screen.getByRole('button', { name: 'Hide completed todos' }),
    ).toBeInTheDocument();
  });

  it('hides the "Hide completed todos" toggle on other pages', () => {
    renderAppAt('/projects/project-1');
    expect(
      screen.queryByRole('button', { name: 'Hide completed todos' }),
    ).not.toBeInTheDocument();
  });

  it('renders the navbar and the footer on every page', () => {
    renderAppAt('/settings');

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

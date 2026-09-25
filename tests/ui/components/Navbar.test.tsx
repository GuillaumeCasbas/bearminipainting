import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from '../../../src/ui/components/Navbar';

const renderNavbarAt = (initialPath: string) => {
  let currentPath = '';
  function LocationProbe() {
    const location = useLocation();
    currentPath = location.pathname;
    return null;
  }

  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />
      <Routes>
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );

  return {
    getCurrentPath: () => currentPath,
  };
};

describe('Navbar', () => {
  it('should display the brand title as a link that navigates to the home page', async () => {
    const { getCurrentPath } = renderNavbarAt('/settings');

    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: 'MiniPaint' }));

    await waitFor(() => {
      expect(getCurrentPath()).toBe('/');
    });
  });

  it('should navigate to the settings page when the Settings link is clicked', async () => {
    const { getCurrentPath } = renderNavbarAt('/');

    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: 'Settings' }));

    await waitFor(() => {
      expect(getCurrentPath()).toBe('/settings');
    });
  });

  it('should navigate to the about page when the About link is clicked', async () => {
    const { getCurrentPath } = renderNavbarAt('/');

    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: 'About' }));

    await waitFor(() => {
      expect(getCurrentPath()).toBe('/about');
    });
  });

  it('should expose the Changelog link as an external link opening in a new tab', () => {
    renderNavbarAt('/');

    const changelogLink = screen.getByRole('link', { name: 'Changelog' });
    expect(changelogLink).toHaveAttribute('href', expect.stringContaining('CHANGELOG.md'));
    expect(changelogLink).toHaveAttribute('target', '_blank');
    expect(changelogLink).toHaveAttribute('rel', 'noreferrer');
  });

  it('should mark the Settings link as current on the settings page', () => {
    renderNavbarAt('/settings');

    const settingsLink = screen.getByRole('link', { name: 'Settings', current: 'page' });
    expect(settingsLink).toBeInTheDocument();
  });

  it('should mark the About link as current on the about page', () => {
    renderNavbarAt('/about');

    const aboutLink = screen.getByRole('link', { name: 'About', current: 'page' });
    expect(aboutLink).toBeInTheDocument();
  });

  it('should not mark any link as current on the home page', () => {
    renderNavbarAt('/');

    expect(screen.queryByRole('link', { current: 'page' })).not.toBeInTheDocument();
  });

  it('should expose the navigation in a navigation landmark', () => {
    renderNavbarAt('/');

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render the brand as the page heading on the home page (BEA-61)', () => {
    renderNavbarAt('/');

    expect(screen.getByRole('heading', { name: 'MiniPaint', level: 1 })).toBeInTheDocument();
  });

  it('should not render a heading on non-home pages so each page keeps a single h1 (BEA-61)', () => {
    renderNavbarAt('/settings');

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'MiniPaint' })).toBeInTheDocument();
  });

  it('should display the tagline under the navbar on the home page only (BEA-61)', () => {
    renderNavbarAt('/');
    expect(screen.getByText('Track your miniature painting progress')).toBeInTheDocument();
  });

  it('should not display the tagline on non-home pages (BEA-61)', () => {
    renderNavbarAt('/about');

    expect(screen.queryByText('Track your miniature painting progress')).not.toBeInTheDocument();
  });
});

const setViewport = (isDesktop: boolean) => {
  window.matchMedia = (query: string) => ({
    matches: isDesktop,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
};

describe('Navbar responsive menu (BEA-62)', () => {
  afterEach(() => {
    setViewport(true);
  });

  it('shows a hamburger button on small screens', () => {
    setViewport(false);
    renderNavbarAt('/');

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('keeps the brand visible next to the hamburger button on small screens', () => {
    setViewport(false);
    renderNavbarAt('/');

    expect(screen.getByRole('link', { name: 'MiniPaint' })).toBeInTheDocument();
  });

  it('does not show a hamburger button on large screens', () => {
    setViewport(true);
    renderNavbarAt('/');

    expect(screen.queryByRole('button', { name: 'Open menu' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
  });

  it('has the menu closed by default on small screens', () => {
    setViewport(false);
    renderNavbarAt('/');

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument();
  });

  it('opens the menu when the hamburger button is clicked', async () => {
    setViewport(false);
    renderNavbarAt('/');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Changelog' })).toBeInTheDocument();
  });

  it('closes the menu after a link is clicked', async () => {
    setViewport(false);
    renderNavbarAt('/');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('link', { name: 'Settings' }));

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByRole('link', { name: 'About' })).not.toBeInTheDocument();
  });
});

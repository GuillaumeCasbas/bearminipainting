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
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AlmostThereSection } from '../../../src/ui/components/AlmostThereSection';
import { Unit } from '@/core/entities/Unit';
import { Todo } from '@/core/entities/Todo';

const makeUnit = (
  id: string,
  name: string,
  doneTodos: number,
  totalTodos: number,
): Unit => {
  const todos = Array.from(
    { length: totalTodos },
    (_, index) =>
      new Todo(
        `todo-${id}-${index}`,
        `Task ${index + 1}`,
        index < doneTodos ? 'DONE' : 'TODO',
        (index + 1) * 10,
      ),
  );
  return new Unit(id, name, `UNIT-${id}`, 'project-1', todos);
};

const mockUseProjectStore = jest.fn();

jest.mock('../../../src/ui/stores/projectStore', () => ({
  useProjectStore: () => mockUseProjectStore(),
}));

const renderSection = () => {
  let currentPath = '';
  function LocationProbe() {
    const location = useLocation();
    currentPath = location.pathname;
    return null;
  }

  render(
    <MemoryRouter>
      <AlmostThereSection />
      <Routes>
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );

  return { getCurrentPath: () => currentPath };
};

describe('AlmostThereSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays the section title "Almost there!"', async () => {
    mockUseProjectStore.mockReturnValue({ projects: [] });
    renderSection();

    expect(screen.getByRole('heading', { name: 'Almost there!' })).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByText(
          'Nothing above 75% yet. Push a miniature to the final stretch!',
        ),
      ).toBeInTheDocument();
    });
  });

  it('displays eligible units with their name and completion rate', async () => {
    const unit = makeUnit('u1', 'Intercessors', 3, 4);
    mockUseProjectStore.mockReturnValue({
      projects: [
        { id: 'p1', name: 'Project', code: 'P', units: [unit] },
      ],
    });
    renderSection();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Intercessors' })).toBeInTheDocument();
    });
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('displays at most 3 eligible units sorted by completion rate', async () => {
    const units = [
      makeUnit('u1', 'Ninety', 9, 10),
      makeUnit('u2', 'Eighty', 8, 10),
      makeUnit('u3', 'Ninety-five', 19, 20),
      makeUnit('u4', 'Eighty-five', 17, 20),
    ];
    mockUseProjectStore.mockReturnValue({
      projects: [{ id: 'p1', name: 'Project', code: 'P', units }],
    });
    renderSection();

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      expect(links.map((link) => link.textContent)).toEqual([
        'Ninety-five',
        'Ninety',
        'Eighty-five',
      ]);
    });
  });

  it('never displays units at 100% or below 75%', async () => {
    const units = [
      makeUnit('u1', 'Finished', 4, 4),
      makeUnit('u2', 'Barely started', 1, 4),
    ];
    mockUseProjectStore.mockReturnValue({
      projects: [{ id: 'p1', name: 'Project', code: 'P', units }],
    });
    renderSection();

    await waitFor(() => {
      expect(
        screen.getByText(
          'Nothing above 75% yet. Push a miniature to the final stretch!',
        ),
      ).toBeInTheDocument();
    });
  });

  it('navigates to the unit detail page when a unit is clicked', async () => {
    const unit = makeUnit('u1', 'Intercessors', 3, 4);
    mockUseProjectStore.mockReturnValue({
      projects: [{ id: 'p1', name: 'Project', code: 'P', units: [unit] }],
    });
    const { getCurrentPath } = renderSection();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Intercessors' })).toBeInTheDocument();
    });
    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: 'Intercessors' }));

    await waitFor(() => {
      expect(getCurrentPath()).toBe('/units/u1');
    });
  });

  it('displays the empty state message when no unit is eligible', async () => {
    mockUseProjectStore.mockReturnValue({
      projects: [{ id: 'p1', name: 'Project', code: 'P', units: [] }],
    });
    renderSection();

    await waitFor(() => {
      expect(
        screen.getByText(
          'Nothing above 75% yet. Push a miniature to the final stretch!',
        ),
      ).toBeInTheDocument();
    });
  });
});

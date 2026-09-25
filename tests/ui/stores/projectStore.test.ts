import '@testing-library/jest-dom';
import { Project } from '@/core/entities/Project';
import { Unit } from '@/core/entities/Unit';
import { UnitCodeNotUniqueError } from '@/core/errors';

const mockCreateUnitUseCase = { execute: jest.fn() };
const mockGetProjectByIdUseCase = { execute: jest.fn() };

jest.mock('@/di/container', () => ({
  getAllProjectsUseCase: { execute: jest.fn() },
  createProjectUseCase: { execute: jest.fn() },
  exportDataUseCase: { execute: jest.fn() },
  importDataUseCase: { execute: jest.fn() },
  createUnitUseCase: mockCreateUnitUseCase,
  getProjectByIdUseCase: mockGetProjectByIdUseCase,
  toggleTodoStatusUseCase: { execute: jest.fn() },
  addTodoToUnitUseCase: { execute: jest.fn() },
  deleteTodoUseCase: { execute: jest.fn() },
  deleteProjectUseCase: { execute: jest.fn() },
  deleteUnitUseCase: { execute: jest.fn() },
  reorderTodosUseCase: { execute: jest.fn() },
  updateUnitNameUseCase: { execute: jest.fn() },
}));

import { useProjectStore } from '@/ui/stores/projectStore';

const makeUnit = (id: string, name: string, code: string): Unit =>
  new Unit(id, name, code, 'project-1', []);

describe('projectStore addUnit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProjectStore.setState({
      projects: [new Project('project-1', 'Space Marines', 'SM', [])],
      isLoading: false,
      toasts: [],
    });
  });

  it('returns the updated project with the new unit appended', async () => {
    const newUnit = makeUnit('unit-1', 'Intercessors', 'INT-01');
    mockCreateUnitUseCase.execute.mockResolvedValueOnce(newUnit);

    const result = await useProjectStore.getState().addUnit('project-1', 'Intercessors', 'INT-01');

    expect(result).not.toBeNull();
    expect(result!.id).toBe('project-1');
    expect(result!.units).toHaveLength(1);
    expect(result!.units[0].id).toBe('unit-1');
    expect(result!.units[0].name).toBe('Intercessors');
  });

  it('updates the store state without re-fetching the project', async () => {
    const newUnit = makeUnit('unit-2', 'Eradicators', 'ERA-01');
    mockCreateUnitUseCase.execute.mockResolvedValueOnce(newUnit);

    await useProjectStore.getState().addUnit('project-1', 'Eradicators', 'ERA-01');

    const storedProject = useProjectStore.getState().projects.find((p) => p.id === 'project-1');
    expect(storedProject!.units).toHaveLength(1);
    expect(storedProject!.units[0].id).toBe('unit-2');
    expect(mockGetProjectByIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('shows a success toast after adding a unit', async () => {
    const newUnit = makeUnit('unit-3', 'Infiltrators', 'INF-01');
    mockCreateUnitUseCase.execute.mockResolvedValueOnce(newUnit);

    await useProjectStore.getState().addUnit('project-1', 'Infiltrators', 'INF-01');

    const toasts = useProjectStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toContain('Infiltrators');
  });

  it('returns null and shows an error toast on UnitCodeNotUniqueError', async () => {
    mockCreateUnitUseCase.execute.mockRejectedValueOnce(new UnitCodeNotUniqueError('INT-01'));

    const result = await useProjectStore.getState().addUnit('project-1', 'Intercessors', 'INT-01');

    expect(result).toBeNull();
    const toasts = useProjectStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].type).toBe('error');
  });

  it('does not modify the store state when the project is missing from the store', async () => {
    useProjectStore.setState({ projects: [] });
    const newUnit = makeUnit('unit-4', 'Hellblasters', 'HEL-01');
    mockCreateUnitUseCase.execute.mockResolvedValueOnce(newUnit);

    const result = await useProjectStore.getState().addUnit('project-1', 'Hellblasters', 'HEL-01');

    expect(result).toBeNull();
    expect(useProjectStore.getState().projects).toHaveLength(0);
  });
});

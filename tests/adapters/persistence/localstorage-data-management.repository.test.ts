import { LocalStorageDataManagementRepository } from '../../../src/adapters/persistence/localstorage/data-management.repository';
import { StoredProjectData } from '@/core/entities/backup-data';

describe('LocalStorageDataManagementRepository (BEA-46)', () => {
  const STORAGE_KEY = 'minipaint_projects';
  let repository: LocalStorageDataManagementRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageDataManagementRepository();
  });

  it('returns the raw persisted JSON string of all projects', async () => {
    const rawData = JSON.stringify([
      { id: 'project-1', name: 'Space Marines', code: 'SM', units: [] },
    ]);
    localStorage.setItem(STORAGE_KEY, rawData);

    const result = await repository.getAllRaw();

    expect(result).toBe(rawData);
  });

  it('returns an empty array JSON when nothing is persisted', async () => {
    const result = await repository.getAllRaw();

    expect(result).toBe('[]');
  });

  it('replaces all persisted projects with the given data', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 'old-project', name: 'Old', code: 'OLD', units: [] }]),
    );

    const newProjects: StoredProjectData[] = [
      {
        id: 'project-1',
        name: 'Space Marines',
        code: 'SM',
        units: [
          {
            id: 'unit-1',
            name: 'Intercessor',
            code: 'IA-01',
            projectId: 'project-1',
            todos: [{ id: 'todo-1', label: 'Assembly', status: 'TODO', order: 10 }],
          },
        ],
      },
    ];
    await repository.replaceAll(newProjects);

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual(newProjects);
  });

  it('clears persisted projects when replacing with an empty array', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 'old-project', name: 'Old', code: 'OLD', units: [] }]),
    );

    await repository.replaceAll([]);

    expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
  });

  it('never touches UI preferences storage', async () => {
    localStorage.setItem('minipaint_ui_preferences', JSON.stringify({ hideDone: true }));

    await repository.replaceAll([{ id: 'p1', name: 'P', code: 'P', units: [] }]);

    expect(localStorage.getItem('minipaint_ui_preferences')).toBe(
      JSON.stringify({ hideDone: true }),
    );
  });
});

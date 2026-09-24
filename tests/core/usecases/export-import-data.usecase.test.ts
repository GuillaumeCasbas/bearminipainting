import { ExportDataUseCase } from '@/core/usecases/export-data.usecase';
import { ImportDataUseCase } from '@/core/usecases/import-data.usecase';
import { InvalidBackupError } from '@/core/errors/data.errors';
import { DataManagementRepository } from '@/core/ports/data-management.repository';

describe('ExportDataUseCase (BEA-46)', () => {
  it('exports all painting data as a JSON string of the persisted structure', async () => {
    const rawData = JSON.stringify([
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
            todos: [
              { id: 'todo-1', label: 'Assembly', status: 'TODO', order: 10 },
              { id: 'todo-2', label: 'Varnish', status: 'DONE', order: 60 },
            ],
          },
        ],
      },
    ]);
    const repository: DataManagementRepository = {
      getAll: jest.fn().mockResolvedValue(rawData),
      replaceAll: jest.fn(),
    };
    const useCase = new ExportDataUseCase(repository);

    const result = await useCase.execute();

    expect(result).toBe(rawData);
    expect(repository.getAll).toHaveBeenCalledTimes(1);
  });

  it('exports an empty projects array when there is no data', async () => {
    const repository: DataManagementRepository = {
      getAll: jest.fn().mockResolvedValue('[]'),
      replaceAll: jest.fn(),
    };
    const useCase = new ExportDataUseCase(repository);

    const result = await useCase.execute();

    expect(result).toBe('[]');
  });
});

describe('ImportDataUseCase (BEA-46)', () => {
  const buildRepository = (initialData = '[]'): DataManagementRepository => ({
    getAll: jest.fn().mockResolvedValue(initialData),
    replaceAll: jest.fn(),
  });

  const validBackup = JSON.stringify([
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
  ]);

  it('replaces all current data with the file data on a valid backup', async () => {
    const repository = buildRepository(
      JSON.stringify([{ id: 'old-project', name: 'Old', code: 'OLD', units: [] }]),
    );
    const useCase = new ImportDataUseCase(repository);

    await useCase.execute(validBackup);

    expect(repository.replaceAll).toHaveBeenCalledTimes(1);
    expect(repository.replaceAll).toHaveBeenCalledWith(JSON.parse(validBackup));
  });

  it('rejects a malformed JSON file and does not touch existing data', async () => {
    const repository = buildRepository(
      JSON.stringify([{ id: 'old-project', name: 'Old', code: 'OLD', units: [] }]),
    );
    const useCase = new ImportDataUseCase(repository);

    await expect(useCase.execute('{ not valid json')).rejects.toThrow(InvalidBackupError);
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  it('rejects a JSON file that is not an array of projects', async () => {
    const repository = buildRepository();
    const useCase = new ImportDataUseCase(repository);

    await expect(useCase.execute('{"some":"object"}')).rejects.toThrow(InvalidBackupError);
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  it('rejects a project entry missing required fields', async () => {
    const repository = buildRepository();
    const useCase = new ImportDataUseCase(repository);

    const invalid = JSON.stringify([{ id: 'project-1', name: 'Missing code and units' }]);
    await expect(useCase.execute(invalid)).rejects.toThrow(InvalidBackupError);
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  it('rejects a unit entry with an invalid todo status', async () => {
    const repository = buildRepository();
    const useCase = new ImportDataUseCase(repository);

    const invalid = JSON.stringify([
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
            todos: [{ id: 'todo-1', label: 'Assembly', status: 'INVALID', order: 10 }],
          },
        ],
      },
    ]);
    await expect(useCase.execute(invalid)).rejects.toThrow(InvalidBackupError);
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  it('accepts a backup with an empty projects array', async () => {
    const repository = buildRepository(
      JSON.stringify([{ id: 'old-project', name: 'Old', code: 'OLD', units: [] }]),
    );
    const useCase = new ImportDataUseCase(repository);

    await useCase.execute('[]');

    expect(repository.replaceAll).toHaveBeenCalledWith([]);
  });
});

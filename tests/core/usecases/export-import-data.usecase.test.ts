import { ExportDataUseCase } from '@/core/usecases/export-data.usecase';
import { ImportDataUseCase } from '@/core/usecases/import-data.usecase';
import { InvalidBackupError } from '@/core/errors/data.errors';
import { DataManagementRepository } from '@/core/ports/data-management.repository';
import { Project } from '@/core/entities/Project';
import { Unit } from '@/core/entities/Unit';
import { Todo } from '@/core/entities/Todo';

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
    expect(repository.replaceAll).toHaveBeenCalledWith([
      new Project('project-1', 'Space Marines', 'SM', [
        new Unit('unit-1', 'Intercessor', 'IA-01', 'project-1', [
          new Todo('todo-1', 'Assembly', 'TODO', 10),
        ]),
      ]),
    ]);
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

  it('rejects a project entry missing an id', async () => {
    const repository = buildRepository();
    const useCase = new ImportDataUseCase(repository);

    const invalid = JSON.stringify([{ name: 'No id', code: 'SM', units: [] }]);
    await expect(useCase.execute(invalid)).rejects.toThrow(InvalidBackupError);
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  it('rejects a unit entry that is not an object', async () => {
    const repository = buildRepository();
    const useCase = new ImportDataUseCase(repository);

    const invalid = JSON.stringify([
      { id: 'project-1', name: 'Space Marines', code: 'SM', units: ['not-an-object'] },
    ]);
    await expect(useCase.execute(invalid)).rejects.toThrow(InvalidBackupError);
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  it('rejects a todo entry that is not an object', async () => {
    const repository = buildRepository();
    const useCase = new ImportDataUseCase(repository);

    const invalid = JSON.stringify([
      {
        id: 'project-1',
        name: 'Space Marines',
        code: 'SM',
        units: [
          { id: 'unit-1', name: 'Intercessor', code: 'IA-01', projectId: 'project-1', todos: [42] },
        ],
      },
    ]);
    await expect(useCase.execute(invalid)).rejects.toThrow(InvalidBackupError);
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  it('rejects a project entry that is not an object', async () => {
    const repository = buildRepository();
    const useCase = new ImportDataUseCase(repository);

    await expect(useCase.execute('[' + '"not-an-object"' + ']')).rejects.toThrow(
      InvalidBackupError,
    );
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  it('rejects a unit entry missing a name', async () => {
    const repository = buildRepository();
    const useCase = new ImportDataUseCase(repository);

    const invalid = JSON.stringify([
      {
        id: 'project-1',
        name: 'Space Marines',
        code: 'SM',
        units: [{ id: 'unit-1', code: 'IA-01', projectId: 'project-1', todos: [] }],
      },
    ]);
    await expect(useCase.execute(invalid)).rejects.toThrow(InvalidBackupError);
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  it('rejects a todo entry missing a label', async () => {
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
            todos: [{ id: 'todo-1', status: 'TODO', order: 10 }],
          },
        ],
      },
    ]);
    await expect(useCase.execute(invalid)).rejects.toThrow(InvalidBackupError);
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  // === DOMAIN INVARIANTS (BEA-50) ===

  it('rejects a backup with two projects sharing the same code', async () => {
    const repository = buildRepository();
    const useCase = new ImportDataUseCase(repository);

    const invalid = JSON.stringify([
      { id: 'project-1', name: 'Space Marines', code: 'SM', units: [] },
      { id: 'project-2', name: 'Salvage Marines', code: 'SM', units: [] },
    ]);

    await expect(useCase.execute(invalid)).rejects.toThrow(
      new InvalidBackupError('Duplicate project code: "SM"'),
    );
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  it('rejects a backup with two units sharing the same code within the same project', async () => {
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
            todos: [],
          },
          {
            id: 'unit-2',
            name: 'Captain',
            code: 'IA-01',
            projectId: 'project-1',
            todos: [],
          },
        ],
      },
    ]);

    await expect(useCase.execute(invalid)).rejects.toThrow(
      new InvalidBackupError('Duplicate unit code: "IA-01" in project "Space Marines"'),
    );
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  it('accepts two units sharing the same code across different projects', async () => {
    const repository = buildRepository();
    const useCase = new ImportDataUseCase(repository);

    const valid = JSON.stringify([
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
            todos: [],
          },
        ],
      },
      {
        id: 'project-2',
        name: 'Necrons',
        code: 'NEC',
        units: [
          {
            id: 'unit-2',
            name: 'Warrior',
            code: 'IA-01',
            projectId: 'project-2',
            todos: [],
          },
        ],
      },
    ]);

    await useCase.execute(valid);

    expect(repository.replaceAll).toHaveBeenCalledTimes(1);
    expect(repository.replaceAll).toHaveBeenCalledWith([
      new Project('project-1', 'Space Marines', 'SM', [
        new Unit('unit-1', 'Intercessor', 'IA-01', 'project-1', []),
      ]),
      new Project('project-2', 'Necrons', 'NEC', [
        new Unit('unit-2', 'Warrior', 'IA-01', 'project-2', []),
      ]),
    ]);
  });

  it('rejects a backup containing a unit whose projectId references a non-existent project', async () => {
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
            projectId: 'unknown-project',
            todos: [],
          },
        ],
      },
    ]);

    await expect(useCase.execute(invalid)).rejects.toThrow(
      new InvalidBackupError('Unit "unit-1" references unknown project "unknown-project"'),
    );
    expect(repository.replaceAll).not.toHaveBeenCalled();
  });

  it('still imports a valid app export after domain invariant validation (regression guard)', async () => {
    const repository = buildRepository(
      JSON.stringify([{ id: 'old-project', name: 'Old', code: 'OLD', units: [] }]),
    );
    const useCase = new ImportDataUseCase(repository);

    await useCase.execute(validBackup);

    expect(repository.replaceAll).toHaveBeenCalledTimes(1);
  });
});

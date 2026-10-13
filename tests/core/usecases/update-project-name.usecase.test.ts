import { Project } from '../../../src/core/entities/Project';
import { Unit } from '../../../src/core/entities/Unit';
import { UpdateProjectNameUseCase } from '../../../src/core/usecases/update-project-name.usecase';
import { ProjectNotFoundError, ProjectNameRequiredError } from '../../../src/core/errors';
import { ProjectRepository } from '../../../src/core/ports/project.repository';

const makeRepository = (projects: Project[]): ProjectRepository => ({
  save: jest.fn().mockResolvedValue(undefined),
  findById: jest
    .fn()
    .mockImplementation(
      async (id: string) => projects.find((project) => project.id === id) ?? null,
    ),
  findByCode: jest.fn().mockResolvedValue(null),
  findAll: jest.fn().mockResolvedValue(projects),
  delete: jest.fn().mockResolvedValue(undefined),
});

const makeProject = (id: string, name: string): Project =>
  new Project(id, name, 'SM', [new Unit('unit-1', 'Intercessors', 'INT-01', id)]);

describe('UpdateProjectNameUseCase', () => {
  it('renames the project and persists the trimmed name', async () => {
    const project = makeProject('project-1', 'Space Marines');
    const repository = makeRepository([project]);
    const useCase = new UpdateProjectNameUseCase(repository);

    const result = await useCase.execute('project-1', '  Ultramarines  ');

    expect(result.name).toBe('Ultramarines');
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'project-1', name: 'Ultramarines' }),
    );
  });

  it('keeps the project code and units unchanged', async () => {
    const project = makeProject('project-1', 'Space Marines');
    const repository = makeRepository([project]);
    const useCase = new UpdateProjectNameUseCase(repository);

    const result = await useCase.execute('project-1', 'Ultramarines');

    expect(result.code).toBe('SM');
    expect(result.units).toHaveLength(1);
    expect(result.units[0].id).toBe('unit-1');
  });

  it('throws ProjectNotFoundError when the project does not exist', async () => {
    const repository = makeRepository([]);
    const useCase = new UpdateProjectNameUseCase(repository);

    await expect(useCase.execute('missing', 'New name')).rejects.toThrow(ProjectNotFoundError);
  });

  it('throws ProjectNameRequiredError when the new name is empty or whitespace', async () => {
    const project = makeProject('project-1', 'Space Marines');
    const repository = makeRepository([project]);
    const useCase = new UpdateProjectNameUseCase(repository);

    await expect(useCase.execute('project-1', '')).rejects.toThrow(ProjectNameRequiredError);
    await expect(useCase.execute('project-1', '   ')).rejects.toThrow(ProjectNameRequiredError);
  });
});

import { LocalStorageProjectRepository } from '../../../src/adapters/persistence/localstorage/project.repository';
import { Project } from '../../../src/core/entities/Project';
import { Unit } from '../../../src/core/entities/Unit';
import { CreateProjectUseCase } from '../../../src/core/usecases/create-project.usecase';
import { CodeNotUniqueError } from '../../../src/core/errors/project.errors';

describe('LocalStorageProjectRepository Integration', () => {
  let repository: LocalStorageProjectRepository;
  let useCase: CreateProjectUseCase;

  beforeEach(() => {
    // Clear and mock localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
    
    repository = new LocalStorageProjectRepository();
    useCase = new CreateProjectUseCase(repository);
  });

  it('should save and find a project by code', async () => {
    const project = new Project('test-id-1', 'Test Project', 'TEST-001', []);
    
    await repository.save(project);
    
    const found = await repository.findByCode('TEST-001');
    
    expect(found).not.toBeNull();
    expect(found?.id).toBe('test-id-1');
    expect(found?.name).toBe('Test Project');
    expect(found?.code).toBe('TEST-001');
  });

  it('should return null when project code does not exist', async () => {
    const found = await repository.findByCode('NONEXISTENT');
    
    expect(found).toBeNull();
  });

  it('should integrate with CreateProjectUseCase for unique code', async () => {
    const result = await useCase.execute('New Project', 'UNIQUE-001');
    
    expect(result).toBeInstanceOf(Project);
    expect(result.name).toBe('New Project');
    expect(result.code).toBe('UNIQUE-001');
    expect(result.id).toBeDefined();
    
    // Verify it was saved
    const found = await repository.findByCode('UNIQUE-001');
    expect(found).not.toBeNull();
    expect(found?.id).toBe(result.id);
  });

  it('should integrate with CreateProjectUseCase and throw on duplicate code', async () => {
    // Create first project
    await useCase.execute('First Project', 'DUPLICATE-001');
    
    // Try to create second project with same code
    await expect(useCase.execute('Second Project', 'DUPLICATE-001'))
      .rejects
      .toThrow(CodeNotUniqueError);
  });

  it('should update existing project when saving with same id', async () => {
    const project1 = new Project('same-id', 'Original Name', 'CODE-001', []);
    const project2 = new Project('same-id', 'Updated Name', 'CODE-001', []);
    
    await repository.save(project1);
    await repository.save(project2);
    
    const found = await repository.findByCode('CODE-001');
    
    expect(found).not.toBeNull();
    expect(found?.name).toBe('Updated Name');
  });

  it('should return all projects with findAll', async () => {
    const project1 = new Project('id-1', 'Project One', 'CODE-001', []);
    const project2 = new Project('id-2', 'Project Two', 'CODE-002', []);
    const project3 = new Project('id-3', 'Project Three', 'CODE-003', []);
    
    await repository.save(project1);
    await repository.save(project2);
    await repository.save(project3);
    
    const allProjects = await repository.findAll();
    
    expect(allProjects).toHaveLength(3);
    expect(allProjects).toContainEqual(project1);
    expect(allProjects).toContainEqual(project2);
    expect(allProjects).toContainEqual(project3);
  });

  it('should return empty array when no projects exist', async () => {
    const allProjects = await repository.findAll();
    
    expect(allProjects).toEqual([]);
  });

  it('should save and find a project with units', async () => {
    const unit = new Unit('unit-1', 'Intercessor', 'IA-01', 'test-id-1');
    const project = new Project('test-id-1', 'Test Project', 'TEST-001', [unit]);
    
    await repository.save(project);
    
    const found = await repository.findById('test-id-1');
    
    expect(found).not.toBeNull();
    expect(found?.units).toHaveLength(1);
    expect(found?.units[0].name).toBe('Intercessor');
    expect(found?.units[0].code).toBe('IA-01');
  });

  it('should find a project by id', async () => {
    const project = new Project('test-id-1', 'Test Project', 'TEST-001', []);
    
    await repository.save(project);
    
    const found = await repository.findById('test-id-1');
    
    expect(found).not.toBeNull();
    expect(found?.id).toBe('test-id-1');
    expect(found?.name).toBe('Test Project');
  });

  it('should return null when project id does not exist', async () => {
    const found = await repository.findById('NONEXISTENT');
    
    expect(found).toBeNull();
  });
});

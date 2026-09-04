import { LocalStorageUnitRepository } from '@/adapters/persistence/localstorage/unit.repository';
import { LocalStorageProjectRepository } from '@/adapters/persistence/localstorage/project.repository';
import { CreateUnitUseCase } from '@/core/usecases/create-unit.usecase';
import { Project } from '@/core/entities/Project';
import { Unit } from '@/core/entities/Unit';
import { Todo } from '@/core/entities/Todo';
import { UnitCodeNotUniqueError, ProjectNotFoundError, UnitNotFoundError } from '@/core/errors';

describe('LocalStorageUnitRepository Integration', () => {
  let projectRepository: LocalStorageProjectRepository;
  let unitRepository: LocalStorageUnitRepository;
  let createUnitUseCase: CreateUnitUseCase;

  const PROJECT_ID = 'test-project-id';
  const PROJECT_CODE = 'TEST-PROJ';

  beforeEach(async () => {
    // Clear storage to prevent side effects
    localStorage.removeItem('minipaint_projects');
    jest.clearAllMocks();

    projectRepository = new LocalStorageProjectRepository();
    unitRepository = new LocalStorageUnitRepository(projectRepository);
    createUnitUseCase = new CreateUnitUseCase(unitRepository);

    // Create a test project
    const project = new Project(PROJECT_ID, 'Test Project', PROJECT_CODE, []);
    await projectRepository.save(project);
  });

  // === UnitRepository Methods ===

  it('should find a unit by projectId and code', async () => {
    const unit = new Unit(
      'unit-1',
      'Test Unit',
      'UNIT-001',
      PROJECT_ID,
      []
    );

    // Manually add unit to project (simulating save)
    const project = await projectRepository.findById(PROJECT_ID);
    expect(project).not.toBeNull();
    const updatedProject = new Project(
      project!.id,
      project!.name,
      project!.code,
      [unit]
    );
    await projectRepository.save(updatedProject);

    const found = await unitRepository.findByProjectIdAndCode(PROJECT_ID, 'UNIT-001');

    expect(found).not.toBeNull();
    expect(found?.id).toBe('unit-1');
    expect(found?.name).toBe('Test Unit');
    expect(found?.code).toBe('UNIT-001');
  });

  it('should return null when unit does not exist', async () => {
    const found = await unitRepository.findByProjectIdAndCode(PROJECT_ID, 'NONEXISTENT');

    expect(found).toBeNull();
  });

  it('should return null when project does not exist', async () => {
    const found = await unitRepository.findByProjectIdAndCode('nonexistent-project', 'UNIT-001');

    expect(found).toBeNull();
  });

  it('should create a unit and add it to the project', async () => {
    const unit = new Unit(
      'unit-1',
      'Test Unit',
      'UNIT-001',
      PROJECT_ID,
      []
    );

    await unitRepository.create(unit);

    // Verify unit was created by fetching the project
    const project = await projectRepository.findById(PROJECT_ID);
    expect(project).not.toBeNull();
    expect(project?.units.length).toBe(1);
    expect(project?.units[0].id).toBe('unit-1');
    expect(project?.units[0].name).toBe('Test Unit');
    expect(project?.units[0].code).toBe('UNIT-001');
  });

  it('should throw ProjectNotFoundError when creating unit with nonexistent project', async () => {
    const unit = new Unit(
      'unit-1',
      'Test Unit',
      'UNIT-001',
      'nonexistent-project-id',
      []
    );

    await expect(unitRepository.create(unit)).rejects.toThrow(ProjectNotFoundError);
    await expect(unitRepository.create(unit)).rejects.toThrow("Project with id 'nonexistent-project-id' not found");
  });

  // === Update Method Tests ===

  it('should update an existing unit and replace it in the project', async () => {
    // First create a unit
    const originalUnit = new Unit(
      'unit-to-update',
      'Original Name',
      'ORIG-001',
      PROJECT_ID,
      []
    );
    await unitRepository.create(originalUnit);

    // Now update it
    const updatedUnit = new Unit(
      'unit-to-update',
      'Updated Name',
      'UPDATED-001',
      PROJECT_ID,
      []
    );
    await unitRepository.update(updatedUnit);

    // Verify the unit was updated
    const project = await projectRepository.findById(PROJECT_ID);
    expect(project).not.toBeNull();
    expect(project?.units.length).toBe(1);
    expect(project?.units[0].name).toBe('Updated Name');
    expect(project?.units[0].code).toBe('UPDATED-001');
  });

  it('should not duplicate unit when updating existing unit', async () => {
    // First create a unit
    const originalUnit = new Unit(
      'unit-no-duplicate',
      'Original Name',
      'NODUP-001',
      PROJECT_ID,
      []
    );
    await unitRepository.create(originalUnit);

    // Update the same unit
    const updatedUnit = new Unit(
      'unit-no-duplicate',
      'Updated Name',
      'NODUP-001',
      PROJECT_ID,
      []
    );
    await unitRepository.update(updatedUnit);

    // Verify there is still only ONE unit (not duplicated)
    const project = await projectRepository.findById(PROJECT_ID);
    expect(project?.units.length).toBe(1);
    expect(project?.units[0].name).toBe('Updated Name');
  });

  it('should throw UnitNotFoundError when updating unit that does not exist', async () => {
    const nonExistentUnit = new Unit(
      'nonexistent-unit-id',
      'Non Existent',
      'NONEX-001',
      PROJECT_ID,
      []
    );

    await expect(unitRepository.update(nonExistentUnit)).rejects.toThrow(UnitNotFoundError);
  });

  it('should throw ProjectNotFoundError when updating unit with nonexistent project', async () => {
    const unit = new Unit(
      'unit-1',
      'Test Unit',
      'UNIT-001',
      'nonexistent-project-id',
      []
    );

    await expect(unitRepository.update(unit)).rejects.toThrow(ProjectNotFoundError);
  });

  // === Integration with CreateUnitUseCase ===

  it('should integrate with CreateUnitUseCase to create and save a unit', async () => {
    const result = await createUnitUseCase.execute(
      'Intercessor',
      'INT-01',
      PROJECT_ID
    );

    expect(result).toBeInstanceOf(Unit);
    expect(result.name).toBe('Intercessor');
    expect(result.code).toBe('INT-01');
    expect(result.projectId).toBe(PROJECT_ID);
    expect(result.todos.length).toBe(6);

    // Verify it was persisted
    const project = await projectRepository.findById(PROJECT_ID);
    expect(project?.units.length).toBe(1);
    expect(project?.units[0].code).toBe('INT-01');
  });

  it('should integrate with CreateUnitUseCase and create unit with uppercase code', async () => {
    const result = await createUnitUseCase.execute(
      'Tactical Marine',
      'sm-01',
      PROJECT_ID
    );

    expect(result.code).toBe('SM-01');

    // Verify it was persisted with uppercase code
    const project = await projectRepository.findById(PROJECT_ID);
    expect(project?.units[0].code).toBe('SM-01');
  });

  it('should integrate with CreateUnitUseCase and throw on duplicate code', async () => {
    // Create first unit
    await createUnitUseCase.execute('First Unit', 'DUP-001', PROJECT_ID);

    // Try to create second unit with same code in same project
    await expect(
      createUnitUseCase.execute('Second Unit', 'DUP-001', PROJECT_ID)
    ).rejects.toThrow(UnitCodeNotUniqueError);
  });

  it('should integrate with CreateUnitUseCase and allow same code in different projects', async () => {
    // Create second project
    const project2 = new Project('project-2', 'Second Project', 'PROJ-002', []);
    await projectRepository.save(project2);

    // Create unit in first project
    await createUnitUseCase.execute('Unit 1', 'SAME-CODE', PROJECT_ID);

    // Create unit with same code in second project - should succeed
    const result = await createUnitUseCase.execute(
      'Unit 2',
      'SAME-CODE',
      'project-2'
    );

    expect(result.code).toBe('SAME-CODE');
    expect(result.projectId).toBe('project-2');

    // Verify both projects have their units
    const project1 = await projectRepository.findById(PROJECT_ID);
    const project2Saved = await projectRepository.findById('project-2');

    expect(project1?.units.length).toBe(1);
    expect(project2Saved?.units.length).toBe(1);
  });

  it('should create unit with all default todos', async () => {
    const result = await createUnitUseCase.execute(
      'Land Raider',
      'LR-01',
      PROJECT_ID
    );

    expect(result.todos.length).toBe(6);
    expect(result.todos[0].label).toBe('Assembly');
    expect(result.todos[0].order).toBe(10);
    expect(result.todos[1].label).toBe('Primer');
    expect(result.todos[1].order).toBe(20);
    expect(result.todos[2].label).toBe('Base');
    expect(result.todos[2].order).toBe(30);
    expect(result.todos[3].label).toBe('Effects');
    expect(result.todos[3].order).toBe(40);
    expect(result.todos[4].label).toBe('Basecoat');
    expect(result.todos[4].order).toBe(50);
    expect(result.todos[5].label).toBe('Varnish');
    expect(result.todos[5].order).toBe(60);
  });

  // === findById Method Tests ===

  it('should find a unit by its id', async () => {
    // Create a unit first
    const unit = new Unit(
      'find-by-id-test-unit',
      'Find By ID Test Unit',
      'FIND-001',
      PROJECT_ID,
      []
    );

    // Create the unit via repository
    await unitRepository.create(unit);

    // Find the unit by its id
    const found = await unitRepository.findById('find-by-id-test-unit');

    expect(found).not.toBeNull();
    expect(found?.id).toBe('find-by-id-test-unit');
    expect(found?.name).toBe('Find By ID Test Unit');
    expect(found?.code).toBe('FIND-001');
    expect(found?.projectId).toBe(PROJECT_ID);
  });

  it('should return null when unit with given id does not exist', async () => {
    const found = await unitRepository.findById('nonexistent-unit-id');

    expect(found).toBeNull();
  });

  it('should find unit by id across different projects', async () => {
    // Create second project
    const project2 = new Project('project-2', 'Second Project', 'PROJ-002', []);
    await projectRepository.save(project2);

    // Create unit in first project
    const unit1 = new Unit(
      'unit-in-project-1',
      'Unit in Project 1',
      'UNIT-P1',
      PROJECT_ID,
      []
    );
    await unitRepository.create(unit1);

    // Create unit in second project
    const unit2 = new Unit(
      'unit-in-project-2',
      'Unit in Project 2',
      'UNIT-P2',
      'project-2',
      []
    );
    // Manually add to second project (simulating save)
    const updatedProject2 = new Project(
      project2.id,
      project2.name,
      project2.code,
      [unit2]
    );
    await projectRepository.save(updatedProject2);

    // Should find unit in first project
    const foundUnit1 = await unitRepository.findById('unit-in-project-1');
    expect(foundUnit1).not.toBeNull();
    expect(foundUnit1?.projectId).toBe(PROJECT_ID);

    // Should find unit in second project
    const foundUnit2 = await unitRepository.findById('unit-in-project-2');
    expect(foundUnit2).not.toBeNull();
    expect(foundUnit2?.projectId).toBe('project-2');
  });
});

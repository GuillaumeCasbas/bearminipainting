import { LocalStorageProjetRepository } from '../../../src/adapters/persistence/localstorage/projet.repository';
import { Projet } from '../../../src/core/entities/Projet';
import { CreateProjetUseCase } from '../../../src/core/usecases/create-projet.usecase';
import { CodeNotUniqueError } from '../../../src/core/errors/projet.errors';

// Mock localStorage for Node.js environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('LocalStorageProjetRepository Integration', () => {
  let repository: LocalStorageProjetRepository;
  let useCase: CreateProjetUseCase;

  beforeEach(() => {
    // Clear and mock localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
    
    repository = new LocalStorageProjetRepository();
    useCase = new CreateProjetUseCase(repository);
  });

  it('should save and find a project by code', async () => {
    const projet = new Projet('test-id-1', 'Test Project', 'TEST-001');
    
    await repository.save(projet);
    
    const found = await repository.findByCode('TEST-001');
    
    expect(found).not.toBeNull();
    expect(found?.id).toBe('test-id-1');
    expect(found?.nom).toBe('Test Project');
    expect(found?.code).toBe('TEST-001');
  });

  it('should return null when project code does not exist', async () => {
    const found = await repository.findByCode('NONEXISTENT');
    
    expect(found).toBeNull();
  });

  it('should integrate with CreateProjetUseCase for unique code', async () => {
    const result = await useCase.execute('New Project', 'UNIQUE-001');
    
    expect(result).toBeInstanceOf(Projet);
    expect(result.nom).toBe('New Project');
    expect(result.code).toBe('UNIQUE-001');
    expect(result.id).toBeDefined();
    
    // Verify it was saved
    const found = await repository.findByCode('UNIQUE-001');
    expect(found).not.toBeNull();
    expect(found?.id).toBe(result.id);
  });

  it('should integrate with CreateProjetUseCase and throw on duplicate code', async () => {
    // Create first project
    await useCase.execute('First Project', 'DUPLICATE-001');
    
    // Try to create second project with same code
    await expect(useCase.execute('Second Project', 'DUPLICATE-001'))
      .rejects
      .toThrow(CodeNotUniqueError);
  });

  it('should update existing project when saving with same id', async () => {
    const projet1 = new Projet('same-id', 'Original Name', 'CODE-001');
    const projet2 = new Projet('same-id', 'Updated Name', 'CODE-001');
    
    await repository.save(projet1);
    await repository.save(projet2);
    
    const found = await repository.findByCode('CODE-001');
    
    expect(found).not.toBeNull();
    expect(found?.nom).toBe('Updated Name');
  });
});

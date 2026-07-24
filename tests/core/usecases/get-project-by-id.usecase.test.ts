import { GetProjectByIdUseCase } from "../../../src/core/usecases/get-project-by-id.usecase";
import { ProjectRepository } from "../../../src/core/ports/project.repository";
import { Project } from "../../../src/core/entities/Project";
import { Unit } from "../../../src/core/entities/Unit";

describe("GetProjectByIdUseCase", () => {
  // Track calls for manual verification
  let lastFindByIdCall: string | null = null;

  // Manual mock implementation
  const mockRepository: ProjectRepository = {
    findById: async (id: string): Promise<Project | null> => {
      lastFindByIdCall = id;
      // Default implementation returns null, tests will override via closure
      return null;
    },
    findByCode: async (_code: string): Promise<Project | null> => null,
    save: async (_project: Project): Promise<void> => {},
    findAll: async (): Promise<Project[]> => [],
  };

  const useCase = new GetProjectByIdUseCase(mockRepository);

  it("should return a project if found by id", async () => {
    // Override mock behavior for this test
    const mockProject = new Project("1", "Space Marines", "NMS", []);
    mockRepository.findById = async (id: string) => {
      lastFindByIdCall = id;
      return mockProject;
    };

    const result = await useCase.execute("1");

    expect(result).toBeInstanceOf(Project);
    expect(result?.id).toBe("1");
    expect(result?.name).toBe("Space Marines");
    expect(result?.code).toBe("NMS");
    expect(lastFindByIdCall).toBe("1");
  });

  it("should return null if project is not found", async () => {
    // Reset to return null
    mockRepository.findById = async (id: string) => {
      lastFindByIdCall = id;
      return null;
    };

    const result = await useCase.execute("non-existent-id");

    expect(result).toBeNull();
    expect(lastFindByIdCall).toBe("non-existent-id");
  });

  it("should return a project with units", async () => {
    const mockUnit = new Unit("unit-1", "Intercessor", "IA-01", "1");
    const mockProject = new Project("1", "Space Marines", "NMS", [mockUnit]);
    
    mockRepository.findById = async (id: string) => {
      lastFindByIdCall = id;
      return mockProject;
    };

    const result = await useCase.execute("1");

    expect(result).toBeInstanceOf(Project);
    expect(result?.units).toHaveLength(1);
    expect(result?.units[0].name).toBe("Intercessor");
    expect(result?.units[0].code).toBe("IA-01");
  });
});

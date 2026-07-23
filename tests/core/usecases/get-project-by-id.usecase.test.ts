import { GetProjectByIdUseCase } from "../../../src/core/usecases/get-project-by-id.usecase";
import { ProjectRepository } from "../../../src/core/ports/project.repository";
import { Project } from "../../../src/core/entities/Project";
import { Unit } from "../../../src/core/entities/Unit";

describe("GetProjectByIdUseCase", () => {
  const mockRepository: ProjectRepository = {
    findById: jest.fn(),
    findByCode: jest.fn(),
    save: jest.fn(),
    findAll: jest.fn(),
  };

  const useCase = new GetProjectByIdUseCase(mockRepository);

  it("should return a project if found by id", async () => {
    const mockProject = new Project("1", "Space Marines", "NMS", []);
    (mockRepository.findById as jest.Mock).mockResolvedValue(mockProject);

    const result = await useCase.execute("1");

    expect(result).toBeInstanceOf(Project);
    expect(result?.id).toBe("1");
    expect(result?.name).toBe("Space Marines");
    expect(result?.code).toBe("NMS");
    expect(mockRepository.findById).toHaveBeenCalledWith("1");
  });

  it("should return null if project is not found", async () => {
    (mockRepository.findById as jest.Mock).mockResolvedValue(null);

    const result = await useCase.execute("non-existent-id");

    expect(result).toBeNull();
    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });

  it("should return a project with units", async () => {
    const mockUnit = new Unit("unit-1", "Intercessor", "IA-01", "1");
    const mockProject = new Project("1", "Space Marines", "NMS", [mockUnit]);
    (mockRepository.findById as jest.Mock).mockResolvedValue(mockProject);

    const result = await useCase.execute("1");

    expect(result).toBeInstanceOf(Project);
    expect(result?.units).toHaveLength(1);
    expect(result?.units[0].name).toBe("Intercessor");
    expect(result?.units[0].code).toBe("IA-01");
  });
});

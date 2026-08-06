import { CreateProjectUseCase } from "../../../src/core/usecases/create-project.usecase";
import { ProjectRepository } from "../../../src/core/ports/project.repository";
import { Project } from "../../../src/core/entities/Project";
import { CodeNotUniqueError } from "../../../src/core/errors/project.errors";

describe("CreateProjectUseCase", () => {
  let lastFindByCodeCall: string | null = null;
  let saveCalled = false;

  const mockRepository: ProjectRepository = {
    findById: async (_id: string): Promise<Project | null> => null,
    findByCode: async (code: string): Promise<Project | null> => {
      lastFindByCodeCall = code;
      return null;
    },
    save: async (_project: Project): Promise<void> => {
      saveCalled = true;
    },
    findAll: async (): Promise<Project[]> => [],
  };

  const useCase = new CreateProjectUseCase(mockRepository);

  it("should throw CodeNotUniqueError if the code is already used", async () => {
    const existingProject = new Project("1", "Space Marines", "NMS");
    mockRepository.findByCode = async (code: string) => {
      lastFindByCodeCall = code;
      return existingProject;
    };

    await expect(useCase.execute("New Project", "NMS"))
      .rejects
      .toBeInstanceOf(CodeNotUniqueError);
  });

  it("should create a project if the code is unique", async () => {
    mockRepository.findByCode = async (code: string) => {
      lastFindByCodeCall = code;
      return null;
    };
    mockRepository.save = async (_project: Project) => {
      saveCalled = true;
    };

    const result = await useCase.execute("New Project", "UNIQUE");

    expect(result).toBeInstanceOf(Project);
    expect(result.id).toBeDefined();
    expect(result.name).toBe("New Project");
    expect(result.code).toBe("UNIQUE");
    expect(saveCalled).toBe(true);
  });
});

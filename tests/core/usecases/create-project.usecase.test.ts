import { CreateProjectUseCase } from "../../../src/core/usecases/create-project.usecase";
import { ProjectRepository } from "../../../src/core/ports/project.repository";
import { Project } from "../../../src/core/entities/Project";
import { CodeNotUniqueError, ProjectNameRequiredError } from "../../../src/core/errors/project.errors";

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
    delete: async (_id: string): Promise<void> => {},
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

  describe("Project name validation (BEA-18)", () => {
    it("should throw ProjectNameRequiredError if name is empty string", async () => {
      await expect(useCase.execute("", "UNIQUE"))
        .rejects
        .toBeInstanceOf(ProjectNameRequiredError);
    });

    it("should throw ProjectNameRequiredError if name is whitespace-only", async () => {
      await expect(useCase.execute("   ", "UNIQUE"))
        .rejects
        .toBeInstanceOf(ProjectNameRequiredError);
    });

    it("should throw ProjectNameRequiredError if name is null", async () => {
      // @ts-expect-error - Testing null input
      await expect(useCase.execute(null, "UNIQUE"))
        .rejects
        .toBeInstanceOf(ProjectNameRequiredError);
    });

    it("should throw ProjectNameRequiredError if name is undefined", async () => {
      // @ts-expect-error - Testing undefined input
      await expect(useCase.execute(undefined, "UNIQUE"))
        .rejects
        .toBeInstanceOf(ProjectNameRequiredError);
    });

    it("should create project successfully with valid name", async () => {
      mockRepository.findByCode = async (code: string) => {
        lastFindByCodeCall = code;
        return null;
      };
      mockRepository.save = async (_project: Project) => {
        saveCalled = true;
      };

      const result = await useCase.execute("Valid Project", "UNIQUE");

      expect(result).toBeInstanceOf(Project);
      expect(result.name).toBe("Valid Project");
      expect(saveCalled).toBe(true);
    });
  });
});

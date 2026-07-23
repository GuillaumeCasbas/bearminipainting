import { CreateProjectUseCase } from "../../../src/core/usecases/create-project.usecase";
import { ProjectRepository } from "../../../src/core/ports/project.repository";
import { Project } from "../../../src/core/entities/Project";
import { CodeNotUniqueError } from "../../../src/core/errors/project.errors";

describe("CreateProjectUseCase", () => {
  const mockRepository: ProjectRepository = {
    findById: jest.fn(),
    findByCode: jest.fn(),
    save: jest.fn(),
    findAll: jest.fn(),
  };

  const useCase = new CreateProjectUseCase(mockRepository);

  it("should throw CodeNotUniqueError if the code is already used", async () => {
    const existingProject = new Project("1", "Space Marines", "NMS");
    (mockRepository.findByCode as jest.Mock).mockResolvedValue(existingProject);

    await expect(useCase.execute("New Project", "NMS"))
      .rejects
      .toBeInstanceOf(CodeNotUniqueError);
  });

  it("should create a project if the code is unique", async () => {
    (mockRepository.findByCode as jest.Mock).mockResolvedValue(null);
    (mockRepository.save as jest.Mock).mockResolvedValue(undefined);

    const result = await useCase.execute("New Project", "UNIQUE");

    expect(result).toBeInstanceOf(Project);
    expect(result.name).toBe("New Project");
    expect(result.code).toBe("UNIQUE");
    expect(mockRepository.save).toHaveBeenCalled();
  });
});

/**
 * Tests for DeleteProjectUseCase
 * BEA-7: Feature - Delete project
 */

import { DeleteProjectUseCase } from "../../../src/core/usecases/delete-project.usecase";
import { ProjectRepository } from "../../../src/core/ports/project.repository";
import { Project } from "../../../src/core/entities/Project";
import { Unit } from "../../../src/core/entities/Unit";
import { Todo } from "../../../src/core/entities/Todo";
import { ProjectNotFoundError } from "../../../src/core/errors";

describe("DeleteProjectUseCase", () => {
  let mockRepository: jest.Mocked<ProjectRepository>;
  let useCase: DeleteProjectUseCase;

  // Test data
  const testProject = new Project(
    "project-1",
    "Space Marines",
    "NMS",
    [
      new Unit(
        "unit-1",
        "Intercessor",
        "IA-01",
        "project-1",
        [new Todo("todo-1", "Assembly", "TODO", 10)]
      ),
      new Unit(
        "unit-2",
        "Tactical Marine",
        "TM-01",
        "project-1",
        [new Todo("todo-2", "Primer", "DONE", 20)]
      ),
    ]
  );

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteProjectUseCase(mockRepository);
  });

  describe("Success cases", () => {
    it("should delete a project by id", async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testProject);
      mockRepository.delete = jest.fn().mockResolvedValue(undefined);

      await useCase.execute("project-1");

      expect(mockRepository.findById).toHaveBeenCalledWith("project-1");
      expect(mockRepository.delete).toHaveBeenCalledWith("project-1");
    });
  });

  describe("Error cases", () => {
    it("should throw ProjectNotFoundError when project does not exist", async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(useCase.execute("non-existent-project"))
        .rejects
        .toBeInstanceOf(ProjectNotFoundError);
    });

    it("should propagate any repository error", async () => {
      const testError = new Error("Storage error");
      mockRepository.findById = jest.fn().mockRejectedValue(testError);

      await expect(useCase.execute("project-1")).rejects.toThrow(testError);
    });
  });
});

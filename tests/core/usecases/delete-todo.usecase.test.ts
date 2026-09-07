/**
 * Tests for DeleteTodoUseCase
 * BEA-29: Feature - Delete a todo
 */

import { DeleteTodoUseCase } from "../../../src/core/usecases/delete-todo.usecase";
import { UnitRepository } from "../../../src/core/ports/unit.repository";
import { Unit } from "../../../src/core/entities/Unit";
import { Todo } from "../../../src/core/entities/Todo";
import { UnitNotFoundError, TodoNotFoundError } from "../../../src/core/errors";

describe("DeleteTodoUseCase", () => {
  let mockRepository: UnitRepository;
  let useCase: DeleteTodoUseCase;

  // Test data
  const testUnit = new Unit(
    "unit-1",
    "Test Unit",
    "TU-001",
    "project-1",
    [
      new Todo("todo-1", "First todo", "TODO", 10),
      new Todo("todo-2", "Second todo", "TODO", 20),
      new Todo("todo-3", "Third todo", "DONE", 30),
    ]
  );

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByProjectIdAndCode: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    useCase = new DeleteTodoUseCase(mockRepository);
  });

  describe("Success cases", () => {
    it("should delete a todo from unit", async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute("unit-1", "todo-2");

      expect(result.todos.length).toBe(2);
      expect(result.todos.some(t => t.id === "todo-2")).toBe(false);
      expect(result.todos.some(t => t.id === "todo-1")).toBe(true);
      expect(result.todos.some(t => t.id === "todo-3")).toBe(true);
      expect(mockRepository.update).toHaveBeenCalled();
    });

    it("should preserve other todos when deleting one", async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute("unit-1", "todo-1");

      expect(result.todos.length).toBe(2);
      expect(result.todos[0].label).toBe("Second todo");
      expect(result.todos[1].label).toBe("Third todo");
    });

    it("should return updated unit with correct properties", async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute("unit-1", "todo-1");

      expect(result.id).toBe("unit-1");
      expect(result.name).toBe("Test Unit");
      expect(result.code).toBe("TU-001");
      expect(result.projectId).toBe("project-1");
    });
  });

  describe("Error cases", () => {
    it("should throw UnitNotFoundError when unit does not exist", async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(useCase.execute("non-existent-unit", "todo-1"))
        .rejects
        .toBeInstanceOf(UnitNotFoundError);
    });

    it("should throw TodoNotFoundError when todo does not exist in unit", async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);

      await expect(useCase.execute("unit-1", "non-existent-todo"))
        .rejects
        .toBeInstanceOf(TodoNotFoundError);
    });

    it("should not call update when todo is not found", async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn();

      try {
        await useCase.execute("unit-1", "non-existent-todo");
      } catch (error) {
        expect(error).toBeInstanceOf(TodoNotFoundError);
      }

      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("Edge cases", () => {
    it("should handle unit with single todo", async () => {
      const singleTodoUnit = new Unit(
        "unit-2",
        "Single Todo Unit",
        "ST-001",
        "project-1",
        [new Todo("todo-only", "Only todo", "TODO", 10)]
      );

      mockRepository.findById = jest.fn().mockResolvedValue(singleTodoUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute("unit-2", "todo-only");

      expect(result.todos.length).toBe(0);
    });

    it("should handle empty todos list", async () => {
      const emptyUnit = new Unit(
        "unit-3",
        "Empty Unit",
        "EU-001",
        "project-1",
        []
      );

      mockRepository.findById = jest.fn().mockResolvedValue(emptyUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      await expect(useCase.execute("unit-3", "todo-1"))
        .rejects
        .toBeInstanceOf(TodoNotFoundError);
    });
  });
});

import { ToggleTodoStatusUseCase } from "@/core/usecases/toggle-todo-status.usecase";
import { UnitRepository } from "@/core/ports/unit.repository";
import { Unit } from "@/core/entities/Unit";
import { Todo } from "@/core/entities/Todo";
import { UnitNotFoundError, TodoNotFoundError } from "@/core/errors";

describe("ToggleTodoStatusUseCase", () => {
  const UNIT_ID = "unit-123";
  const PROJECT_ID = "project-456";
  const TODO_ID = "todo-1";
  const TODO_ID_2 = "todo-2";

  let mockRepository: UnitRepository;
  let useCase: ToggleTodoStatusUseCase;

  const createTestUnitWithTodos = (todos: Todo[] = []): Unit => {
    return new Unit(
      UNIT_ID,
      "Test Unit",
      "TU-01",
      PROJECT_ID,
      todos
    );
  };

  beforeEach(() => {
    mockRepository = {
      findById: async (): Promise<Unit | null> => null,
      findByProjectIdAndCode: async (): Promise<Unit | null> => null,
      create: async (): Promise<void> => {},
      update: async (): Promise<void> => {},
    };
    useCase = new ToggleTodoStatusUseCase(mockRepository);
  });

  it("should toggle todo status from TODO to DONE", async () => {
    const todo = new Todo(TODO_ID, "Assembly", "TODO", 10);
    const unit = createTestUnitWithTodos([todo]);

    mockRepository.findById = async () => unit;

    const result = await useCase.execute(UNIT_ID, TODO_ID);

    expect(result).toBeInstanceOf(Unit);
    expect(result.todos[0].status).toBe("DONE");
    expect(result.todos[0].id).toBe(TODO_ID);
  });

  it("should toggle todo status from DONE to TODO", async () => {
    const todo = new Todo(TODO_ID, "Assembly", "DONE", 10);
    const unit = createTestUnitWithTodos([todo]);

    mockRepository.findById = async () => unit;

    const result = await useCase.execute(UNIT_ID, TODO_ID);

    expect(result.todos[0].status).toBe("TODO");
  });

  it("should preserve other todos when toggling one", async () => {
    const todo1 = new Todo(TODO_ID, "Assembly", "TODO", 10);
    const todo2 = new Todo(TODO_ID_2, "Primer", "DONE", 20);
    const unit = createTestUnitWithTodos([todo1, todo2]);

    mockRepository.findById = async () => unit;

    const result = await useCase.execute(UNIT_ID, TODO_ID);

    expect(result.todos[0].status).toBe("DONE");
    expect(result.todos[1].status).toBe("DONE");
    expect(result.todos[1].label).toBe("Primer");
  });

  it("should throw UnitNotFoundError when unit does not exist", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute(UNIT_ID, TODO_ID)).rejects.toThrow(UnitNotFoundError);
  });

  it("should throw TodoNotFoundError when todo does not exist in unit", async () => {
    const todo = new Todo(TODO_ID, "Assembly", "TODO", 10);
    const unit = createTestUnitWithTodos([todo]);

    mockRepository.findById = async () => unit;

    await expect(useCase.execute(UNIT_ID, "nonexistent-todo-id")).rejects.toThrow(
      TodoNotFoundError
    );
  });

  it("should call update with the modified unit", async () => {
    const todo = new Todo(TODO_ID, "Assembly", "TODO", 10);
    const unit = createTestUnitWithTodos([todo]);
    let updateCalledWith: Unit | null = null;

    mockRepository.findById = async () => unit;
    mockRepository.update = async (updatedUnit: Unit) => {
      updateCalledWith = updatedUnit;
    };

    await useCase.execute(UNIT_ID, TODO_ID);

    expect(updateCalledWith).not.toBeNull();
    expect(updateCalledWith!.id).toBe(UNIT_ID);
    expect(updateCalledWith!.todos[0].status).toBe("DONE");
  });

  it("should not call update when unit is not found", async () => {
    let updateCalled = false;

    mockRepository.findById = async () => null;
    mockRepository.update = async () => {
      updateCalled = true;
    };

    try {
      await useCase.execute(UNIT_ID, TODO_ID);
    } catch (error) {
      expect(error).toBeInstanceOf(UnitNotFoundError);
    }

    expect(updateCalled).toBe(false);
  });
});

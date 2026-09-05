import { AddTodoToUnitUseCase } from "@/core/usecases/add-todo-to-unit.usecase";
import { UnitRepository } from "@/core/ports/unit.repository";
import { Unit } from "@/core/entities/Unit";
import { Todo } from "@/core/entities/Todo";
import { UnitNotFoundError, TodoLabelEmptyError } from "@/core/errors";

describe("AddTodoToUnitUseCase", () => {
  const UNIT_ID = "unit-123";
  const PROJECT_ID = "project-456";

  let mockRepository: UnitRepository;
  let useCase: AddTodoToUnitUseCase;

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
    useCase = new AddTodoToUnitUseCase(mockRepository);
  });

  it("should add a new todo to an empty unit with order 10", async () => {
    const unit = createTestUnitWithTodos([]);

    mockRepository.findById = async () => unit;

    const result = await useCase.execute(UNIT_ID, "New Task");

    expect(result.todos).toHaveLength(1);
    expect(result.todos[0].label).toBe("New Task");
    expect(result.todos[0].status).toBe("TODO");
    expect(result.todos[0].order).toBe(10);
  });

  it("should add a new todo to a unit with existing todos with order = lastOrder + 10", async () => {
    const existingTodos = [
      new Todo("todo-1", "Assembly", "TODO", 10),
      new Todo("todo-2", "Primer", "DONE", 20),
      new Todo("todo-3", "Base", "TODO", 30),
    ];
    const unit = createTestUnitWithTodos(existingTodos);

    mockRepository.findById = async () => unit;

    const result = await useCase.execute(UNIT_ID, "New Task");

    expect(result.todos).toHaveLength(4);
    expect(result.todos[3].label).toBe("New Task");
    expect(result.todos[3].order).toBe(40);
  });

  it("should preserve existing todos when adding a new one", async () => {
    const existingTodos = [
      new Todo("todo-1", "Assembly", "TODO", 10),
      new Todo("todo-2", "Primer", "DONE", 20),
    ];
    const unit = createTestUnitWithTodos(existingTodos);

    mockRepository.findById = async () => unit;

    const result = await useCase.execute(UNIT_ID, "New Task");

    expect(result.todos).toHaveLength(3);
    expect(result.todos[0].label).toBe("Assembly");
    expect(result.todos[1].label).toBe("Primer");
    expect(result.todos[2].label).toBe("New Task");
    expect(result.todos[0].status).toBe("TODO");
    expect(result.todos[1].status).toBe("DONE");
  });

  it("should throw UnitNotFoundError when unit does not exist", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute(UNIT_ID, "New Task")).rejects.toThrow(UnitNotFoundError);
  });

  it("should throw TodoLabelEmptyError when label is empty", async () => {
    const unit = createTestUnitWithTodos([]);
    mockRepository.findById = async () => unit;

    await expect(useCase.execute(UNIT_ID, "")).rejects.toThrow(TodoLabelEmptyError);
  });

  it("should throw TodoLabelEmptyError when label is whitespace only", async () => {
    const unit = createTestUnitWithTodos([]);
    mockRepository.findById = async () => unit;

    await expect(useCase.execute(UNIT_ID, "   ")).rejects.toThrow(TodoLabelEmptyError);
  });

  it("should call update with the modified unit", async () => {
    const unit = createTestUnitWithTodos([]);
    let updateCalledWith: Unit | null = null;

    mockRepository.findById = async () => unit;
    mockRepository.update = async (updatedUnit: Unit) => {
      updateCalledWith = updatedUnit;
    };

    await useCase.execute(UNIT_ID, "New Task");

    expect(updateCalledWith).not.toBeNull();
    expect(updateCalledWith!.id).toBe(UNIT_ID);
    expect(updateCalledWith!.todos).toHaveLength(1);
    expect(updateCalledWith!.todos[0].label).toBe("New Task");
  });

  it("should not call update when unit is not found", async () => {
    let updateCalled = false;

    mockRepository.findById = async () => null;
    mockRepository.update = async () => {
      updateCalled = true;
    };

    try {
      await useCase.execute(UNIT_ID, "New Task");
    } catch (error) {
      expect(error).toBeInstanceOf(UnitNotFoundError);
    }

    expect(updateCalled).toBe(false);
  });

  it("should not call update when label is empty", async () => {
    const unit = createTestUnitWithTodos([]);
    let updateCalled = false;

    mockRepository.findById = async () => unit;
    mockRepository.update = async () => {
      updateCalled = true;
    };

    try {
      await useCase.execute(UNIT_ID, "");
    } catch (error) {
      expect(error).toBeInstanceOf(TodoLabelEmptyError);
    }

    expect(updateCalled).toBe(false);
  });

  it("should generate a unique id for the new todo", async () => {
    const unit = createTestUnitWithTodos([]);

    mockRepository.findById = async () => unit;

    const result = await useCase.execute(UNIT_ID, "New Task");

    expect(result.todos[0].id).toBeDefined();
    expect(result.todos[0].id).not.toBe("");
  });
});

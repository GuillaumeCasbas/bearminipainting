import { GetUnitByIdUseCase } from "@/core/usecases/get-unit-by-id.usecase";
import { UnitRepository } from "@/core/ports/unit.repository";
import { Unit } from "@/core/entities/Unit";
import { Todo } from "@/core/entities/Todo";
import { UnitNotFoundError } from "@/core/errors";

describe("GetUnitByIdUseCase", () => {
  let lastFindByIdCall: string | null = null;

  const mockUnitRepository: UnitRepository = {
    findById: async (id: string): Promise<Unit | null> => {
      lastFindByIdCall = id;
      return null;
    },
    findByProjectIdAndCode: async (_projectId: string, _code: string): Promise<Unit | null> => null,
    create: async (_unit: Unit): Promise<void> => {},
    update: async (_unit: Unit): Promise<void> => {},
  };

  const useCase = new GetUnitByIdUseCase(mockUnitRepository);

  it("should return a unit if found by id", async () => {
    const mockTodo = new Todo("todo-1", "Assembly", "TODO", 10);
    const mockUnit = new Unit("unit-1", "Intercessor", "IA-01", "project-1", [mockTodo]);

    mockUnitRepository.findById = async (id: string) => {
      lastFindByIdCall = id;
      return mockUnit;
    };

    const result = await useCase.execute("unit-1");

    expect(result).toBeInstanceOf(Unit);
    expect(result.id).toBe("unit-1");
    expect(result.name).toBe("Intercessor");
    expect(result.code).toBe("IA-01");
    expect(result.projectId).toBe("project-1");
    expect(result.todos).toHaveLength(1);
    expect(result.todos[0].label).toBe("Assembly");
    expect(lastFindByIdCall).toBe("unit-1");
  });

  it("should throw UnitNotFoundError if unit is not found", async () => {
    mockUnitRepository.findById = async (id: string) => {
      lastFindByIdCall = id;
      return null;
    };

    await expect(useCase.execute("non-existent-unit-id")).rejects.toThrow(UnitNotFoundError);
    expect(lastFindByIdCall).toBe("non-existent-unit-id");
  });

  it("should return unit with multiple todos sorted by order", async () => {
    const todos = [
      new Todo("todo-1", "Primer", "TODO", 20),
      new Todo("todo-2", "Assembly", "TODO", 10),
      new Todo("todo-3", "Varnish", "TODO", 60),
      new Todo("todo-4", "Base", "TODO", 30),
    ];
    const mockUnit = new Unit("unit-1", "Tactical Marine", "TM-01", "project-1", todos);

    mockUnitRepository.findById = async (id: string) => {
      lastFindByIdCall = id;
      return mockUnit;
    };

    const result = await useCase.execute("unit-1");

    expect(result.todos).toHaveLength(4);
    expect(result.getCompletionRate()).toBe(0); // All todos are TODO status
  });
});
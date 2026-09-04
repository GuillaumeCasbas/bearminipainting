import { CreateUnitUseCase } from "../../../src/core/usecases/create-unit.usecase";
import { UnitRepository } from "../../../src/core/ports/unit.repository";
import { Unit } from "../../../src/core/entities/Unit";
import { Todo } from "../../../src/core/entities/Todo";
import {
  UnitNameEmptyError,
  UnitCodeInvalidCharactersError,
  UnitCodeNotUniqueError,
} from "../../../src/core/errors";

describe("CreateUnitUseCase", () => {
  const PROJECT_ID = "project-123";
  const VALID_NAME = "Intercessor";
  const VALID_CODE = "INT-01";
  const INVALID_CODE_WITH_SPECIAL_CHARS = "INT@01";
  const INVALID_CODE_WITH_SPACE = "INT 01";

  // Default todos configuration from CONTEXT.md
  const DEFAULT_TODOS = [
    { label: "Assembly", order: 10 },
    { label: "Primer", order: 20 },
    { label: "Base", order: 30 },
    { label: "Effects", order: 40 },
    { label: "Basecoat", order: 50 },
    { label: "Varnish", order: 60 },
  ];

  let mockRepository: UnitRepository;
  let useCase: CreateUnitUseCase;

  beforeEach(() => {
    mockRepository = {
      findById: async (): Promise<Unit | null> => null,
      findByProjectIdAndCode: async (): Promise<Unit | null> => null,
      create: async (): Promise<void> => {},
      update: async (): Promise<void> => {},
    };
    useCase = new CreateUnitUseCase(mockRepository);
  });

  // === SUCCESS CASES ===

  it("should create a unit with valid name and code", async () => {
    const result = await useCase.execute(VALID_NAME, VALID_CODE, PROJECT_ID);

    expect(result).toBeInstanceOf(Unit);
    expect(result.name).toBe(VALID_NAME);
    expect(result.code).toBe(VALID_CODE);
    expect(result.projectId).toBe(PROJECT_ID);
    expect(result.id).toBeDefined();
    expect(result.todos.length).toBe(DEFAULT_TODOS.length);
    expect(result.todos.every((todo) => todo.status === "TODO")).toBe(true);
  });

  it("should convert unit code to uppercase", async () => {
    const lowercaseCode = "int-01";
    const result = await useCase.execute(VALID_NAME, lowercaseCode, PROJECT_ID);

    expect(result.code).toBe("INT-01");
  });

  it("should create unit with default todos in correct order", async () => {
    const result = await useCase.execute(VALID_NAME, VALID_CODE, PROJECT_ID);

    expect(result.todos.length).toBe(6);
    expect(result.todos[0].label).toBe("Assembly");
    expect(result.todos[0].order).toBe(10);
    expect(result.todos[1].label).toBe("Primer");
    expect(result.todos[1].order).toBe(20);
    expect(result.todos[2].label).toBe("Base");
    expect(result.todos[2].order).toBe(30);
    expect(result.todos[3].label).toBe("Effects");
    expect(result.todos[3].order).toBe(40);
    expect(result.todos[4].label).toBe("Basecoat");
    expect(result.todos[4].order).toBe(50);
    expect(result.todos[5].label).toBe("Varnish");
    expect(result.todos[5].order).toBe(60);
  });

  // === ERROR CASES ===

  it("should throw UnitNameEmptyError when name is empty", async () => {
    await expect(useCase.execute("", VALID_CODE, PROJECT_ID))
      .rejects
      .toBeInstanceOf(UnitNameEmptyError);
  });

  it("should throw UnitNameEmptyError when name is whitespace only", async () => {
    await expect(useCase.execute("   ", VALID_CODE, PROJECT_ID))
      .rejects
      .toBeInstanceOf(UnitNameEmptyError);
  });

  it("should throw UnitCodeInvalidCharactersError when code contains special characters", async () => {
    await expect(
      useCase.execute(VALID_NAME, INVALID_CODE_WITH_SPECIAL_CHARS, PROJECT_ID)
    ).rejects.toBeInstanceOf(UnitCodeInvalidCharactersError);
  });

  it("should throw UnitCodeInvalidCharactersError when code contains spaces", async () => {
    await expect(
      useCase.execute(VALID_NAME, INVALID_CODE_WITH_SPACE, PROJECT_ID)
    ).rejects.toBeInstanceOf(UnitCodeInvalidCharactersError);
  });

  it("should throw UnitCodeInvalidCharactersError when code is empty", async () => {
    await expect(useCase.execute(VALID_NAME, "", PROJECT_ID))
      .rejects
      .toBeInstanceOf(UnitCodeInvalidCharactersError);
  });

  it("should throw UnitCodeNotUniqueError when code already exists in project", async () => {
    const existingUnit = new Unit(
      "existing-id",
      "Existing Unit",
      VALID_CODE,
      PROJECT_ID,
      []
    );

    mockRepository.findByProjectIdAndCode = async (
      _projectId: string,
      code: string
    ): Promise<Unit | null> => {
      if (code === VALID_CODE) {
        return existingUnit;
      }
      return null;
    };

    await expect(useCase.execute(VALID_NAME, VALID_CODE, PROJECT_ID))
      .rejects
      .toBeInstanceOf(UnitCodeNotUniqueError);
  });

  // === REPOSITORY CALL VERIFICATION ===

  it("should call findByProjectIdAndCode with correct parameters", async () => {
    let findCalledWith: { projectId: string; code: string } | null = null;

    mockRepository.findByProjectIdAndCode = async (
      projectId: string,
      code: string
    ): Promise<Unit | null> => {
      findCalledWith = { projectId, code };
      return null;
    };

    await useCase.execute(VALID_NAME, VALID_CODE, PROJECT_ID);

    expect(findCalledWith).toEqual({
      projectId: PROJECT_ID,
      code: VALID_CODE,
    });
  });

  it("should call create with the created unit", async () => {
    let createdUnit: Unit | null = null;

    mockRepository.create = async (unit: Unit): Promise<void> => {
      createdUnit = unit;
    };

    await useCase.execute(VALID_NAME, VALID_CODE, PROJECT_ID);

    expect(createdUnit).not.toBeNull();
    expect(createdUnit!.name).toBe(VALID_NAME);
    expect(createdUnit!.code).toBe(VALID_CODE);
    expect(createdUnit!.projectId).toBe(PROJECT_ID);
  });

  it("should call findByProjectIdAndCode with uppercase code", async () => {
    let findCalledWithCode: string | null = null;

    mockRepository.findByProjectIdAndCode = async (
      _projectId: string,
      code: string
    ): Promise<Unit | null> => {
      findCalledWithCode = code;
      return null;
    };

    await useCase.execute(VALID_NAME, "int-01", PROJECT_ID);

    expect(findCalledWithCode).toBe("INT-01");
  });
});

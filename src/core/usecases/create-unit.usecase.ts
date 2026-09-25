import { Unit } from '../entities/Unit';
import { Todo } from '../entities/Todo';
import { UnitRepository } from '../ports/unit.repository';
import { DEFAULT_TODOS } from '../constants/default-todos';
import { UNIT_CODE_REGEX } from '../constants/unit-code';
import {
  UnitNameEmptyError,
  UnitCodeInvalidCharactersError,
  UnitCodeNotUniqueError,
} from '../errors';

export class CreateUnitUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(name: string, code: string, projectId: string): Promise<Unit> {
    // Validate name
    if (!name || name.trim() === '') {
      throw new UnitNameEmptyError();
    }

    // Normalize and validate code
    const normalizedCode = code.toUpperCase();
    if (!UNIT_CODE_REGEX.test(normalizedCode)) {
      throw new UnitCodeInvalidCharactersError(code);
    }

    // Check code uniqueness within project
    const existingUnit = await this.unitRepository.findByProjectIdAndCode(
      projectId,
      normalizedCode,
    );
    if (existingUnit) {
      throw new UnitCodeNotUniqueError(normalizedCode);
    }

    // Create todos
    const todos = DEFAULT_TODOS.map(
      (todoConfig) => new Todo(crypto.randomUUID(), todoConfig.label, 'TODO', todoConfig.order),
    );

    // Create and persist unit
    const unit = new Unit(crypto.randomUUID(), name, normalizedCode, projectId, todos);

    await this.unitRepository.create(unit);

    return unit;
  }
}

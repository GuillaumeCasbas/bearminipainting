import { Unit } from '../entities/Unit';
import { Todo } from '../entities/Todo';
import { UnitRepository } from '../ports/unit.repository';
import {
  UnitNameEmptyError,
  UnitCodeInvalidCharactersError,
  UnitCodeNotUniqueError,
} from '../errors';

export class CreateUnitUseCase {
  // Default todos configuration from CONTEXT.md
  private static readonly DEFAULT_TODOS = [
    { label: 'Assembly', order: 10 },
    { label: 'Primer', order: 20 },
    { label: 'Base', order: 30 },
    { label: 'Effects', order: 40 },
    { label: 'Basecoat', order: 50 },
    { label: 'Varnish', order: 60 },
  ];

  private readonly unitCodeRegex = /^[a-zA-Z0-9-]+$/;

  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(name: string, code: string, projectId: string): Promise<Unit> {
    // Validate name
    if (!name || name.trim() === '') {
      throw new UnitNameEmptyError();
    }

    // Normalize and validate code
    const normalizedCode = code.toUpperCase();
    if (!this.unitCodeRegex.test(normalizedCode)) {
      throw new UnitCodeInvalidCharactersError(code);
    }

    // Check code uniqueness within project
    const existingUnit = await this.unitRepository.findByProjectIdAndCode(
      projectId,
      normalizedCode
    );
    if (existingUnit) {
      throw new UnitCodeNotUniqueError(normalizedCode);
    }

    // Create todos
    const todos = CreateUnitUseCase.DEFAULT_TODOS.map(
      (todoConfig) =>
        new Todo(
          crypto.randomUUID(),
          todoConfig.label,
          'TODO',
          todoConfig.order
        )
    );

    // Create and persist unit
    const unit = new Unit(
      crypto.randomUUID(),
      name,
      normalizedCode,
      projectId,
      todos
    );

    await this.unitRepository.create(unit);

    return unit;
  }
}

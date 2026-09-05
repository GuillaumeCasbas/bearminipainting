import { Unit } from '../entities/Unit';
import { Todo } from '../entities/Todo';
import { UnitRepository } from '../ports/unit.repository';
import { UnitNotFoundError, TodoLabelEmptyError } from '../errors';

export class AddTodoToUnitUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(unitId: string, label: string): Promise<Unit> {
    // Validate label is not empty
    if (!label || label.trim() === '') {
      throw new TodoLabelEmptyError();
    }

    // Find the unit by ID
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
      throw new UnitNotFoundError(unitId);
    }

    // Calculate the new order (lastOrder + 10, or 10 if no todos)
    const lastOrder = unit.todos.length > 0 
      ? Math.max(...unit.todos.map(todo => todo.order)) 
      : 0;
    const newOrder = lastOrder + 10;

    // Create the new todo
    const newTodo = new Todo(
      crypto.randomUUID(),
      label.trim(),
      'TODO',
      newOrder
    );

    // Create a new unit instance with the updated todos
    const updatedUnit = new Unit(
      unit.id,
      unit.name,
      unit.code,
      unit.projectId,
      [...unit.todos, newTodo]
    );

    // Persist the changes via repository
    await this.unitRepository.update(updatedUnit);

    // Return the updated unit
    return updatedUnit;
  }
}

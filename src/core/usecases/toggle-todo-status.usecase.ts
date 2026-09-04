import { Unit } from '../entities/Unit';
import { Todo, TodoStatus } from '../entities/Todo';
import { UnitRepository } from '../ports/unit.repository';
import { UnitNotFoundError, TodoNotFoundError } from '../errors';

export class ToggleTodoStatusUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(unitId: string, todoId: string): Promise<Unit> {
    // 1. Find the unit
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
      throw new UnitNotFoundError(unitId);
    }

    // 2. Find the todo in the unit
    const todoIndex = unit.todos.findIndex((todo) => todo.id === todoId);
    if (todoIndex === -1) {
      throw new TodoNotFoundError(todoId, unitId);
    }

    // 3. Toggle the todo status
    const updatedTodos = [...unit.todos];
    const todoToUpdate = updatedTodos[todoIndex];
    const newStatus: TodoStatus = todoToUpdate.status === 'TODO' ? 'DONE' : 'TODO';
    updatedTodos[todoIndex] = new Todo(
      todoToUpdate.id,
      todoToUpdate.label,
      newStatus,
      todoToUpdate.order
    );

    // 4. Create updated unit with new todos
    const updatedUnit = new Unit(
      unit.id,
      unit.name,
      unit.code,
      unit.projectId,
      updatedTodos
    );

    // 5. Persist the update
    await this.unitRepository.update(updatedUnit);

    // 6. Return the updated unit
    return updatedUnit;
  }
}

import { Unit } from '../entities/Unit';
import { Todo, TodoStatus } from '../entities/Todo';
import { UnitRepository } from '../ports/unit.repository';
import { UnitNotFoundError, TodoNotFoundError } from '../errors';

export class ToggleTodoStatusUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(unitId: string, todoId: string): Promise<Unit> {
    // Find the unit by ID
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
      throw new UnitNotFoundError(unitId);
    }

    // Locate the todo within the unit
    const todoIndex = unit.todos.findIndex((todo) => todo.id === todoId);
    if (todoIndex === -1) {
      throw new TodoNotFoundError(todoId);
    }

    // Toggle the todo status between TODO and DONE
    const updatedTodos = [...unit.todos];
    const todoToUpdate = updatedTodos[todoIndex];
    const newStatus: TodoStatus = todoToUpdate.status === 'TODO' ? 'DONE' : 'TODO';
    updatedTodos[todoIndex] = new Todo(
      todoToUpdate.id,
      todoToUpdate.label,
      newStatus,
      todoToUpdate.order
    );

    // Create a new unit instance with the updated todos
    const updatedUnit = new Unit(
      unit.id,
      unit.name,
      unit.code,
      unit.projectId,
      updatedTodos
    );

    // Persist the changes via repository
    await this.unitRepository.update(updatedUnit);

    // Return the updated unit
    return updatedUnit;
  }
}

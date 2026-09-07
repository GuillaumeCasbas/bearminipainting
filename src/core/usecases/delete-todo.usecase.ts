/**
 * DeleteTodoUseCase - Handles deletion of a todo from a unit
 * 
 * BEA-29: Feature - Delete a todo
 */

import { Unit } from '../entities/Unit';
import { Todo } from '../entities/Todo';
import { UnitRepository } from '../ports/unit.repository';
import { UnitNotFoundError, TodoNotFoundError } from '../errors';

export class DeleteTodoUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  /**
   * Deletes a todo from a unit
   * 
   * @param unitId - The ID of the unit containing the todo
   * @param todoId - The ID of the todo to delete
   * @returns The updated unit after deletion
   * @throws UnitNotFoundError - If the unit does not exist
   * @throws TodoNotFoundError - If the todo does not exist in the unit
   */
  async execute(unitId: string, todoId: string): Promise<Unit> {
    // Find the unit by ID
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
      throw new UnitNotFoundError(unitId);
    }

    // Check if todo exists in the unit
    const todoIndex = unit.todos.findIndex(todo => todo.id === todoId);
    if (todoIndex === -1) {
      throw new TodoNotFoundError(todoId);
    }

    // Create a new unit instance without the todo
    const updatedTodos = unit.todos.filter((_, index) => index !== todoIndex);
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

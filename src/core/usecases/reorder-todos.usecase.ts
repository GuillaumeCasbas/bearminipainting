import { Unit } from '../entities/Unit';
import { Todo } from '../entities/Todo';
import { UnitRepository } from '../ports/unit.repository';
import { UnitNotFoundError, TodoNotFoundError } from '../errors';

export class ReorderTodosUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(unitId: string, orderedTodoIds: string[]): Promise<Unit> {
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
      throw new UnitNotFoundError(unitId);
    }

    const unitTodoIds = new Set(unit.todos.map((t) => t.id));
    const orderedSet = new Set(orderedTodoIds);

    for (const todoId of orderedTodoIds) {
      if (!unitTodoIds.has(todoId)) {
        throw new TodoNotFoundError(todoId);
      }
    }
    for (const todoId of unitTodoIds) {
      if (!orderedSet.has(todoId)) {
        throw new TodoNotFoundError(todoId);
      }
    }

    const reorderedTodos: Todo[] = orderedTodoIds.map((todoId) => {
      const todo = unit.todos.find((t) => t.id === todoId);
      if (!todo) {
        throw new TodoNotFoundError(todoId);
      }
      return todo;
    });

    const updatedTodos = reorderedTodos.map(
      (todo, index) => new Todo(todo.id, todo.label, todo.status, index * 10)
    );

    const updatedUnit = new Unit(
      unit.id,
      unit.name,
      unit.code,
      unit.projectId,
      updatedTodos
    );

    await this.unitRepository.update(updatedUnit);
    return updatedUnit;
  }
}

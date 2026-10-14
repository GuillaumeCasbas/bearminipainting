import { Todo } from './Todo';
import { UNIT_NOTES_MAX_LENGTH } from '../constants/unit-notes';
import { UnitNotesTooLongError } from '../errors';

export class Unit {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly projectId: string;
  readonly todos: Todo[];
  readonly notes: string;

  constructor(
    id: string,
    name: string,
    code: string,
    projectId: string,
    todos: Todo[] = [],
    notes: string = '',
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.projectId = projectId;
    this.todos = todos;
    if (notes.length > UNIT_NOTES_MAX_LENGTH) {
      throw new UnitNotesTooLongError(UNIT_NOTES_MAX_LENGTH);
    }
    this.notes = notes;
  }

  getCompletionRate(): number {
    if (this.todos.length === 0) {
      return 100;
    }
    const totalTodos = this.todos.length;
    const doneTodos = this.todos.filter((todo) => todo.status === 'DONE').length;
    const rate = (doneTodos / totalTodos) * 100;
    return Math.round(rate);
  }
}

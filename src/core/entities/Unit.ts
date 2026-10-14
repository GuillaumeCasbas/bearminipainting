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
    // Single source of truth: notes are trimmed here and validated after trim,
    // so every Unit instance guarantees the same invariant regardless of the caller.
    const trimmedNotes = notes.trim();
    if (trimmedNotes.length > UNIT_NOTES_MAX_LENGTH) {
      throw new UnitNotesTooLongError(UNIT_NOTES_MAX_LENGTH);
    }
    this.notes = trimmedNotes;
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

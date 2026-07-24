import { Todo, TodoStatus } from './Todo';

export class Unit {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly projectId: string;
  readonly todos: Todo[];

  constructor(
    id: string,
    name: string,
    code: string,
    projectId: string,
    todos: Todo[] = []
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.projectId = projectId;
    this.todos = todos;
  }


}

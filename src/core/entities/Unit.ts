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
    this.todos = todos.length > 0 ? todos : this.createDefaultTodos();
  }

  private createDefaultTodos(): Todo[] {
    const defaultTodos = [
      { label: 'Assembly', order: 10 },
      { label: 'Primer', order: 20 },
      { label: 'Base', order: 30 },
      { label: 'Effects', order: 40 },
      { label: 'Basecoat', order: 50 },
      { label: 'Varnish', order: 60 },
    ];

    return defaultTodos.map((todo) => {
      const id = crypto.randomUUID();
      return new Todo(id, todo.label, 'TODO', todo.order);
    });
  }

  getCompletionRate(): number {
    if (this.todos.length === 0) {
      return 100;
    }
    const doneTodos = this.todos.filter((todo) => todo.status === 'DONE').length;
    const rate = (doneTodos / this.todos.length) * 100;
    return Math.round(rate);
  }
}

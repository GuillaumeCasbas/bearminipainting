export type TodoStatus = 'TODO' | 'DONE';

export class Todo {
  readonly id: string;
  readonly label: string;
  readonly status: TodoStatus;
  readonly order: number;

  constructor(id: string, label: string, status: TodoStatus = 'TODO', order: number) {
    this.id = id;
    this.label = label;
    this.status = status;
    this.order = order;
  }
}

import { TodoStatus } from './Todo';

export interface StoredTodoData {
  id: string;
  label: string;
  status: TodoStatus;
  order: number;
}

export interface StoredUnitData {
  id: string;
  name: string;
  code: string;
  projectId: string;
  todos: StoredTodoData[];
}

export interface StoredProjectData {
  id: string;
  name: string;
  code: string;
  units: StoredUnitData[];
}

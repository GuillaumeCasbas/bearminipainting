import { Unit } from './Unit';

export class Project {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly units: Unit[];

  constructor(id: string, name: string, code: string, units: Unit[] = []) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.units = units;
  }

  getCompletionRate(): number {
    if (this.units.length === 0) {
      return 100;
    }
    const totalTodos = this.units.reduce(
      (sum, unit) => sum + unit.todos.length,
      0
    );
    const totalDoneTodos = this.units.reduce(
      (sum, unit) => sum + unit.todos.filter((todo) => todo.status === 'DONE').length,
      0
    );
    const rate = (totalDoneTodos / totalTodos) * 100;
    return Math.round(rate);
  }
}

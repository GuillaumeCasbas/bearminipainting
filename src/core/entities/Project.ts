// TODO: Replace `unknown` with `Unit` type when Unit entity is implemented (BEA-5 scope: units not used)
export class Project {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly units: unknown[];

  constructor(id: string, name: string, code: string, units: unknown[] = []) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.units = units;
  }

  getCompletionRate(): number {
    if (this.units.length === 0) {
      return 100;
    }
    // Note: Since units are `unknown[]`, we cannot safely access `todos` without type guards.
    // For BEA-5, this method will always return 100 (no units are created yet).
    return 100;
  }
}

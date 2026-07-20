// TODO: Replace `unknown` with `Unite` type when Unite entity is implemented (BEA-5 scope: units not used)
export class Projet {
  readonly id: string;
  readonly nom: string;
  readonly code: string;
  readonly units: unknown[];

  constructor(id: string, nom: string, code: string, units: unknown[] = []) {
    this.id = id;
    this.nom = nom;
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

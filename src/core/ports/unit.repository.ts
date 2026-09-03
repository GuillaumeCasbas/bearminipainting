import { Unit } from '../entities/Unit';

export interface UnitRepository {
  findByProjectIdAndCode(projectId: string, code: string): Promise<Unit | null>;
  save(unit: Unit): Promise<void>;
}

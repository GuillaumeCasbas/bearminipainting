import { Unit } from '../entities/Unit';

export interface UnitRepository {
  findById(unitId: string): Promise<Unit | null>;
  findByProjectIdAndCode(projectId: string, code: string): Promise<Unit | null>;
  save(unit: Unit): Promise<void>;
}

import { Unit } from '../entities/Unit';

export interface UnitRepository {
  findById(unitId: string): Promise<Unit | null>;
  findByProjectIdAndCode(projectId: string, code: string): Promise<Unit | null>;
  create(unit: Unit): Promise<void>;
  update(unit: Unit): Promise<void>;
}

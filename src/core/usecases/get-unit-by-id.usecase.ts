import { UnitRepository } from '../ports/unit.repository';
import { Unit } from '../entities/Unit';
import { UnitNotFoundError } from '../errors';

export class GetUnitByIdUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(unitId: string): Promise<Unit> {
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
      throw new UnitNotFoundError(unitId);
    }
    return unit;
  }
}
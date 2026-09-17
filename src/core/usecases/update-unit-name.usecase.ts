import { Unit } from '../entities/Unit';
import { UnitRepository } from '../ports/unit.repository';
import { UnitNotFoundError, UnitNameEmptyError } from '../errors';

export class UpdateUnitNameUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(unitId: string, newName: string): Promise<Unit> {
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
      throw new UnitNotFoundError(unitId);
    }

    if (!newName || newName.trim() === '') {
      throw new UnitNameEmptyError();
    }

    const updatedUnit = new Unit(unit.id, newName.trim(), unit.code, unit.projectId, unit.todos);

    await this.unitRepository.update(updatedUnit);
    return updatedUnit;
  }
}

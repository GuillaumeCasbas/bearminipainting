import { Unit } from '../entities/Unit';
import { UnitRepository } from '../ports/unit.repository';
import { UnitNotFoundError } from '../errors';

export class UpdateUnitNotesUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(unitId: string, newNotes: string): Promise<Unit> {
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
      throw new UnitNotFoundError(unitId);
    }
    // Length validation and trimming are enforced by the Unit entity itself
    const updatedUnit = new Unit(
      unit.id,
      unit.name,
      unit.code,
      unit.projectId,
      unit.todos,
      newNotes,
    );
    await this.unitRepository.update(updatedUnit);
    return updatedUnit;
  }
}

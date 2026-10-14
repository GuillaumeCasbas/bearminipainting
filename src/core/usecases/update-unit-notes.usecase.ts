import { Unit } from '../entities/Unit';
import { UnitRepository } from '../ports/unit.repository';
import { UnitNotFoundError, UnitNotesTooLongError } from '../errors';
import { UNIT_NOTES_MAX_LENGTH } from '../constants/unit-notes';

export class UpdateUnitNotesUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(unitId: string, newNotes: string): Promise<Unit> {
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
      throw new UnitNotFoundError(unitId);
    }
    const trimmedNotes = newNotes.trim();
    if (trimmedNotes.length > UNIT_NOTES_MAX_LENGTH) {
      throw new UnitNotesTooLongError(UNIT_NOTES_MAX_LENGTH);
    }
    const updatedUnit = new Unit(unit.id, unit.name, unit.code, unit.projectId, unit.todos, trimmedNotes);
    await this.unitRepository.update(updatedUnit);
    return updatedUnit;
  }
}

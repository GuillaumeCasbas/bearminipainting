import { UnitRepository } from '../ports/unit.repository';
import { UnitNotFoundError } from '../errors';

export class DeleteUnitUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(unitId: string): Promise<void> {
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
      throw new UnitNotFoundError(unitId);
    }
    await this.unitRepository.delete(unitId);
  }
}

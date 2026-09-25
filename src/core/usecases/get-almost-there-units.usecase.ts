import { Unit } from '../entities/Unit';
import { ALMOST_THERE_MIN_RATE, ALMOST_THERE_MAX_COUNT } from '../constants/almost-there';

export class GetAlmostThereUnitsUseCase {
  async execute(units: Unit[]): Promise<Unit[]> {
    return units
      .filter(
        (unit) =>
          unit.getCompletionRate() >= ALMOST_THERE_MIN_RATE && unit.getCompletionRate() < 100,
      )
      .sort((a, b) => {
        const rateDiff = b.getCompletionRate() - a.getCompletionRate();
        if (rateDiff !== 0) return rateDiff;
        const nameDiff = a.name.localeCompare(b.name);
        if (nameDiff !== 0) return nameDiff;
        return a.id.localeCompare(b.id);
      })
      .slice(0, ALMOST_THERE_MAX_COUNT);
  }
}

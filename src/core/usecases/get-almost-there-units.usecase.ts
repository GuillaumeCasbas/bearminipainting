import { Unit } from '../entities/Unit';
import { ALMOST_THERE_MIN_RATE, ALMOST_THERE_MAX_COUNT } from '../constants/almost-there';

export class GetAlmostThereUnitsUseCase {
  async execute(units: Unit[]): Promise<Unit[]> {
    const eligible = units
      .filter((unit) => unit.getCompletionRate() >= ALMOST_THERE_MIN_RATE)
      .filter((unit) => unit.getCompletionRate() < 100)
      .map((unit) => ({ unit, rate: unit.getCompletionRate() }));

    const sorted = eligible
      .sort((a, b) => {
        const rateDiff = b.rate - a.rate;
        if (rateDiff !== 0) return rateDiff;
        const nameDiff = a.unit.name.localeCompare(b.unit.name);
        if (nameDiff !== 0) return nameDiff;
        return a.unit.id.localeCompare(b.unit.id);
      })
      .slice(0, ALMOST_THERE_MAX_COUNT);

    return Promise.resolve(sorted.map((entry) => entry.unit));
  }
}

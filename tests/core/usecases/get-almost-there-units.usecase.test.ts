import { Unit } from '../../../src/core/entities/Unit';
import { Todo } from '../../../src/core/entities/Todo';
import { GetAlmostThereUnitsUseCase } from '../../../src/core/usecases/get-almost-there-units.usecase';
import {
  ALMOST_THERE_MIN_RATE,
  ALMOST_THERE_MAX_COUNT,
} from '../../../src/core/constants/almost-there';

const makeUnit = (
  id: string,
  name: string,
  doneTodos: number,
  totalTodos: number,
): Unit => {
  const todos = Array.from(
    { length: totalTodos },
    (_, index) =>
      new Todo(
        `todo-${id}-${index}`,
        `Task ${index + 1}`,
        index < doneTodos ? 'DONE' : 'TODO',
        (index + 1) * 10,
      ),
  );
  return new Unit(id, name, `UNIT-${id}`, 'project-1', todos);
};

describe('GetAlmostThereUnitsUseCase', () => {
  it('exposes the threshold and max count as tunable constants', () => {
    expect(ALMOST_THERE_MIN_RATE).toBe(75);
    expect(ALMOST_THERE_MAX_COUNT).toBe(3);
  });

  it('returns only unfinished units with a completion rate >= 75%', async () => {
    const eligible = makeUnit('u1', 'Almost done', 3, 4);
    const tooLow = makeUnit('u2', 'Barely started', 1, 4);
    const finished = makeUnit('u3', 'Finished', 4, 4);

    const useCase = new GetAlmostThereUnitsUseCase();
    const result = await useCase.execute([eligible, tooLow, finished]);

    expect(result.map((unit) => unit.id)).toEqual(['u1']);
  });

  it('excludes units at 100% completion', async () => {
    const finished = makeUnit('u1', 'Finished', 4, 4);

    const useCase = new GetAlmostThereUnitsUseCase();
    const result = await useCase.execute([finished]);

    expect(result).toEqual([]);
  });

  it('returns at most 3 units, the most advanced ones', async () => {
    const units = [
      makeUnit('u1', 'Ninety', 9, 10),
      makeUnit('u2', 'Eighty', 8, 10),
      makeUnit('u3', 'Seventy-five', 3, 4),
      makeUnit('u4', 'Ninety-five', 19, 20),
      makeUnit('u5', 'Eighty-five', 17, 20),
    ];

    const useCase = new GetAlmostThereUnitsUseCase();
    const result = await useCase.execute(units);

    expect(result.map((unit) => unit.id)).toEqual(['u4', 'u1', 'u5']);
  });

  it('sorts by completion rate descending', async () => {
    const units = [
      makeUnit('u1', 'Eighty', 8, 10),
      makeUnit('u2', 'Ninety', 9, 10),
      makeUnit('u3', 'Eighty-five', 17, 20),
    ];

    const useCase = new GetAlmostThereUnitsUseCase();
    const result = await useCase.execute(units);

    expect(result.map((unit) => unit.id)).toEqual(['u2', 'u3', 'u1']);
  });

  it('breaks rate ties by name alphabetical, then by id', async () => {
    const units = [
      makeUnit('u2', 'Bravo', 3, 4),
      makeUnit('u1', 'Alpha', 3, 4),
      makeUnit('u3', 'Alpha', 3, 4),
    ];

    const useCase = new GetAlmostThereUnitsUseCase();
    const result = await useCase.execute(units);

    expect(result.map((unit) => unit.id)).toEqual(['u1', 'u3', 'u2']);
  });

  it('returns an empty list when no unit is eligible', async () => {
    const units = [
      makeUnit('u1', 'Low', 1, 10),
      makeUnit('u2', 'Finished', 10, 10),
    ];

    const useCase = new GetAlmostThereUnitsUseCase();
    const result = await useCase.execute(units);

    expect(result).toEqual([]);
  });

  it('does not mutate the input units array', async () => {
    const units = [
      makeUnit('u2', 'Bravo', 8, 10),
      makeUnit('u1', 'Alpha', 9, 10),
    ];
    const originalOrder = units.map((unit) => unit.id);

    const useCase = new GetAlmostThereUnitsUseCase();
    await useCase.execute(units);

    expect(units.map((unit) => unit.id)).toEqual(originalOrder);
  });
});

import { Unit } from '../../../src/core/entities/Unit';
import { Todo } from '../../../src/core/entities/Todo';
import { UpdateUnitNotesUseCase } from '../../../src/core/usecases/update-unit-notes.usecase';
import { UnitNotFoundError, UnitNotesTooLongError } from '../../../src/core/errors';
import { UNIT_NOTES_MAX_LENGTH } from '../../../src/core/constants/unit-notes';

const makeUnit = (notes = ''): Unit =>
  new Unit('unit-1', 'Intercessor', 'IA-01', 'project-1', [new Todo('todo-1', 'Assembly', 'TODO', 10)], notes);

describe('UpdateUnitNotesUseCase', () => {
  it('updates and persists the trimmed notes', async () => {
    const unit = makeUnit();
    const repository = { findById: jest.fn().mockResolvedValue(unit), update: jest.fn().mockResolvedValue(undefined) };
    const useCase = new UpdateUnitNotesUseCase(repository as never);

    const result = await useCase.execute('unit-1', '  Use **blue** for armor.  ');

    expect(result.notes).toBe('Use **blue** for armor.');
    expect(repository.update).toHaveBeenCalledWith(expect.objectContaining({ id: 'unit-1', notes: 'Use **blue** for armor.' }));
  });

  it('keeps the other unit fields unchanged', async () => {
    const unit = makeUnit();
    const repository = { findById: jest.fn().mockResolvedValue(unit), update: jest.fn() };
    const useCase = new UpdateUnitNotesUseCase(repository as never);

    const result = await useCase.execute('unit-1', 'New notes');

    expect(result.name).toBe('Intercessor');
    expect(result.code).toBe('IA-01');
    expect(result.projectId).toBe('project-1');
    expect(result.todos).toHaveLength(1);
  });

  it('allows clearing the notes with an empty string', async () => {
    const unit = makeUnit('Existing notes');
    const repository = { findById: jest.fn().mockResolvedValue(unit), update: jest.fn() };
    const useCase = new UpdateUnitNotesUseCase(repository as never);

    const result = await useCase.execute('unit-1', '');

    expect(result.notes).toBe('');
  });

  it('throws UnitNotFoundError when the unit does not exist', async () => {
    const repository = { findById: jest.fn().mockResolvedValue(null), update: jest.fn() };
    const useCase = new UpdateUnitNotesUseCase(repository as never);

    await expect(useCase.execute('missing', 'notes')).rejects.toThrow(UnitNotFoundError);
  });

  it(`throws UnitNotesTooLongError when notes exceed ${UNIT_NOTES_MAX_LENGTH} characters`, async () => {
    const unit = makeUnit();
    const repository = { findById: jest.fn().mockResolvedValue(unit), update: jest.fn() };
    const useCase = new UpdateUnitNotesUseCase(repository as never);

    await expect(useCase.execute('unit-1', 'a'.repeat(UNIT_NOTES_MAX_LENGTH + 1))).rejects.toThrow(
      UnitNotesTooLongError,
    );
  });
});

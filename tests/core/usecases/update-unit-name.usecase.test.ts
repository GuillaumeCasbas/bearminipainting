/**
 * Tests for UpdateUnitNameUseCase
 * BEA-38: Feature - edit unit name
 */

import { UpdateUnitNameUseCase } from '../../../src/core/usecases/update-unit-name.usecase';
import { UnitRepository } from '../../../src/core/ports/unit.repository';
import { Unit } from '../../../src/core/entities/Unit';
import { Todo } from '../../../src/core/entities/Todo';
import { UnitNotFoundError, UnitNameEmptyError } from '../../../src/core/errors';

describe('UpdateUnitNameUseCase', () => {
  let mockRepository: jest.Mocked<UnitRepository>;
  let useCase: UpdateUnitNameUseCase;

  const testTodos = [
    new Todo('todo-1', 'Assembly', 'TODO', 10),
    new Todo('todo-2', 'Primer', 'DONE', 20),
  ];

  const testUnit = new Unit('unit-1', 'Original Name', 'ORIG-01', 'project-1', testTodos);

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByProjectIdAndCode: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new UpdateUnitNameUseCase(mockRepository);
  });

  describe('Success cases', () => {
    it('should update the unit name', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute('unit-1', 'New Name');

      expect(result).toBeInstanceOf(Unit);
      expect(result.name).toBe('New Name');
    });

    it('should trim the new name', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute('unit-1', '  Trimmed Name  ');

      expect(result.name).toBe('Trimmed Name');
    });

    it('should preserve the unit code', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute('unit-1', 'New Name');

      expect(result.code).toBe('ORIG-01');
    });

    it('should preserve the unit projectId', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute('unit-1', 'New Name');

      expect(result.projectId).toBe('project-1');
    });

    it('should preserve the unit todos', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute('unit-1', 'New Name');

      expect(result.todos).toEqual(testTodos);
    });

    it('should preserve the unit id', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute('unit-1', 'New Name');

      expect(result.id).toBe('unit-1');
    });

    it('should persist the updated unit via repository update', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      await useCase.execute('unit-1', 'New Name');

      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      const persistedUnit = mockRepository.update.mock.calls[0][0] as Unit;
      expect(persistedUnit.id).toBe('unit-1');
      expect(persistedUnit.name).toBe('New Name');
      expect(persistedUnit.code).toBe('ORIG-01');
    });
  });

  describe('Error cases', () => {
    it('should throw UnitNotFoundError when unit does not exist', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(useCase.execute('non-existent-unit', 'New Name')).rejects.toBeInstanceOf(
        UnitNotFoundError,
      );

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw UnitNameEmptyError when name is empty', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);

      await expect(useCase.execute('unit-1', '')).rejects.toBeInstanceOf(UnitNameEmptyError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw UnitNameEmptyError when name is whitespace only', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);

      await expect(useCase.execute('unit-1', '   ')).rejects.toBeInstanceOf(UnitNameEmptyError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should propagate any repository error from findById', async () => {
      const testError = new Error('Storage error');
      mockRepository.findById = jest.fn().mockRejectedValue(testError);

      await expect(useCase.execute('unit-1', 'New Name')).rejects.toThrow(testError);
    });

    it('should propagate any repository error from update', async () => {
      const testError = new Error('Storage error');
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockRejectedValue(testError);

      await expect(useCase.execute('unit-1', 'New Name')).rejects.toThrow(testError);
    });
  });
});

/**
 * Tests for DeleteUnitUseCase
 * BEA-16: Feature - Delete a unit
 */

import { DeleteUnitUseCase } from '../../../src/core/usecases/delete-unit.usecase';
import { UnitRepository } from '../../../src/core/ports/unit.repository';
import { Unit } from '../../../src/core/entities/Unit';
import { Todo } from '../../../src/core/entities/Todo';
import { UnitNotFoundError } from '../../../src/core/errors';

describe('DeleteUnitUseCase', () => {
  let mockRepository: jest.Mocked<UnitRepository>;
  let useCase: DeleteUnitUseCase;

  const testUnit = new Unit(
    'unit-1',
    'Intercessor',
    'IA-01',
    'project-1',
    [new Todo('todo-1', 'Assembly', 'TODO', 10)]
  );

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByProjectIdAndCode: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteUnitUseCase(mockRepository);
  });

  describe('Success cases', () => {
    it('should delete a unit by id', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.delete = jest.fn().mockResolvedValue(undefined);

      await useCase.execute('unit-1');

      expect(mockRepository.findById).toHaveBeenCalledWith('unit-1');
      expect(mockRepository.delete).toHaveBeenCalledWith('unit-1');
    });
  });

  describe('Error cases', () => {
    it('should throw UnitNotFoundError when unit does not exist', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(useCase.execute('non-existent-unit'))
        .rejects
        .toBeInstanceOf(UnitNotFoundError);

      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should propagate any repository error', async () => {
      const testError = new Error('Storage error');
      mockRepository.findById = jest.fn().mockRejectedValue(testError);

      await expect(useCase.execute('unit-1')).rejects.toThrow(testError);
    });
  });
});

/**
 * Tests for ReorderTodosUseCase
 * BEA-24: Feature - Reorder unit todos via drag and drop
 */

import { ReorderTodosUseCase } from '../../../src/core/usecases/reorder-todos.usecase';
import { UnitRepository } from '../../../src/core/ports/unit.repository';
import { Unit } from '../../../src/core/entities/Unit';
import { Todo } from '../../../src/core/entities/Todo';
import { UnitNotFoundError, TodoNotFoundError } from '../../../src/core/errors';

describe('ReorderTodosUseCase', () => {
  let mockRepository: jest.Mocked<UnitRepository>;
  let useCase: ReorderTodosUseCase;

  const testUnit = new Unit(
    'unit-1',
    'Test Unit',
    'TU-001',
    'project-1',
    [
      new Todo('todo-1', 'First todo', 'TODO', 10),
      new Todo('todo-2', 'Second todo', 'TODO', 20),
      new Todo('todo-3', 'Third todo', 'DONE', 30),
    ]
  );

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByProjectIdAndCode: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new ReorderTodosUseCase(mockRepository);
  });

  describe('Success cases', () => {
    it('should reorder todos according to the provided order', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute('unit-1', [
        'todo-3',
        'todo-1',
        'todo-2',
      ]);

      expect(result.todos.map((t) => t.id)).toEqual([
        'todo-3',
        'todo-1',
        'todo-2',
      ]);
    });

    it('should recalculate the order field based on new position', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute('unit-1', [
        'todo-3',
        'todo-1',
        'todo-2',
      ]);

      expect(result.todos[0].order).toBe(0);
      expect(result.todos[1].order).toBe(10);
      expect(result.todos[2].order).toBe(20);
    });

    it('should preserve todo labels and statuses after reorder', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute('unit-1', [
        'todo-3',
        'todo-1',
        'todo-2',
      ]);

      expect(result.todos[0].id).toBe('todo-3');
      expect(result.todos[0].label).toBe('Third todo');
      expect(result.todos[0].status).toBe('DONE');
      expect(result.todos[1].id).toBe('todo-1');
      expect(result.todos[1].label).toBe('First todo');
      expect(result.todos[1].status).toBe('TODO');
    });

    it('should persist the reordered unit via repository', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      await useCase.execute('unit-1', ['todo-2', 'todo-1', 'todo-3']);

      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      const persistedUnit = mockRepository.update.mock.calls[0][0] as Unit;
      expect(persistedUnit.id).toBe('unit-1');
      expect(persistedUnit.todos.map((t) => t.id)).toEqual([
        'todo-2',
        'todo-1',
        'todo-3',
      ]);
    });

    it('should handle reordering a single todo', async () => {
      const singleTodoUnit = new Unit(
        'unit-2',
        'Single Unit',
        'SU-001',
        'project-1',
        [new Todo('todo-only', 'Only todo', 'TODO', 10)]
      );

      mockRepository.findById = jest.fn().mockResolvedValue(singleTodoUnit);
      mockRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute('unit-2', ['todo-only']);

      expect(result.todos.length).toBe(1);
      expect(result.todos[0].id).toBe('todo-only');
      expect(result.todos[0].order).toBe(0);
    });
  });

  describe('Error cases', () => {
    it('should throw UnitNotFoundError when unit does not exist', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(
        useCase.execute('non-existent-unit', ['todo-1', 'todo-2', 'todo-3'])
      ).rejects.toBeInstanceOf(UnitNotFoundError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw TodoNotFoundError when ordered ids do not match unit todos', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);

      await expect(
        useCase.execute('unit-1', ['todo-1', 'todo-2', 'non-existent-todo'])
      ).rejects.toBeInstanceOf(TodoNotFoundError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw TodoNotFoundError when an id is missing from the order', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(testUnit);

      await expect(
        useCase.execute('unit-1', ['todo-1', 'todo-2'])
      ).rejects.toBeInstanceOf(TodoNotFoundError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should propagate any repository error', async () => {
      const testError = new Error('Storage error');
      mockRepository.findById = jest.fn().mockRejectedValue(testError);

      await expect(
        useCase.execute('unit-1', ['todo-1', 'todo-2', 'todo-3'])
      ).rejects.toThrow(testError);
    });
  });
});

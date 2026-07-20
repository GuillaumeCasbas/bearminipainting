// DO NOT MODIFY: This is a template for TDD tests.
// Usage: Copy this file and fill in the placeholders.

import { USECASE_NAME } from '../../../src/core/usecases/USECASE_file';
import { PORT_NAME } from '../../../src/core/ports/PORT_file';
import { ENTITY_NAME } from '../../../src/core/entities/ENTITY_file';

describe('USECASE_NAME', () => {
  // Mock the repository
  const mockREPOSITORY: PORT_NAME = {
    // Mock all required methods
    findById: jest.fn(),
    findByCode: jest.fn(),
    save: jest.fn(),
    // Add other methods as needed
  };

  const useCase = new USECASE_NAME(mockREPOSITORY);

  describe('success cases', () => {
    it('should [describe expected behavior]', async () => {
      // Arrange
      mockREPOSITORY.findById.mockResolvedValue(new ENTITY_NAME('1', ...));
      mockREPOSITORY.save.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(...);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockREPOSITORY.save).toHaveBeenCalled();
    });
  });

  describe('error cases', () => {
    it('should throw an error if [condition]', async () => {
      // Arrange
      mockREPOSITORY.findByCode.mockResolvedValue(new ENTITY_NAME('1', ...));

      // Act & Assert
      await expect(useCase.execute(...))
        .rejects
        .toThrow('Error message');
    });
  });
});

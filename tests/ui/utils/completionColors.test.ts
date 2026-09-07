/**
 * Tests for completion rate color utilities
 * BEA-26: Fix - Completion rate bar et badge color
 */

import { getCompletionRateColor, getCompletionRateTextColor } from '../../../src/ui/utils/completionColors';

describe('getCompletionRateColor', () => {
  // Test cases for each color range according to BEA-26 requirements
  describe('Red color (< 20%)', () => {
    it('should return bg-red-500 for 0%', () => {
      expect(getCompletionRateColor(0)).toBe('bg-red-500');
    });

    it('should return bg-red-500 for 10%', () => {
      expect(getCompletionRateColor(10)).toBe('bg-red-500');
    });

    it('should return bg-red-500 for 19.99%', () => {
      expect(getCompletionRateColor(19.99)).toBe('bg-red-500');
    });

    it('should return bg-red-500 for exactly 19%', () => {
      expect(getCompletionRateColor(19)).toBe('bg-red-500');
    });
  });

  describe('Orange color (20% <= rate < 80%)', () => {
    it('should return bg-orange-500 for exactly 20%', () => {
      expect(getCompletionRateColor(20)).toBe('bg-orange-500');
    });

    it('should return bg-orange-500 for 50%', () => {
      expect(getCompletionRateColor(50)).toBe('bg-orange-500');
    });

    it('should return bg-orange-500 for 79.99%', () => {
      expect(getCompletionRateColor(79.99)).toBe('bg-orange-500');
    });

    it('should return bg-orange-500 for 79%', () => {
      expect(getCompletionRateColor(79)).toBe('bg-orange-500');
    });
  });

  describe('Yellow color (80% <= rate < 100%)', () => {
    it('should return bg-yellow-500 for exactly 80%', () => {
      expect(getCompletionRateColor(80)).toBe('bg-yellow-500');
    });

    it('should return bg-yellow-500 for 90%', () => {
      expect(getCompletionRateColor(90)).toBe('bg-yellow-500');
    });

    it('should return bg-yellow-500 for 99.99%', () => {
      expect(getCompletionRateColor(99.99)).toBe('bg-yellow-500');
    });

    it('should return bg-yellow-500 for 99%', () => {
      expect(getCompletionRateColor(99)).toBe('bg-yellow-500');
    });
  });

  describe('Green color (exactly 100%)', () => {
    it('should return bg-green-500 for exactly 100%', () => {
      expect(getCompletionRateColor(100)).toBe('bg-green-500');
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    it('should return bg-red-500 for negative values', () => {
      expect(getCompletionRateColor(-10)).toBe('bg-red-500');
    });

    it('should return bg-green-500 for values above 100%', () => {
      expect(getCompletionRateColor(101)).toBe('bg-green-500');
    });

    it('should return bg-green-500 for 200%', () => {
      expect(getCompletionRateColor(200)).toBe('bg-green-500');
    });
  });
});

describe('getCompletionRateTextColor', () => {
  describe('Text color for readability', () => {
    it('should return text-white for red background (< 20%)', () => {
      expect(getCompletionRateTextColor(10)).toBe('text-white');
    });

    it('should return text-white for orange background (20% - 80%)', () => {
      expect(getCompletionRateTextColor(50)).toBe('text-white');
    });

    it('should return text-gray-800 for yellow background (80% - 100%)', () => {
      expect(getCompletionRateTextColor(90)).toBe('text-gray-800');
    });

    it('should return text-white for green background (100%)', () => {
      expect(getCompletionRateTextColor(100)).toBe('text-white');
    });
  });
});

/**
 * Completion rate color utilities for MiniPaint application
 * 
 * Color rules (BEA-26):
 * - Red: rate < 20%
 * - Orange: 20% <= rate < 80%
 * - Yellow: 80% <= rate < 100%
 * - Green: rate = 100%
 */

import {
  COMPLETION_RATE_RED_THRESHOLD,
  COMPLETION_RATE_YELLOW_THRESHOLD,
  COMPLETION_RATE_GREEN_THRESHOLD,
} from '@/ui/constants';

/**
 * Returns the Tailwind CSS background color class for a given completion rate
 * @param rate - Completion rate as a percentage (0-100)
 * @returns Tailwind background color class string
 */
export const getCompletionRateColor = (rate: number): string => {
  if (rate < COMPLETION_RATE_RED_THRESHOLD) {
    return 'bg-red-500';
  }
  if (rate < COMPLETION_RATE_YELLOW_THRESHOLD) {
    return 'bg-orange-500';
  }
  if (rate < COMPLETION_RATE_GREEN_THRESHOLD) {
    return 'bg-yellow-500';
  }
  return 'bg-green-500';
};

/**
 * Returns the Tailwind CSS text color class for badge text based on completion rate
 * Used for badge text to ensure readability against background
 * @param rate - Completion rate as a percentage (0-100)
 * @returns Tailwind text color class string
 */
export const getCompletionRateTextColor = (rate: number): string => {
  if (rate < COMPLETION_RATE_RED_THRESHOLD) {
    return 'text-white';
  }
  if (rate < COMPLETION_RATE_YELLOW_THRESHOLD) {
    return 'text-white';
  }
  if (rate < COMPLETION_RATE_GREEN_THRESHOLD) {
    return 'text-gray-800';
  }
  return 'text-white';
};

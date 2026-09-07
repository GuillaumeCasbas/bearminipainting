/**
 * Shared UI constants for MiniPaint application
 */

// Completion rate thresholds for progress bar coloring
// Color rules (BEA-26):
// - Red: rate < 20%
// - Orange: 20% <= rate < 80%
// - Yellow: 80% <= rate < 100%
// - Green: rate = 100%
export const COMPLETION_RATE_RED_THRESHOLD = 20;
export const COMPLETION_RATE_YELLOW_THRESHOLD = 80;
export const COMPLETION_RATE_GREEN_THRESHOLD = 100;

/**
 * Timeline calculation utilities for animation and lasershow editors
 * Pure functions for timeline position corrections and range calculations
 */

/**
 * Corrects timeline position by subtracting the animation pattern start time
 * Ensures the result is never negative (returns 0 if negative)
 *
 * @param timelinePositionMs - Current timeline position in milliseconds
 * @param startTimeMs - Animation pattern start time in milliseconds
 * @returns Corrected timeline position (never negative)
 */
export const getCorrectedTimelinePosition = (
  timelinePositionMs: number,
  startTimeMs: number = 0,
): number => {
  const correctedPosition = timelinePositionMs - startTimeMs;
  if (correctedPosition < 0) {
    return 0;
  }
  return correctedPosition;
};

/**
 * Calculates the maximum range to draw on timeline based on current position and step size
 * Used to determine which portion of the timeline should be visible
 *
 * @param timelinePositionMs - Current timeline position in milliseconds
 * @param selectableStepSize - Size of each selectable step in milliseconds
 * @param multiplier - Multiplier for the step size (default: 10)
 * @returns Maximum range to draw in milliseconds
 */
export const calculateStepsToDrawMaxRange = (
  timelinePositionMs: number,
  selectableStepSize: number,
  multiplier: number = 10,
): number => {
  return (timelinePositionMs + selectableStepSize * multiplier) | 0;
};

/**
 * Calculates the corrected maximum draw range for animation patterns
 * Subtracts the pattern start time from the max range
 *
 * @param stepsToDrawMaxRange - Maximum range to draw
 * @param startTimeMs - Animation pattern start time
 * @returns Corrected max range for drawing
 */
export const getCorrectedMaxDrawRange = (
  stepsToDrawMaxRange: number,
  startTimeMs: number = 0,
): number => {
  return stepsToDrawMaxRange - startTimeMs;
};

/**
 * Determines if a position falls within a valid timeline range
 *
 * @param position - Position to check
 * @param minPosition - Minimum position in range
 * @param maxPosition - Maximum position in range
 * @returns True if position is within range
 */
export const isPositionInTimelineRange = (
  position: number,
  minPosition: number,
  maxPosition: number,
): boolean => {
  return position >= minPosition && position <= maxPosition;
};

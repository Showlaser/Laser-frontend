/**
 * Position mapping utilities for canvas coordinates and timeline positions
 * Pure functions for converting between pixel coordinates and logical positions
 */

/**
 * Maps X pixel position to the nearest step position using rounding
 * Used to snap mouse clicks to the nearest timeline step
 *
 * @param xPosition - X position in pixels
 * @param stepSize - Size of each selectable step
 * @returns Rounded position to nearest step
 */
export const mapXPositionToStepsXPosition = (xPosition: number, stepSize: number): number => {
  return Math.round(xPosition / stepSize) * stepSize;
};

/**
 * Maps a value from one range to another range
 * Useful for converting pixel coordinates to timeline values and vice versa
 *
 * @param value - Value to map
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns Mapped value in output range
 */
export const mapNumber = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
};

/**
 * Maps a Y pixel position to an animation property based on property positions
 * Used to determine which property the user clicked on
 *
 * @param yPosition - Y pixel position from mouse event
 * @param propertyPositions - Array of { property: string, yPosition: number }
 * @param tolerance - Pixel tolerance for clicking (default: 20)
 * @returns Property name if found, otherwise undefined
 */
export const mapYPositionToProperty = (
  yPosition: number,
  propertyPositions: Array<{ property: string; yPosition: number }>,
  tolerance: number = 20,
): string | undefined => {
  const foundProperty = propertyPositions.find((prop) =>
    isValueWithinTolerance(yPosition, prop.yPosition, tolerance),
  );
  return foundProperty?.property;
};

/**
 * Checks if a value is within a tolerance range of a target value
 *
 * @param value - Value to check
 * @param target - Target value
 * @param tolerance - Tolerance range (±)
 * @returns True if value is within tolerance of target
 */
export const isValueWithinTolerance = (
  value: number,
  target: number,
  tolerance: number,
): boolean => {
  return Math.abs(value - target) <= tolerance;
};

/**
 * Calculates canvas coordinates from a timeline value
 * Inverse of mapNumber, used for drawing at specific timeline positions
 *
 * @param timelineValue - Value on the timeline
 * @param canvasMin - Minimum canvas pixel value
 * @param canvasMax - Maximum canvas pixel value
 * @param timelineMin - Minimum timeline value
 * @param timelineMax - Maximum timeline value
 * @returns Pixel position on canvas
 */
export const mapTimelineToCanvasPosition = (
  timelineValue: number,
  canvasMin: number,
  canvasMax: number,
  timelineMin: number,
  timelineMax: number,
): number => {
  return mapNumber(timelineValue, timelineMin, timelineMax, canvasMin, canvasMax);
};

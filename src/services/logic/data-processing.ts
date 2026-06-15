/**
 * Data processing utilities for animations and lasershows
 * Pure functions for filtering and aggregating animation data
 */

import { numberIsBetweenOrEqual } from "services/shared/math";

/**
 * Filters animations that are active during a specific time
 * Checks if the given position falls within the animation's time range
 *
 * @param animations - Array of animations with startTimeMs and duration
 * @param positionMs - Current timeline position
 * @returns Array of animations that are active at the position
 */
export const getActiveAnimationsAtPosition = <T extends { startTimeMs: number; duration?: number }>(
  animations: T[],
  positionMs: number,
): T[] => {
  return animations.filter((animation) => {
    const startTime = animation.startTimeMs;
    const endTime = startTime + (animation.duration ?? 0);
    return numberIsBetweenOrEqual(positionMs, startTime, endTime);
  });
};

/**
 * Finds all items that match a property value
 * Used to find lasershows or patterns that use a specific item
 *
 * @param items - Array of items to search
 * @param predicate - Function to test each item
 * @returns Array of matching items
 */
export const filterItemsByPredicate = <T>(items: T[], predicate: (item: T) => boolean): T[] => {
  return items.filter(predicate);
};

/**
 * Aggregates values from multiple items into a single array
 * Useful for combining points from multiple animations
 *
 * @param items - Array of items
 * @param selector - Function to extract array from each item
 * @returns Single flattened array of all selected values
 */
export const aggregateArrays = <T, U>(items: T[], selector: (item: T) => U[]): U[] => {
  let result: U[] = [];
  for (let i = 0; i < items.length; i++) {
    const selected = selector(items[i]);
    result = result.concat(selected);
  }
  return result;
};

/**
 * Finds the first available time slot for a new item
 * Used to find empty space in timeline for new animations
 *
 * @param existingItems - Array of items with startTimeMs and duration
 * @param minimumGap - Minimum gap between items (default: 0)
 * @returns Suggested start time for new item
 */
export const findAvailableTimeSlot = <T extends { startTimeMs: number; duration?: number }>(
  existingItems: T[],
  minimumGap: number = 0,
): number => {
  if (existingItems.length === 0) {
    return 0;
  }

  // Sort by start time
  const sorted = [...existingItems].sort((a, b) => a.startTimeMs - b.startTimeMs);

  // Check if gap exists before first item
  if (sorted[0].startTimeMs > 0 && sorted[0].startTimeMs >= minimumGap) {
    return 0;
  }

  // Find first gap between items
  for (let i = 0; i < sorted.length - 1; i++) {
    const endTime = sorted[i].startTimeMs + (sorted[i].duration ?? 0);
    const nextStart = sorted[i + 1].startTimeMs;

    if (nextStart - endTime > minimumGap) {
      return endTime;
    }
  }

  // No gap found, place after last item
  const lastItem = sorted[sorted.length - 1];
  return lastItem.startTimeMs + (lastItem.duration ?? 0);
};

/**
 * Partitions an array based on a predicate
 * Returns two arrays: items that match and items that don't
 *
 * @param items - Array to partition
 * @param predicate - Function to determine partition
 * @returns Tuple of [matching, nonMatching] arrays
 */
export const partitionArray = <T>(items: T[], predicate: (item: T) => boolean): [T[], T[]] => {
  const matching: T[] = [];
  const nonMatching: T[] = [];

  items.forEach((item) => {
    if (predicate(item)) {
      matching.push(item);
    } else {
      nonMatching.push(item);
    }
  });

  return [matching, nonMatching];
};

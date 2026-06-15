/**
 * Array manipulation utilities for common list operations
 * Pure functions for array transformation and filtering
 */

/**
 * Toggles presence of an item in an array
 * If item exists, removes it; if not, adds it
 *
 * @param array - Array to toggle item in
 * @param item - Item to toggle
 * @returns New array with item toggled
 */
export const toggleItemInArray = <T>(array: T[], item: T): T[] => {
  const newArray = [...array];
  const index = newArray.indexOf(item);

  if (index === -1) {
    newArray.push(item);
  } else {
    newArray.splice(index, 1);
  }

  return newArray;
};

/**
 * Removes an item from an array by exact match
 *
 * @param array - Array to remove from
 * @param item - Item to remove
 * @returns New array without the item
 */
export const removeItemFromArray = <T>(array: T[], item: T): T[] => {
  return array.filter((x) => x !== item);
};

/**
 * Removes items that match a predicate function
 *
 * @param array - Array to remove from
 * @param predicate - Function that returns true for items to remove
 * @returns New array without matching items
 */
export const removeItemsByPredicate = <T>(array: T[], predicate: (item: T) => boolean): T[] => {
  return array.filter((item) => !predicate(item));
};

/**
 * Removes an item from an array by index
 *
 * @param array - Array to remove from
 * @param index - Index of item to remove
 * @returns New array without the item at index
 */
export const removeItemByIndex = <T>(array: T[], index: number): T[] => {
  const newArray = [...array];
  newArray.splice(index, 1);
  return newArray;
};

/**
 * Finds the index of first item matching a predicate
 *
 * @param array - Array to search
 * @param predicate - Function that returns true when item is found
 * @returns Index of first matching item, or -1 if not found
 */
export const findIndexByPredicate = <T>(array: T[], predicate: (item: T) => boolean): number => {
  return array.findIndex(predicate);
};

/**
 * Creates a deep copy of an array (one level deep for objects)
 *
 * @param array - Array to copy
 * @returns Shallow copy of the array
 */
export const copyArray = <T>(array: T[]): T[] => {
  return [...array];
};

/**
 * Deduplicates an array based on a key function
 *
 * @param array - Array to deduplicate
 * @param keyFn - Function that extracts unique key from item
 * @returns Array with duplicates removed
 */
export const deduplicateArray = <T>(array: T[], keyFn: (item: T) => any): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

import {
  aggregateArrays,
  filterItemsByPredicate,
  findAvailableTimeSlot,
  getActiveAnimationsAtPosition,
  partitionArray,
} from "services/logic/data-processing";

test(
  "Tested: getActiveAnimationsAtPosition:" +
    "Given animations with time ranges and position 500ms" +
    "When I execute the function," +
    "Then I expect the animation starting at 0ms with duration 1000ms to be returned",
  () => {
    const animations = [
      { startTimeMs: 0, duration: 1000 },
      { startTimeMs: 1000, duration: 500 },
      { startTimeMs: 2000, duration: 1500 },
    ];
    const result = getActiveAnimationsAtPosition(animations, 500);
    expect(result).toHaveLength(1);
    expect(result[0].startTimeMs).toBe(0);
  },
);

test(
  "Tested: getActiveAnimationsAtPosition:" +
    "Given animations and position 5000ms outside all time ranges" +
    "When I execute the function," +
    "Then I expect an empty array to be returned",
  () => {
    const animations = [
      { startTimeMs: 0, duration: 1000 },
      { startTimeMs: 1000, duration: 500 },
    ];
    const result = getActiveAnimationsAtPosition(animations, 5000);
    expect(result).toHaveLength(0);
  },
);

test(
  "Tested: getActiveAnimationsAtPosition:" +
    "Given position at exact start time of an animation" +
    "When I execute the function," +
    "Then I expect the animation to be included (inclusive boundaries)",
  () => {
    const animations = [{ startTimeMs: 0, duration: 1000 }];
    const result = getActiveAnimationsAtPosition(animations, 0);
    expect(result).toContainEqual({ startTimeMs: 0, duration: 1000 });
  },
);

test(
  "Tested: filterItemsByPredicate:" +
    "Given array [1, 2, 3, 4, 5] and predicate x > 2" +
    "When I execute the function," +
    "Then I expect the returned array to contain [3, 4, 5]",
  () => {
    const items = [1, 2, 3, 4, 5];
    const result = filterItemsByPredicate(items, (x) => x > 2);
    expect(result).toEqual([3, 4, 5]);
  },
);

test(
  "Tested: filterItemsByPredicate:" +
    "Given array of objects with active property" +
    "When I execute the function with object property filter," +
    "Then I expect only active items to be returned",
  () => {
    const items = [
      { id: 1, active: true },
      { id: 2, active: false },
      { id: 3, active: true },
    ];
    const result = filterItemsByPredicate(items, (x) => x.active);
    expect(result).toHaveLength(2);
  },
);

test(
  "Tested: filterItemsByPredicate:" +
    "Given array [1, 2, 3] and no items match predicate" +
    "When I execute the function," +
    "Then I expect an empty array to be returned",
  () => {
    const items = [1, 2, 3];
    const result = filterItemsByPredicate(items, (x) => x > 100);
    expect(result).toEqual([]);
  },
);

test(
  "Tested: aggregateArrays:" +
    "Given items with arrays to aggregate" +
    "When I execute the function," +
    "Then I expect a single flattened array containing all values",
  () => {
    const items = [
      { id: 1, values: [1, 2] },
      { id: 2, values: [3, 4] },
      { id: 3, values: [5] },
    ];
    const result = aggregateArrays(items, (item) => item.values);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  },
);

test(
  "Tested: aggregateArrays:" +
    "Given items with nested arrays" +
    "When I execute the function," +
    "Then I expect the order to be preserved",
  () => {
    const items = [{ letters: ["a", "b"] }, { letters: ["c"] }];
    const result = aggregateArrays(items, (item) => item.letters);
    expect(result).toEqual(["a", "b", "c"]);
  },
);

test(
  "Tested: aggregateArrays:" +
    "Given items with some having empty arrays" +
    "When I execute the function," +
    "Then I expect only non-empty values to appear in result",
  () => {
    const items = [{ values: [] }, { values: [1, 2] }];
    const result = aggregateArrays(items, (item) => item.values);
    expect(result).toEqual([1, 2]);
  },
);

test(
  "Tested: findAvailableTimeSlot:" +
    "Given empty list of items" +
    "When I execute the function," +
    "Then I expect the returned value to be 0 (start at beginning)",
  () => {
    const result = findAvailableTimeSlot([]);
    expect(result).toBe(0);
  },
);

test(
  "Tested: findAvailableTimeSlot:" +
    "Given first animation starts at 1000ms" +
    "When I execute the function," +
    "Then I expect available slot at 0 (gap before first item)",
  () => {
    const items = [{ startTimeMs: 1000, duration: 500 }];
    const result = findAvailableTimeSlot(items);
    expect(result).toBe(0);
  },
);

test(
  "Tested: findAvailableTimeSlot:" +
    "Given two animations with gap between them" +
    "When I execute the function," +
    "Then I expect available slot to be at end of first animation (1000ms)",
  () => {
    const items = [
      { startTimeMs: 0, duration: 1000 },
      { startTimeMs: 2000, duration: 500 },
    ];
    const result = findAvailableTimeSlot(items);
    expect(result).toBe(1000);
  },
);

test(
  "Tested: findAvailableTimeSlot:" +
    "Given animations with no gap between them" +
    "When I execute the function," +
    "Then I expect available slot at end of last animation (1500ms)",
  () => {
    const items = [
      { startTimeMs: 0, duration: 1000 },
      { startTimeMs: 1000, duration: 500 },
    ];
    const result = findAvailableTimeSlot(items);
    expect(result).toBe(1500);
  },
);

test(
  "Tested: findAvailableTimeSlot:" +
    "Given animations in unsorted order" +
    "When I execute the function," +
    "Then I expect items to be sorted before processing",
  () => {
    const items = [
      { startTimeMs: 2000, duration: 500 },
      { startTimeMs: 0, duration: 1000 },
    ];
    const result = findAvailableTimeSlot(items);
    expect(result).toBe(1000);
  },
);

test(
  "Tested: findAvailableTimeSlot:" +
    "Given minimum gap requirement of 500ms" +
    "When I execute the function with gap less than requirement," +
    "Then I expect slot to be placed after gap requirement is met",
  () => {
    const items = [
      { startTimeMs: 0, duration: 1000 },
      { startTimeMs: 1500, duration: 500 },
    ];
    const result = findAvailableTimeSlot(items, 500);
    expect(result).toBe(2000);
  },
);

test(
  "Tested: partitionArray:" +
    "Given array [1, 2, 3, 4, 5] and predicate x % 2 === 0" +
    "When I execute the function," +
    "Then I expect even numbers [2, 4] and odd numbers [1, 3, 5]",
  () => {
    const items = [1, 2, 3, 4, 5];
    const [even, odd] = partitionArray(items, (x) => x % 2 === 0);
    expect(even).toEqual([2, 4]);
    expect(odd).toEqual([1, 3, 5]);
  },
);

test(
  "Tested: partitionArray:" +
    "Given array of objects with active property" +
    "When I execute the function," +
    "Then I expect active and inactive items to be partitioned correctly",
  () => {
    const items = [
      { id: 1, active: true },
      { id: 2, active: false },
      { id: 3, active: true },
    ];
    const [active, inactive] = partitionArray(items, (x) => x.active);
    expect(active).toHaveLength(2);
    expect(inactive).toHaveLength(1);
  },
);

test(
  "Tested: partitionArray:" +
    "Given array where all items match predicate" +
    "When I execute the function," +
    "Then I expect all items in first partition and none in second",
  () => {
    const items = [1, 2, 3];
    const [matching, notMatching] = partitionArray(items, (x) => x > 0);
    expect(matching).toEqual([1, 2, 3]);
    expect(notMatching).toEqual([]);
  },
);

test(
  "Tested: partitionArray:" +
    "Given array where no items match predicate" +
    "When I execute the function," +
    "Then I expect empty first partition and all items in second",
  () => {
    const items = [1, 2, 3];
    const [matching, notMatching] = partitionArray(items, (x) => x > 100);
    expect(matching).toEqual([]);
    expect(notMatching).toEqual([1, 2, 3]);
  },
);

test(
  "Tested: partitionArray:" +
    "Given array [3, 1, 4, 1, 5, 9, 2, 6]" +
    "When I partition by even/odd," +
    "Then I expect order to be preserved in both partitions",
  () => {
    const items = [3, 1, 4, 1, 5, 9, 2, 6];
    const [even, odd] = partitionArray(items, (x) => x % 2 === 0);
    expect(even).toEqual([4, 2, 6]);
    expect(odd).toEqual([3, 1, 1, 5, 9]);
  },
);

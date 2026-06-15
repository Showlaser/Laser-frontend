import {
  copyArray,
  deduplicateArray,
  findIndexByPredicate,
  removeItemByIndex,
  removeItemFromArray,
  removeItemsByPredicate,
  toggleItemInArray,
} from "services/logic/array-utilities";

test(
  "Tested: toggleItemInArray:" +
    "Given array ['a', 'b'] and item 'c' not in array" +
    "When I execute the function," +
    "Then I expect the returned array to contain the item (add operation)",
  () => {
    const array = ["a", "b"];
    const result = toggleItemInArray(array, "c");
    expect(result).toEqual(["a", "b", "c"]);
  },
);

test(
  "Tested: toggleItemInArray:" +
    "Given array ['a', 'b', 'c'] and item 'b' in array" +
    "When I execute the function," +
    "Then I expect the returned array to not contain the item (remove operation)",
  () => {
    const array = ["a", "b", "c"];
    const result = toggleItemInArray(array, "b");
    expect(result).toEqual(["a", "c"]);
  },
);

test(
  "Tested: toggleItemInArray:" +
    "Given original array ['a', 'b']" +
    "When I execute the function," +
    "Then I expect the original array to remain unchanged (immutability)",
  () => {
    const array = ["a", "b"];
    const originalArray = [...array];
    toggleItemInArray(array, "c");
    expect(array).toEqual(originalArray);
  },
);

test(
  "Tested: removeItemFromArray:" +
    "Given array ['a', 'b', 'c'] and item 'b'" +
    "When I execute the function," +
    "Then I expect the returned array to not contain item 'b'",
  () => {
    const array = ["a", "b", "c"];
    const result = removeItemFromArray(array, "b");
    expect(result).toEqual(["a", "c"]);
  },
);

test(
  "Tested: removeItemFromArray:" +
    "Given array ['a', 'b', 'a', 'c'] with duplicates" +
    "When I execute the function," +
    "Then I expect all occurrences of the item to be removed",
  () => {
    const array = ["a", "b", "a", "c"];
    const result = removeItemFromArray(array, "a");
    expect(result).toEqual(["b", "c"]);
  },
);

test(
  "Tested: removeItemFromArray:" +
    "Given array ['a', 'b', 'c'] and item 'z' not in array" +
    "When I execute the function," +
    "Then I expect the array to remain unchanged",
  () => {
    const array = ["a", "b", "c"];
    const result = removeItemFromArray(array, "z");
    expect(result).toEqual(["a", "b", "c"]);
  },
);

test(
  "Tested: removeItemsByPredicate:" +
    "Given array [1, 2, 3, 4, 5] and predicate x > 3" +
    "When I execute the function," +
    "Then I expect array to contain only items 1, 2, 3",
  () => {
    const array = [1, 2, 3, 4, 5];
    const result = removeItemsByPredicate(array, (x) => x > 3);
    expect(result).toEqual([1, 2, 3]);
  },
);

test(
  "Tested: removeItemsByPredicate:" +
    "Given array of objects with active property" +
    "When I execute the function with complex predicate," +
    "Then I expect to remove objects where active is false",
  () => {
    const array = [
      { id: 1, active: true },
      { id: 2, active: false },
      { id: 3, active: true },
    ];
    const result = removeItemsByPredicate(array, (x) => x.active === false);
    expect(result).toHaveLength(2);
  },
);

test(
  "Tested: removeItemByIndex:" +
    "Given array ['a', 'b', 'c'] and index 1" +
    "When I execute the function," +
    "Then I expect element at index 1 ('b') to be removed",
  () => {
    const array = ["a", "b", "c"];
    const result = removeItemByIndex(array, 1);
    expect(result).toEqual(["a", "c"]);
  },
);

test(
  "Tested: removeItemByIndex:" +
    "Given array ['a', 'b', 'c'] and index 0" +
    "When I execute the function," +
    "Then I expect the first element to be removed",
  () => {
    const array = ["a", "b", "c"];
    const result = removeItemByIndex(array, 0);
    expect(result).toEqual(["b", "c"]);
  },
);

test(
  "Tested: removeItemByIndex:" +
    "Given array ['a', 'b', 'c'] and index 10 out of bounds" +
    "When I execute the function," +
    "Then I expect the array to remain unchanged",
  () => {
    const array = ["a", "b", "c"];
    const result = removeItemByIndex(array, 10);
    expect(result).toEqual(["a", "b", "c"]);
  },
);

test(
  "Tested: findIndexByPredicate:" +
    "Given array ['a', 'b', 'c'] and predicate x === 'b'" +
    "When I execute the function," +
    "Then I expect the returned index to be 1",
  () => {
    const array = ["a", "b", "c"];
    const result = findIndexByPredicate(array, (x) => x === "b");
    expect(result).toBe(1);
  },
);

test(
  "Tested: findIndexByPredicate:" +
    "Given array ['a', 'b', 'c'] and item 'z' not found" +
    "When I execute the function," +
    "Then I expect the returned value to be -1",
  () => {
    const array = ["a", "b", "c"];
    const result = findIndexByPredicate(array, (x) => x === "z");
    expect(result).toBe(-1);
  },
);

test(
  "Tested: findIndexByPredicate:" +
    "Given array [1, 2, 3, 2, 4] with duplicate value 2" +
    "When I execute the function," +
    "Then I expect the returned index to be the first occurrence (1)",
  () => {
    const array = [1, 2, 3, 2, 4];
    const result = findIndexByPredicate(array, (x) => x === 2);
    expect(result).toBe(1);
  },
);

test(
  "Tested: copyArray:" +
    "Given array ['a', 'b', 'c']" +
    "When I execute the function," +
    "Then I expect a new array instance with same values",
  () => {
    const array = ["a", "b", "c"];
    const result = copyArray(array);
    expect(result).toEqual(array);
    expect(result).not.toBe(array);
  },
);

test(
  "Tested: copyArray:" +
    "Given array [1, 2, 3]" +
    "When I execute the function," +
    "Then I expect the copy to have same contents but be a different instance",
  () => {
    const array = [1, 2, 3, 4, 5];
    const result = copyArray(array);
    expect(result).toEqual([1, 2, 3, 4, 5]);
    expect(result).not.toBe(array);
  },
);

test(
  "Tested: deduplicateArray:" +
    "Given array ['a', 'b', 'a', 'c', 'b'] with duplicates" +
    "When I execute the function with identity key function," +
    "Then I expect the returned array to contain only unique items",
  () => {
    const array = ["a", "b", "a", "c", "b"];
    const result = deduplicateArray(array, (x) => x);
    expect(result).toEqual(["a", "b", "c"]);
  },
);

test(
  "Tested: deduplicateArray:" +
    "Given array of objects with duplicate ids" +
    "When I execute the function with id key function," +
    "Then I expect to remove objects with duplicate ids",
  () => {
    const array = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 1, name: "Alice2" },
    ];
    const result = deduplicateArray(array, (x) => x.id);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  },
);

test(
  "Tested: deduplicateArray:" +
    "Given array [3, 1, 2, 1, 3]" +
    "When I execute the function," +
    "Then I expect the first occurrence order to be preserved",
  () => {
    const array = [3, 1, 2, 1, 3];
    const result = deduplicateArray(array, (x) => x);
    expect(result).toEqual([3, 1, 2]);
  },
);

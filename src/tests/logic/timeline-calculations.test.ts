import {
  calculateStepsToDrawMaxRange,
  getCorrectedMaxDrawRange,
  getCorrectedTimelinePosition,
  isPositionInTimelineRange,
} from "services/logic/timeline-calculations";

test(
  "Tested: getCorrectedTimelinePosition:" +
    "Given timeline position is 1500ms and start time is 1000ms" +
    "When I execute the function," +
    "Then I expect the returned value to be 500ms",
  () => {
    const result = getCorrectedTimelinePosition(1500, 1000);
    expect(result).toBe(500);
  },
);

test(
  "Tested: getCorrectedTimelinePosition:" +
    "Given timeline position is 500ms and start time is 1000ms" +
    "When I execute the function," +
    "Then I expect the returned value to be 0 (never negative)",
  () => {
    const result = getCorrectedTimelinePosition(500, 1000);
    expect(result).toBe(0);
  },
);

test(
  "Tested: getCorrectedTimelinePosition:" +
    "Given timeline position is 2000ms and start time is 0ms" +
    "When I execute the function," +
    "Then I expect the returned value to be 2000ms",
  () => {
    const result = getCorrectedTimelinePosition(2000, 0);
    expect(result).toBe(2000);
  },
);

test(
  "Tested: getCorrectedTimelinePosition:" +
    "Given no start time is provided (default 0)" +
    "When I execute the function with timeline position 1000ms," +
    "Then I expect the returned value to be 1000ms",
  () => {
    const result = getCorrectedTimelinePosition(1000);
    expect(result).toBe(1000);
  },
);

test(
  "Tested: getCorrectedTimelinePosition:" +
    "Given timeline position is -500ms and start time is 100ms" +
    "When I execute the function," +
    "Then I expect the returned value to be 0 (boundary clamping)",
  () => {
    const result = getCorrectedTimelinePosition(-500, 100);
    expect(result).toBe(0);
  },
);

test(
  "Tested: getCorrectedTimelinePosition:" +
    "Given timeline position equals start time (1000ms)" +
    "When I execute the function," +
    "Then I expect the returned value to be 0",
  () => {
    const result = getCorrectedTimelinePosition(1000, 1000);
    expect(result).toBe(0);
  },
);

test(
  "Tested: calculateStepsToDrawMaxRange:" +
    "Given timeline position is 1000ms and step size is 100ms with default multiplier 10" +
    "When I execute the function," +
    "Then I expect the returned value to be 2000ms",
  () => {
    const result = calculateStepsToDrawMaxRange(1000, 100);
    expect(result).toBe(2000);
  },
);

test(
  "Tested: calculateStepsToDrawMaxRange:" +
    "Given timeline position is 1000ms, step size is 100ms with custom multiplier 20" +
    "When I execute the function," +
    "Then I expect the returned value to be 3000ms",
  () => {
    const result = calculateStepsToDrawMaxRange(1000, 100, 20);
    expect(result).toBe(3000);
  },
);

test(
  "Tested: calculateStepsToDrawMaxRange:" +
    "Given timeline position is 0ms and step size is 100ms" +
    "When I execute the function," +
    "Then I expect the returned value to be 1000ms",
  () => {
    const result = calculateStepsToDrawMaxRange(0, 100);
    expect(result).toBe(1000);
  },
);

test(
  "Tested: calculateStepsToDrawMaxRange:" +
    "Given floating point values are provided" +
    "When I execute the function," +
    "Then I expect the returned value to be an integer",
  () => {
    const result = calculateStepsToDrawMaxRange(1000.5, 100.3);
    expect(Number.isInteger(result)).toBe(true);
  },
);

test(
  "Tested: getCorrectedMaxDrawRange:" +
    "Given max range is 3000ms and start time is 500ms" +
    "When I execute the function," +
    "Then I expect the returned value to be 2500ms",
  () => {
    const result = getCorrectedMaxDrawRange(3000, 500);
    expect(result).toBe(2500);
  },
);

test(
  "Tested: getCorrectedMaxDrawRange:" +
    "Given max range is 5000ms with no start time provided" +
    "When I execute the function," +
    "Then I expect the returned value to be 5000ms (default start time 0)",
  () => {
    const result = getCorrectedMaxDrawRange(5000);
    expect(result).toBe(5000);
  },
);

test(
  "Tested: getCorrectedMaxDrawRange:" +
    "Given max range equals start time (1000ms)" +
    "When I execute the function," +
    "Then I expect the returned value to be 0",
  () => {
    const result = getCorrectedMaxDrawRange(1000, 1000);
    expect(result).toBe(0);
  },
);

test(
  "Tested: getCorrectedMaxDrawRange:" +
    "Given max range is less than start time" +
    "When I execute the function," +
    "Then I expect the returned value to be negative",
  () => {
    const result = getCorrectedMaxDrawRange(500, 1000);
    expect(result).toBe(-500);
  },
);

test(
  "Tested: isPositionInTimelineRange:" +
    "Given position 500ms is within range 0-1000ms" +
    "When I execute the function," +
    "Then I expect the returned value to be true",
  () => {
    const result = isPositionInTimelineRange(500, 0, 1000);
    expect(result).toBe(true);
  },
);

test(
  "Tested: isPositionInTimelineRange:" +
    "Given position equals minimum boundary (0ms)" +
    "When I execute the function," +
    "Then I expect the returned value to be true (inclusive)",
  () => {
    const result = isPositionInTimelineRange(0, 0, 1000);
    expect(result).toBe(true);
  },
);

test(
  "Tested: isPositionInTimelineRange:" +
    "Given position equals maximum boundary (1000ms)" +
    "When I execute the function," +
    "Then I expect the returned value to be true (inclusive)",
  () => {
    const result = isPositionInTimelineRange(1000, 0, 1000);
    expect(result).toBe(true);
  },
);

test(
  "Tested: isPositionInTimelineRange:" +
    "Given position -100ms is below minimum 0ms" +
    "When I execute the function," +
    "Then I expect the returned value to be false",
  () => {
    const result = isPositionInTimelineRange(-100, 0, 1000);
    expect(result).toBe(false);
  },
);

test(
  "Tested: isPositionInTimelineRange:" +
    "Given position 1100ms is above maximum 1000ms" +
    "When I execute the function," +
    "Then I expect the returned value to be false",
  () => {
    const result = isPositionInTimelineRange(1100, 0, 1000);
    expect(result).toBe(false);
  },
);

test(
  "Tested: isPositionInTimelineRange:" +
    "Given negative range -1000ms to 0ms with position -500ms" +
    "When I execute the function," +
    "Then I expect the returned value to be true",
  () => {
    const result = isPositionInTimelineRange(-500, -1000, 0);
    expect(result).toBe(true);
  },
);

test(
  "Tested: isPositionInTimelineRange:" +
    "Given floating point values" +
    "When I execute the function," +
    "Then I expect the comparison to work correctly",
  () => {
    const result = isPositionInTimelineRange(500.5, 0, 1000);
    expect(result).toBe(true);
  },
);

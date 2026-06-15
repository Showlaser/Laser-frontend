import {
  isValueWithinTolerance,
  mapNumber,
  mapTimelineToCanvasPosition,
  mapXPositionToStepsXPosition,
  mapYPositionToProperty,
} from "services/logic/position-mapping";

test(
  "Tested: mapXPositionToStepsXPosition:" +
    "Given X position 125 and step size 100" +
    "When I execute the function," +
    "Then I expect the returned value to round to 100",
  () => {
    const result = mapXPositionToStepsXPosition(125, 100);
    expect(result).toBe(100);
  },
);

test(
  "Tested: mapXPositionToStepsXPosition:" +
    "Given X position 150 and step size 100" +
    "When I execute the function," +
    "Then I expect the returned value to round up to 200",
  () => {
    const result = mapXPositionToStepsXPosition(150, 100);
    expect(result).toBe(200);
  },
);

test(
  "Tested: mapXPositionToStepsXPosition:" +
    "Given X position 0 and step size 100" +
    "When I execute the function," +
    "Then I expect the returned value to be 0",
  () => {
    const result = mapXPositionToStepsXPosition(0, 100);
    expect(result).toBe(0);
  },
);

test(
  "Tested: mapXPositionToStepsXPosition:" +
    "Given X position 47 and step size 10" +
    "When I execute the function," +
    "Then I expect the returned value to round to nearest step (50)",
  () => {
    const result = mapXPositionToStepsXPosition(47, 10);
    expect(result).toBe(50);
  },
);

test(
  "Tested: mapNumber:" +
    "Given value 50 in input range 0-100 mapped to output range 0-200" +
    "When I execute the function," +
    "Then I expect the returned value to be 100 (proportional middle)",
  () => {
    const result = mapNumber(50, 0, 100, 0, 200);
    expect(result).toBe(100);
  },
);

test(
  "Tested: mapNumber:" +
    "Given value 0 at minimum input boundary" +
    "When I execute the function," +
    "Then I expect the returned value to be 0 at minimum output boundary",
  () => {
    const result = mapNumber(0, 0, 100, 0, 200);
    expect(result).toBe(0);
  },
);

test(
  "Tested: mapNumber:" +
    "Given value 100 at maximum input boundary" +
    "When I execute the function," +
    "Then I expect the returned value to be 200 at maximum output boundary",
  () => {
    const result = mapNumber(100, 0, 100, 0, 200);
    expect(result).toBe(200);
  },
);

test(
  "Tested: mapNumber:" +
    "Given pixel range 80-500 mapped to timeline 0-10000 at pixel 290" +
    "When I execute the function," +
    "Then I expect the returned value to be approximately 6579 (proportional position)",
  () => {
    const result = mapNumber(200, 0, 800, 0, 8000);
    expect(result).toBe(2000);
  },
);

test(
  "Tested: mapYPositionToProperty:" +
    "Given Y position 105 and property at Y 100 with tolerance 20" +
    "When I execute the function," +
    "Then I expect the returned property to be found",
  () => {
    const properties = [{ property: "scale", yPosition: 100 }];
    const result = mapYPositionToProperty(105, properties, 20);
    expect(result).toBe("scale");
  },
);

test(
  "Tested: mapYPositionToProperty:" +
    "Given Y position 500 outside all property positions with tolerance 20" +
    "When I execute the function," +
    "Then I expect the returned value to be undefined",
  () => {
    const properties = [
      { property: "scale", yPosition: 100 },
      { property: "xOffset", yPosition: 200 },
    ];
    const result = mapYPositionToProperty(500, properties, 20);
    expect(result).toBeUndefined();
  },
);

test(
  "Tested: mapYPositionToProperty:" +
    "Given Y position and default tolerance of 20" +
    "When I execute the function without specifying tolerance," +
    "Then I expect the default tolerance to be applied",
  () => {
    const properties = [{ property: "scale", yPosition: 100 }];
    const result = mapYPositionToProperty(115, properties);
    expect(result).toBe("scale");
  },
);

test(
  "Tested: mapYPositionToProperty:" +
    "Given multiple properties and Y position 200" +
    "When I execute the function," +
    "Then I expect the correct property to be identified",
  () => {
    const properties = [
      { property: "scale", yPosition: 100 },
      { property: "xOffset", yPosition: 200 },
      { property: "yOffset", yPosition: 300 },
    ];
    const result = mapYPositionToProperty(200, properties, 20);
    expect(result).toBe("xOffset");
  },
);

test(
  "Tested: isValueWithinTolerance:" +
    "Given value 100 equals target 100 with tolerance 10" +
    "When I execute the function," +
    "Then I expect the returned value to be true",
  () => {
    const result = isValueWithinTolerance(100, 100, 10);
    expect(result).toBe(true);
  },
);

test(
  "Tested: isValueWithinTolerance:" +
    "Given value 105 is within positive tolerance of 10" +
    "When I execute the function," +
    "Then I expect the returned value to be true",
  () => {
    const result = isValueWithinTolerance(105, 100, 10);
    expect(result).toBe(true);
  },
);

test(
  "Tested: isValueWithinTolerance:" +
    "Given value 95 is within negative tolerance of 10" +
    "When I execute the function," +
    "Then I expect the returned value to be true",
  () => {
    const result = isValueWithinTolerance(95, 100, 10);
    expect(result).toBe(true);
  },
);

test(
  "Tested: isValueWithinTolerance:" +
    "Given value 115 exceeds tolerance of 10" +
    "When I execute the function," +
    "Then I expect the returned value to be false",
  () => {
    const result = isValueWithinTolerance(115, 100, 10);
    expect(result).toBe(false);
  },
);

test(
  "Tested: isValueWithinTolerance:" +
    "Given value at exact tolerance boundary (110 with tolerance 10)" +
    "When I execute the function," +
    "Then I expect the returned value to be true (inclusive boundary)",
  () => {
    expect(isValueWithinTolerance(110, 100, 10)).toBe(true);
    expect(isValueWithinTolerance(90, 100, 10)).toBe(true);
  },
);

test(
  "Tested: mapTimelineToCanvasPosition:" +
    "Given timeline value 5000 in range 0-10000 to canvas range 80-500" +
    "When I execute the function," +
    "Then I expect the returned value to be approximately at canvas middle (290)",
  () => {
    const result = mapTimelineToCanvasPosition(5000, 80, 500, 0, 10000);
    expect(result).toBeCloseTo(290, 0);
  },
);

test(
  "Tested: mapTimelineToCanvasPosition:" +
    "Given timeline minimum value 0" +
    "When I execute the function," +
    "Then I expect the returned value to map to canvas minimum (80)",
  () => {
    const result = mapTimelineToCanvasPosition(0, 80, 500, 0, 10000);
    expect(result).toBe(80);
  },
);

test(
  "Tested: mapTimelineToCanvasPosition:" +
    "Given timeline maximum value 10000" +
    "When I execute the function," +
    "Then I expect the returned value to map to canvas maximum (500)",
  () => {
    const result = mapTimelineToCanvasPosition(10000, 80, 500, 0, 10000);
    expect(result).toBe(500);
  },
);

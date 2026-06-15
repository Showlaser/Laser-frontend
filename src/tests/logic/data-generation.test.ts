import {
  createTestGuid,
  generateFakeLogForLaser,
  getRandomNumber,
  randomProperty,
  subtractMinutesFromCurrentDate,
} from "services/logic/data-generation";

test(
  "Tested: randomProperty:" +
    "Given object { status1: 'Active', status2: 'Inactive', status3: 'Pending' }" +
    "When I execute the function," +
    "Then I expect the returned value to be one of the object values",
  () => {
    const testObj = { status1: "Active", status2: "Inactive", status3: "Pending" };
    const result = randomProperty(testObj);
    expect(["Active", "Inactive", "Pending"]).toContain(result);
  },
);

test(
  "Tested: randomProperty:" +
    "Given object with single property { onlyOne: 'value' }" +
    "When I execute the function," +
    "Then I expect the returned value to be that property value",
  () => {
    const testObj = { onlyOne: "value" };
    const result = randomProperty(testObj);
    expect(result).toBe("value");
  },
);

test(
  "Tested: randomProperty:" +
    "Given enum-like object { Healthy: 'HEALTHY', Warning: 'WARNING', Critical: 'CRITICAL' }" +
    "When I execute the function," +
    "Then I expect the returned value to be one of the enum values",
  () => {
    const LaserHealth = { Healthy: "HEALTHY", Warning: "WARNING", Critical: "CRITICAL" };
    const result = randomProperty(LaserHealth);
    expect(["HEALTHY", "WARNING", "CRITICAL"]).toContain(result);
  },
);

test(
  "Tested: generateFakeLogForLaser:" +
    "Given laser UUID and health enum" +
    "When I execute the function," +
    "Then I expect the returned array to have 4 entries (default timePoints)",
  () => {
    const mockHealthEnum = { Healthy: "HEALTHY", Warning: "WARNING" };
    const result = generateFakeLogForLaser("laser-1", mockHealthEnum);
    expect(result).toHaveLength(4);
  },
);

test(
  "Tested: generateFakeLogForLaser:" +
    "Given laser UUID 'test-laser-uuid'" +
    "When I execute the function," +
    "Then I expect all log entries to have the correct laser UUID",
  () => {
    const laserUuid = "test-laser-uuid";
    const mockHealthEnum = { Healthy: "HEALTHY", Warning: "WARNING" };
    const result = generateFakeLogForLaser(laserUuid, mockHealthEnum);
    result.forEach((log) => {
      expect(log.laserUuid).toBe(laserUuid);
    });
  },
);

test(
  "Tested: generateFakeLogForLaser:" +
    "Given health enum with valid values" +
    "When I execute the function," +
    "Then I expect all health values in logs to be from the enum",
  () => {
    const mockHealthEnum = { Healthy: "HEALTHY", Warning: "WARNING" };
    const result = generateFakeLogForLaser("laser-1", mockHealthEnum);
    result.forEach((log) => {
      expect(["HEALTHY", "WARNING"]).toContain(log.health);
    });
  },
);

test(
  "Tested: generateFakeLogForLaser:" +
    "Given temperature max of 65" +
    "When I execute the function," +
    "Then I expect all temperatures to be within range [0, 65)",
  () => {
    const mockHealthEnum = { Healthy: "HEALTHY", Warning: "WARNING" };
    const result = generateFakeLogForLaser("laser-1", mockHealthEnum, [0], 65);
    result.forEach((log) => {
      expect(log.temperature).toBeGreaterThanOrEqual(0);
      expect(log.temperature).toBeLessThan(65);
    });
  },
);

test(
  "Tested: generateFakeLogForLaser:" +
    "Given custom timePoints [60, 30, 0]" +
    "When I execute the function," +
    "Then I expect the returned array to have 3 entries",
  () => {
    const mockHealthEnum = { Healthy: "HEALTHY", Warning: "WARNING" };
    const customTimePoints = [60, 30, 0];
    const result = generateFakeLogForLaser("laser-1", mockHealthEnum, customTimePoints);
    expect(result).toHaveLength(3);
  },
);

test(
  "Tested: subtractMinutesFromCurrentDate:" +
    "Given 10 minutes to subtract" +
    "When I execute the function," +
    "Then I expect the returned date to be 10 minutes in the past",
  () => {
    const now = new Date();
    const result = subtractMinutesFromCurrentDate(10);
    const expectedTime = now.getTime() - 10 * 60000;
    expect(Math.abs(result.getTime() - expectedTime)).toBeLessThan(100);
  },
);

test(
  "Tested: subtractMinutesFromCurrentDate:" +
    "Given 0 minutes to subtract" +
    "When I execute the function," +
    "Then I expect the returned date to be very close to current time",
  () => {
    const result = subtractMinutesFromCurrentDate(0);
    const now = new Date();
    expect(Math.abs(result.getTime() - now.getTime())).toBeLessThan(100);
  },
);

test(
  "Tested: subtractMinutesFromCurrentDate:" +
    "Given result from the function" +
    "When I check the type," +
    "Then I expect it to be a Date object",
  () => {
    const result = subtractMinutesFromCurrentDate(5);
    expect(result instanceof Date).toBe(true);
  },
);

test(
  "Tested: getRandomNumber:" +
    "Given max value of 65" +
    "When I execute the function multiple times," +
    "Then I expect all returned values to be in range [0, 65)",
  () => {
    for (let i = 0; i < 100; i++) {
      const result = getRandomNumber(65);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(65);
    }
  },
);

test(
  "Tested: getRandomNumber:" +
    "Given max value of 100" +
    "When I execute the function," +
    "Then I expect the returned value to be an integer",
  () => {
    const result = getRandomNumber(100);
    expect(Number.isInteger(result)).toBe(true);
  },
);

test(
  "Tested: getRandomNumber:" +
    "Given max value of 1" +
    "When I execute the function," +
    "Then I expect the only possible return value to be 0",
  () => {
    const result = getRandomNumber(1);
    expect(result).toBe(0);
  },
);

test(
  "Tested: createTestGuid:" +
    "When I execute the function," +
    "Then I expect the returned value to be a string",
  () => {
    const result = createTestGuid();
    expect(typeof result).toBe("string");
  },
);

test(
  "Tested: createTestGuid:" +
    "When I execute the function multiple times," +
    "Then I expect each returned value to be different",
  () => {
    const guid1 = createTestGuid();
    const guid2 = createTestGuid();
    expect(guid1).not.toBe(guid2);
  },
);

test(
  "Tested: createTestGuid:" +
    "Given returned GUID from the function" +
    "When I split by hyphen," +
    "Then I expect it to have UUID-like format with 4 parts",
  () => {
    const result = createTestGuid();
    const parts = result.split("-");
    expect(parts.length).toBe(4);
  },
);

test(
  "Tested: createTestGuid:" +
    "Given returned GUID from the function" +
    "When I check the characters," +
    "Then I expect it to only contain alphanumeric characters and hyphens",
  () => {
    const result = createTestGuid();
    expect(/^[a-z0-9-]+$/.test(result)).toBe(true);
  },
);

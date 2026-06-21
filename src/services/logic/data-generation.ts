/**
 * Data generation utilities for test data and fake content
 * Pure functions for generating consistent test data
 */

/**
 * Selects a random property value from an object
 * Used to randomly select enum-like values from an object
 *
 * @param obj - Object to select a random value from
 * @returns Random value from the object
 */
export const randomProperty = <T>(obj: Record<string, T>): T => {
  const keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

/**
 * Generates fake laser log entries with timestamps and status
 * Used for testing and demo purposes
 *
 * @param laserUuid - UUID of the laser
 * @param laserHealthEnum - Enum or object with laser health statuses
 * @param timePoints - Array of minutes in the past for log entries (default: [30, 20, 10, 0])
 * @returns Array of fake laser log entries
 */
export interface LaserLogEntry {
  laserUuid: string;
  dateTime: Date;
  temperature: number;
  health: string;
}

export const generateFakeLogForLaser = (
  laserUuid: string,
  laserHealthEnum: Record<string, string>,
  timePoints: number[] = [30, 20, 10, 0],
  temperatureMax: number = 65,
): LaserLogEntry[] => {
  return timePoints.map((minutesAgo) => ({
    laserUuid,
    dateTime: subtractMinutesFromCurrentDate(minutesAgo),
    temperature: Math.floor(Math.random() * temperatureMax),
    health: randomProperty(laserHealthEnum),
  }));
};

/**
 * Subtracts minutes from the current date
 * Helper function for generating past timestamps
 *
 * @param minutes - Number of minutes to subtract
 * @returns Date object representing time in the past
 */
export const subtractMinutesFromCurrentDate = (minutes: number): Date => {
  const now = new Date();
  return new Date(now.getTime() - minutes * 60000);
};

/**
 * Generates a random integer between 0 and max
 *
 * @param max - Maximum value (exclusive)
 * @returns Random integer
 */
export const getRandomNumber = (max: number): number => {
  return Math.floor(Math.random() * max);
};

/**
 * Generates a UUID-like string for testing
 * Note: This is not cryptographically secure, use for testing only
 *
 * @returns Random UUID-like string
 */
export const createTestGuid = (): string => {
  return `${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
};

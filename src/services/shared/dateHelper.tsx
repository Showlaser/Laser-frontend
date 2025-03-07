export const subtractMinutesFromCurrentDate = (minutesToSubtract: number) =>
  new Date(Date.now() - minutesToSubtract * 60000);

// MIN = Minimum expected value
// MAX = Maximium expected value
// Function to normalise the values (MIN / MAX could be integrated)
export const normalise = (value, min, max) =>
  ((value - min) * 100) / (max - min);

export const mapNumber = (number, inMin, inMax, outMin, outMax) => {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const createGuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const emptyGuid = () => "00000000-0000-0000-0000-000000000000";

export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const convertToMilliWatts = (maxPower, currentValue) =>
  Math.round((maxPower / 511) * currentValue);

export const valueIsWithinBoundaries = (value, min, max) =>
  value <= max && value >= min;

export const numberIsBetweenOrEqual = (number, min, max) => {
  return number >= min && number <= max;
};

export const rotatePoint = (point, angle) => {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * point.x + sin * point.y,
    ny = cos * point.y - sin * point.x;

  point.x = nx;
  point.y = ny;
  return point;
};

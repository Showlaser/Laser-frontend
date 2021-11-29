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
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const convertToMilliWatts = (maxPower, currentValue) =>
  Math.round((maxPower / 511) * currentValue);

export const valueIsWithinBoundaries = (value, min, max) =>
  value <= max && value >= min;

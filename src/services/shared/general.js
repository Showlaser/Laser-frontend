import { mapNumber } from "./math";

export function stringIsEmpty(str) {
  return str === undefined || str === "" || str === null;
}

export function getMappedRgbStringFromPoint(point) {
  const { redLaserPowerPwm, greenLaserPowerPwm, blueLaserPowerPwm } = point;
  return `rgb(${mapNumber(redLaserPowerPwm, 0, 511, 0, 255)},${mapNumber(
    greenLaserPowerPwm,
    0,
    511,
    0,
    255
  )},${mapNumber(blueLaserPowerPwm, 0, 511, 0, 255)})`;
}

export function getFormDataObject(event) {
  const formData = new FormData(event.target);
  var object = {};
  formData.forEach(function (value, key) {
    object[key] = value;
  });
  return object;
}

export const getDifferenceBetweenTwoDatesInMinutesAndSecondsString = (
  expirationDate,
  dateNow
) => {
  const difference = expirationDate.getTime() - dateNow.getTime();
  if (difference <= 0) {
    return "Voting ended!";
  } else {
    let seconds = Math.floor(difference / 1000);
    let minutes = Math.floor(seconds / 60);

    minutes %= 60;
    seconds %= 60;

    return `${minutes < 10 ? "0" : ""}${minutes} : ${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }
};

export function toCamelCase(key, value) {
  if (value && typeof value === "object") {
    for (var k in value) {
      if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
        value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
        delete value[k];
      }
    }
  }
  return value;
}

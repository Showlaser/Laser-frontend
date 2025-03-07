import { Point } from "models/components/shared/point";

export function stringIsEmpty(str: string | null | undefined) {
  return str === undefined || str === "" || str === null;
}

export function getRgbStringFromPoint(point: Point) {
  const { redLaserPowerPwm, greenLaserPowerPwm, blueLaserPowerPwm } = point;
  return `rgb(${redLaserPowerPwm},${greenLaserPowerPwm},${blueLaserPowerPwm})`;
}

export function getFormDataObject(event: any) {
  if (event === undefined || event === null) {
    return;
  }

  const formData = new FormData(event.target);
  let object: any = {};
  formData.forEach(function (value, key) {
    object[key] = value;
  });
  return object;
}

export const getDifferenceBetweenTwoDatesInMinutesAndSecondsString = (
  expirationDate: Date,
  dateNow: Date
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

export function toCamelCase(key: any, value: any) {
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

// function to obtain a single code in the url
export const getUrlCode = () => {
  const urlData = window.location.search;
  const indexOfData = urlData.indexOf("=");
  return urlData.substring(indexOfData + 1, urlData.length);
};

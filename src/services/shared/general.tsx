import type { FormEvent } from "react";
import { Point } from "models/components/shared/point";

export function stringIsEmpty(str: string | null | undefined) {
  return str === undefined || str === "" || str === null;
}

export function getRgbStringFromPoint(point: Point) {
  const { redLaserPowerPwm, greenLaserPowerPwm, blueLaserPowerPwm } = point;
  return `rgb(${redLaserPowerPwm},${greenLaserPowerPwm},${blueLaserPowerPwm})`;
}

export function getFormDataObject(event: FormEvent) {
  if (event === undefined || event === null) {
    return;
  }

  const formData = new FormData(event.target as HTMLFormElement);
  const object: Record<string, FormDataEntryValue> = {};
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

export function toCamelCase(key: string, value: unknown) {
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const k in obj) {
      if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(obj, k)) {
        obj[k.charAt(0).toLowerCase() + k.substring(1)] = obj[k];
        delete obj[k];
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

import { Point } from "models/components/shared/point";

export const rgbColorStringFromPoint = (point: Point): string =>
  `rgb(${point.redLaserPowerPwm},${point.greenLaserPowerPwm},${point.blueLaserPowerPwm})`;

const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result === null) {
    throw new Error("Invalid hex supplied");
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

export const setLaserPowerFromHexString = (hex: string, point: Point): Point => {
  const rgb = hexToRgb(hex);
  point.redLaserPowerPwm = rgb?.r;
  point.greenLaserPowerPwm = rgb?.g;
  point.blueLaserPowerPwm = rgb?.b;
  return point;
};

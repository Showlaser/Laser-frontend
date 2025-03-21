import { canvasPxSize } from "services/shared/config";
import {
  applyParametersToPointsForCanvasByPattern,
  convertAnimationToLasershowAnimation,
  convertPatternToAnimation,
  convertPatternToAnimationPattern,
  getHexColorStringFromPoint,
  getRgbColorStringFromPoint,
  setLaserPowerFromHexString,
} from "services/shared/converters";
import { numberIsBetweenOrEqual } from "services/shared/math";
import { testAnimation, testPattern } from "tests/helper";

test(
  "Tested: getRgbColorStringFromPoint:" +
    "Given The point provided contains rgb values 255, 0, 255," +
    "When I execute the function," +
    "Then I expect the hex string to be rgb(255,0,255)",
  () => {
    const testPoint = testPattern.points[0];
    const hexString = getRgbColorStringFromPoint(testPoint);

    expect(hexString).toBe("rgb(255,0,255)");
  }
);

test(
  "Tested: getHexColorStringFromPoint:" +
    "Given The point provided contains rgb values 255, 0, 255," +
    "When I execute the function," +
    "Then I expect the hex string to be #ff00ff",
  () => {
    const testPoint = testPattern.points[0];
    const hexString = getHexColorStringFromPoint(testPoint);

    expect(hexString).toBe("#ff00ff");
  }
);

test(
  "Tested: setLaserPowerFromHexString:" +
    "Given that I provide hex value #ff00ff and a point" +
    "When I execute the function," +
    "Then I expect the returned point redLaserPowerPwm value to be 255, greenLaserPowerPwm to be 0 and blueLaserPowerPwm to be 255",
  () => {
    const testPoint = testPattern.points[0];
    const returnedPoint = setLaserPowerFromHexString("#ff00ff", testPoint);

    expect(returnedPoint.redLaserPowerPwm).toBe(255);
    expect(returnedPoint.greenLaserPowerPwm).toBe(0);
    expect(returnedPoint.blueLaserPowerPwm).toBe(255);
  }
);

test(
  "Tested: convertPatternToAnimation:" +
    "Given that I provide a pattern as parameter" +
    "When I execute the function," +
    "Then I expect a animation with information from the pattern",
  () => {
    const animation = convertPatternToAnimation(testPattern);

    expect(animation.uuid.length).toBeGreaterThan(10);
    expect(animation.name).toBe(testPattern.name);
    expect(animation.image).toBe(testPattern.image);
    expect(animation.animationPatterns[0].animationUuid).toBe(animation.uuid);
    expect(animation.animationPatterns[0].name.length).toBeGreaterThan(5);
    expect(animation.animationPatterns[0].uuid.length).toBeGreaterThan(5);
  }
);

test(
  "Tested: convertAnimationToLasershowAnimation:" +
    "Given that I provide a animation as parameter" +
    "When I execute the function," +
    "Then I expect a lasershowAnimation with information from the animation",
  () => {
    const animation = testAnimation(0, [0], 100);
    const lasershow = convertAnimationToLasershowAnimation(
      animation,
      "b65e77aa-ff6f-45b6-bc7e-8b58ca38c7b2"
    );

    expect(lasershow.uuid.length).toBeGreaterThan(5);
    expect(lasershow.name.length).toBeGreaterThan(5);
    expect(lasershow.animation).toBe(animation);
    expect(lasershow.animationUuid.length).toBeGreaterThan(5);
    expect(lasershow.lasershowUuid).toBe("b65e77aa-ff6f-45b6-bc7e-8b58ca38c7b2");
  }
);

test(
  "Tested: convertPatternToAnimationPattern:" +
    "Given that I provide a pattern as parameter" +
    "When I execute the function," +
    "Then I expect a animationPattern with information from the pattern",
  () => {
    const animationPattern = convertPatternToAnimationPattern(
      testPattern,
      testAnimation(0, [0], 100)
    );

    expect(animationPattern.uuid.length).toBeGreaterThan(5);
    expect(animationPattern.name.length).toBeGreaterThan(5);
    expect(animationPattern.pattern).toBe(testPattern);
    expect(animationPattern.animationUuid.length).toBeGreaterThan(5);
    expect(animationPattern.patternUuid).toBe(testPattern.uuid);
    expect(animationPattern.animationPatternKeyFrames.length).toBeGreaterThan(0);
  }
);

test(
  "Tested: applyParametersToPointsForCanvasByPattern:" +
    "Given that I provide a pattern as parameter" +
    "When I execute the function," +
    "Then I expect the parameters from the pattern to be adapted to fit in the canvas",
  () => {
    const canvasPoints = applyParametersToPointsForCanvasByPattern(testPattern);

    expect(canvasPoints[0].orderNr).toBe(0);
    expect(canvasPoints[2].orderNr).toBe(2);
    expect(numberIsBetweenOrEqual(canvasPoints[2].x, 0, canvasPxSize)).toBeTruthy();
    expect(numberIsBetweenOrEqual(canvasPoints[2].y, 0, canvasPxSize)).toBeTruthy();
  }
);

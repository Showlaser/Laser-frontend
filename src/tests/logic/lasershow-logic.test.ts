import { Lasershow } from "models/components/shared/lasershow";
import { getLasershowAnimationsToDrawInTimeline, getLasershowDuration } from "services/logic/lasershow-logic";
import { testLasershow } from "tests/helper";

describe("lasershow-logic", () => {
  describe("getLasershowDuration", () => {
    const dataSet = [
      { lasershow: testLasershow(0, 100), expectedDuration: 100 },
      { lasershow: testLasershow(0, 1000), expectedDuration: 1000 },
      { lasershow: testLasershow(10, 100), expectedDuration: 110 },
      { lasershow: testLasershow(50, 100), expectedDuration: 150 },
    ];

    it.each(dataSet)(
      "Returned duration should match the expectedDuration",
      (data: { lasershow: Lasershow; expectedDuration: number }) => {
        const duration = getLasershowDuration(data.lasershow);
        expect(duration).toBe(data.expectedDuration);
      }
    );
  });
});

describe("lasershow-logic", () => {
  describe("getLasershowAnimationsToDrawInTimeline", () => {
    const dataSet = [
      { lasershow: testLasershow(0, 100), tlPos: 0, stdmr: 100, expectedAnimationsCount: 1 },
      { lasershow: testLasershow(200, 100), tlPos: 0, stdmr: 100, expectedAnimationsCount: 0 },
      { lasershow: testLasershow(0, 1000), tlPos: 0, stdmr: 100, expectedAnimationsCount: 1 },
      { lasershow: testLasershow(101, 100), tlPos: 0, stdmr: 100, expectedAnimationsCount: 0 },
    ];

    it.each(dataSet)(
      "Returned duration should match the expectedDuration",
      (data: { lasershow: Lasershow; tlPos: number; stdmr: number; expectedAnimationsCount: number }) => {
        const animations = getLasershowAnimationsToDrawInTimeline(data.lasershow, data.tlPos, data.stdmr);
        expect(animations?.length).toBe(data.expectedAnimationsCount);
      }
    );
  });
});

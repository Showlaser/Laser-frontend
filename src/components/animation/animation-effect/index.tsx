import { Button, FormControl, FormLabel, Grid, Input, MenuItem, Select, Slider } from "@mui/material";
import SelectList from "components/select-list";
import PointsDrawer from "components/shared/points-drawer";
import { Animation, AnimationEffects } from "models/components/shared/animation";
import { Point } from "models/components/shared/point";
import React from "react";
import { createGuid, rotatePoint } from "services/shared/math";

type Props = {
  animation: Animation | null;
};

export function AnimationEffectEditor({ animation }: Props) {
  const applySettingsToPoints = (dotsToDraw: Point[] | undefined | null) => {
    if (animation === null || dotsToDraw === null || dotsToDraw === undefined) {
      return null;
    }

    const dotsToDrawLength = dotsToDraw.length;
    let updatedPoints: Point[] = [];
    for (let index = 0; index < dotsToDrawLength; index++) {
      let rotatedPoint: Point = rotatePoint(
        { ...dotsToDraw[index] },
        animation.pattern.rotation,
        animation.pattern.xOffset,
        animation.pattern.yOffset
      );

      rotatedPoint.x += animation.pattern.xOffset;
      rotatedPoint.y += animation.pattern.yOffset;
      rotatedPoint.x *= animation.pattern.scale;
      rotatedPoint.y *= animation.pattern.scale;
      updatedPoints.push(rotatedPoint);
    }
    return updatedPoints;
  };

  const pointsToDraw = applySettingsToPoints(animation?.pattern?.points);

  return (
    <Grid container spacing={3} style={{ width: "50%" }}>
      <Grid item style={{ width: "100%" }}>
        <FormControl style={{ width: "100%", marginBottom: "10px" }}>
          <small>Add effect to animation</small>
          <Select label="Age">
            {Object.keys(AnimationEffects)
              .filter((v) => isNaN(Number(v)))
              .map((effect) => (
                <MenuItem value={effect}>{effect}</MenuItem>
              ))}
          </Select>
          <SelectList items={[{ uuid: createGuid(), name: "test" }]} disabled={false} onSelect={() => null} />
        </FormControl>
        <FormLabel htmlFor="svg-points">
          X offset
          <Button
            style={{ marginLeft: "10px" }}
            onClick={() => (window.confirm("Are you sure you want to reset this value?") ? null : null)}
          >
            Reset
          </Button>
        </FormLabel>
        <br />
        <Input type="number" />
        <br />
        <FormControl style={{ width: "100%" }}>
          <Slider id="svg-points" size="small" aria-label="Small" valueLabelDisplay="auto" />
        </FormControl>
      </Grid>
      <PointsDrawer pointsToDraw={pointsToDraw} />
    </Grid>
  );
}

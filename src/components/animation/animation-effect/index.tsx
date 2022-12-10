import { Button, FormControl, FormLabel, Grid, Input, MenuItem, Select, Slider } from "@mui/material";
import SelectList from "components/select-list";
import PointsDrawer from "components/shared/points-drawer";
import { Animation, AnimationEffects } from "models/components/shared/animation";
import React from "react";
import { applyParametersToPointsForCanvasByPattern } from "services/shared/converters";
import { createGuid } from "services/shared/math";

type Props = {
  animation: Animation;
};

export function AnimationEffectEditor({ animation }: Props) {
  const pointsToDraw = applyParametersToPointsForCanvasByPattern(animation.pattern);

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

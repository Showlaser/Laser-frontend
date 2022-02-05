import { Button, MenuItem, Select, TextField } from "@material-ui/core";
import PointsForm from "components/shared/point-form";
import { useEffect } from "react";

export default function AnimationSettings(props) {
  const {
    updateAnimationSetting,
    selectedPatternAnimation,
    timeLineCurrentMs,
    updatePatternAnimation,
    deletePatternAnimation,
  } = props;

  const settings =
    selectedPatternAnimation !== undefined
      ? selectedPatternAnimation.animationSettings.find(
          (ase) => ase.startTime === timeLineCurrentMs
        )
      : undefined;

  useEffect(() => [selectedPatternAnimation]);

  const duration =
    selectedPatternAnimation?.animationSettings?.at(-1)?.startTime -
    selectedPatternAnimation?.animationSettings[0]?.startTime;

  return (
    <div
      id="animation-settings"
      key={selectedPatternAnimation.uuid + "settings"}
    >
      <TextField
        label="Pattern animation name"
        defaultValue={selectedPatternAnimation?.name ?? ""}
        onChange={(e) => updatePatternAnimation("name", e.target.value)}
      />
      <TextField
        defaultValue={selectedPatternAnimation?.startTimeOffset}
        label="Start time ms"
        onChange={(e) =>
          updatePatternAnimation("startTimeOffset", e.target.value)
        }
        type="number"
      />
      <br />
      <label>Duration time ms</label>
      <br />
      {duration}
      <br />
      Timeline
      <br />
      <Select
        onChange={(e) => updatePatternAnimation("timelineId", e.target.value)}
        value={selectedPatternAnimation?.timelineId ?? 1}
      >
        <MenuItem value={0}>0</MenuItem>
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
      </Select>
      <br />
      <Button onClick={() => deletePatternAnimation(settings?.uuid)}>
        Delete pattern animation
      </Button>
      <hr />
      <label>Animation points</label>
      <br />
      <TextField
        defaultValue={settings?.scale}
        label="Scale"
        type="number"
        inputProps={{
          step: "0.1",
          min: 0.1,
          max: 1,
        }}
      />
      <br />
      <TextField
        label="X position"
        type="number"
        inputProps={{
          min: -4000,
          max: 4000,
        }}
        defaultValue={settings?.centerX}
      />
      <TextField
        label="Y position"
        type="number"
        inputProps={{
          min: -4000,
          max: 4000,
        }}
        defaultValue={settings?.centerY}
      />
      <br />
      <PointsForm
        namePlaceHolder="Animation name"
        item={settings}
        onChange={(points) => updateAnimationSetting("points", points)}
      />
    </div>
  );
}

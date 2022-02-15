import {
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import PointsForm from "components/shared/point-form";
import { useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

export default function AnimationSettings(props) {
  const {
    updateAnimationSetting,
    selectedPatternAnimation,
    timeLineCurrentMs,
    updatePatternAnimation,
    deletePatternAnimation,
  } = props;

  const setting =
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
        onChange={(e) => {
          if (e.target.value >= 0) {
            updatePatternAnimation("startTimeOffset", e.target.value);
          }
        }}
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
      <Button onClick={deletePatternAnimation}>Delete pattern animation</Button>
      <hr />
      <label>Animation points</label>
      <br />
      <TextField
        value={setting?.scale}
        label="Scale"
        type="number"
        onChange={(e) => updateAnimationSetting("scale", e.target.value)}
        inputProps={{
          step: "0.1",
          min: 0.1,
          max: 1,
        }}
      />
      <br />
      <TextField
        label="Center x"
        type="number"
        inputProps={{
          min: -4000,
          max: 4000,
        }}
        value={setting?.centerX}
        onChange={(e) => updateAnimationSetting("centerX", e.target.value)}
      />
      <TextField
        label="Center y"
        type="number"
        inputProps={{
          min: -4000,
          max: 4000,
        }}
        value={setting?.centerY}
        onChange={(e) => updateAnimationSetting("centerY", e.target.value)}
      />
      <br />
      <IconButton
        disabled={setting !== undefined}
        onClick={() => updateAnimationSetting("animationSettings", [])}
      >
        <AddIcon />
      </IconButton>
      <IconButton
        disabled={
          setting === undefined ||
          selectedPatternAnimation?.animationSettings?.length === 1
        }
        onClick={() => {
          let settings = [...selectedPatternAnimation?.animationSettings];
          const index = settings.findIndex((s) => s.uuid === setting.uuid);
          if (index === -1) {
            return;
          }

          settings.splice(index, 1);
          updatePatternAnimation("animationSettings", settings);
        }}
      >
        <DeleteIcon />
      </IconButton>
      <br />
      <PointsForm
        namePlaceHolder="Animation name"
        item={setting}
        onChange={(points) => updateAnimationSetting("points", points)}
      />
    </div>
  );
}

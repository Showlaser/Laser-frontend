import {
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Divider,
} from "@mui/material";
import PointsForm from "components/shared/point-form";
import { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { showError, toastSubject } from "services/shared/toast-messages";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function AnimationSettings({
  duplicatePatternAnimation,
  updateAnimationSetting,
  selectedPatternAnimation,
  updatePatternAnimation,
  deletePatternAnimation,
  selectedSetting,
  setTimeLineCurrentMs,
}) {
  useEffect(() => [selectedPatternAnimation, selectedSetting]);

  if (selectedSetting !== undefined) {
    selectedSetting.points = selectedSetting?.points?.sort((a, b) =>
      a > b ? 1 : -1
    );
  }

  const duration = Math.abs(
    selectedPatternAnimation?.animationSettings?.at(-1)?.startTime -
      selectedPatternAnimation?.animationSettings[0]?.startTime
  );

  const validateStartTime = (startTime) => {
    const lowerThanStartTime = selectedPatternAnimation.animationSettings
      .filter((ast) => ast.startTime < selectedSetting.startTime)
      .sort((a, b) => (a.startTime < b.startTime ? -1 : 1))
      .reverse();

    const largerThanStartTime = selectedPatternAnimation.animationSettings
      .filter(
        (ast) =>
          ast.startTime > selectedSetting.startTime &&
          ast.uuid !== selectedSetting.uuid
      )
      .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));

    const minValue = lowerThanStartTime.at(0)?.startTime ?? 0;
    const maxValue = largerThanStartTime.at(0)?.startTime ?? startTime + 5;
    return startTime > minValue && startTime < maxValue;
  };

  return (
    <div id="animation-settings" key={selectedSetting?.uuid + "settings"}>
      <TextField
        label="Pattern animation name"
        defaultValue={selectedPatternAnimation?.name ?? ""}
        onChange={(e) => updatePatternAnimation("name", e.target.value)}
      />
      <TextField
        defaultValue={selectedPatternAnimation?.startTimeOffset}
        label="Start time ms"
        InputProps={{ inputProps: { min: 0, max: 2147483647 } }}
        type="number"
        onChange={(e) => {
          if (e.target.value >= 0) {
            updatePatternAnimation("startTimeOffset", Number(e.target.value));
          }
        }}
      />
      <br />
      <label>Duration time ms</label>
      <br />
      {duration}
      <br />
      Timeline
      <br />
      <Select
        onChange={(e) => updatePatternAnimation("timeLineId", e.target.value)}
        value={selectedPatternAnimation?.timeLineId ?? 1}
      >
        <MenuItem value={0}>0</MenuItem>
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
      </Select>
      <br />
      <Tooltip title="Delete pattern animation">
        <IconButton onClick={deletePatternAnimation}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Duplicate pattern animation">
        <IconButton
          onClick={() => duplicatePatternAnimation(selectedPatternAnimation)}
        >
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
      <hr />
      <label>Animation points</label>
      <br />
      <TextField
        value={selectedSetting?.scale}
        label="Scale"
        type="number"
        onChange={(e) =>
          updateAnimationSetting("scale", Number(e.target.value))
        }
        inputProps={{
          step: "0.1",
          min: 0.1,
          max: 1,
        }}
      />
      <br />
      <TextField
        value={selectedSetting?.startTime}
        label="StartTime"
        type="number"
        onChange={(e) => {
          const value = Number(e.target.value);
          const valueValid = validateStartTime(value);
          if (!valueValid) {
            showError(toastSubject.startTimeBoundaryError);
            return;
          }

          setTimeLineCurrentMs(value);
          updateAnimationSetting("startTime", value);
        }}
        inputProps={{
          min: 0,
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
        value={selectedSetting?.centerX ?? 0}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (
            selectedSetting?.points?.some(
              (p) => p.x + value > 4000 || p.x + value < -4000
            )
          ) {
            showError(toastSubject.pointsBoundaryError);
            return;
          }

          updateAnimationSetting("centerX", value);
        }}
      />
      <TextField
        label="Center y"
        type="number"
        inputProps={{
          min: -4000,
          max: 4000,
        }}
        value={selectedSetting?.centerY ?? 0}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (
            selectedSetting?.points?.some(
              (p) => p.y + value > 4000 || p.y + value < -4000
            )
          ) {
            showError(toastSubject.pointsBoundaryError);
            return;
          }

          updateAnimationSetting("centerY", Number(e.target.value));
        }}
      />
      <TextField
        label="Rotation °"
        type="number"
        value={selectedSetting?.rotation ?? 0}
        onChange={(e) =>
          updateAnimationSetting("rotation", Number(e.target.value))
        }
        inputProps={{
          min: 0,
          max: 360,
        }}
      />
      <br />
      <IconButton
        disabled={selectedSetting !== undefined}
        onClick={() => updateAnimationSetting("animationSettings", [])}
      >
        <AddIcon />
      </IconButton>
      <span
        disabled={
          selectedSetting === undefined ||
          selectedPatternAnimation?.animationSettings?.length === 1
        }
      >
        <Tooltip title="Delete current setting">
          <IconButton
            onClick={() => {
              let settings = structuredClone(
                selectedPatternAnimation?.animationSettings
              );
              const index = settings.findIndex(
                (s) => s.uuid === selectedSetting.uuid
              );
              if (index === -1) {
                return;
              }

              settings.splice(index, 1);
              updatePatternAnimation("animationSettings", settings);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </span>
      <br />
      <Divider />
      <PointsForm
        namePlaceHolder="Animation name"
        item={selectedSetting}
        onChange={(points) => updateAnimationSetting("points", points)}
      />
    </div>
  );
}

import { valueIsWithinBoundaries } from "services/shared/math";
import { showError, toastSubject } from "services/shared/toast-messages";
import { getPointsPlaceHolder } from "services/shared/points";
import { Button, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { deepClone, objectsAreSame } from "services/shared/general";
import React, { useState } from "react";

function PointsForm({ item, onChange, options }) {
  const [redPower, setRedPower] = useState(0);
  const [greenPower, setGreenPower] = useState(0);
  const [bluePower, setBluePower] = useState(0);

  const { hideLaserPower } = options ?? {};
  if (item === undefined) {
    return null;
  }

  const onPointUpdate = (pointUuid, property, value) => {
    if (typeof property !== "string") {
      return;
    }

    const propertyIsXOrYAxle = property === "x" || property === "y";
    if (propertyIsXOrYAxle && !valueIsWithinBoundaries(value, -4000, 4000)) {
      showError(toastSubject.pointsBoundaryError);
      return;
    } else if (!propertyIsXOrYAxle && !valueIsWithinBoundaries(value, 0, 255)) {
      showError(toastSubject.laserPwmPowerBoundaryError);
      return;
    }

    let points = deepClone(item?.points);
    let pointToUpdate = points.find((p) => p?.uuid === pointUuid);

    pointToUpdate[property] = value;
    onChange(points);
  };

  const addPoint = () => {
    let points = deepClone(item?.points);
    points.push(getPointsPlaceHolder(item.uuid, item.points.length));
    onChange(points);
  };

  const deletePoint = (uuid) => {
    const pointToDeleteIndex = item.points.findIndex((p) => p.uuid === uuid);
    if (pointToDeleteIndex === -1) {
      return;
    }

    let points = deepClone(item?.points);
    points.splice(pointToDeleteIndex, 1);

    for (let i = pointToDeleteIndex; i < points.length; i++) {
      points[i].order = i;
    }

    onChange(points);
  };

  return (
    <div
      key={
        "form" +
        item?.uuid +
        item?.points[0]?.uuid +
        redPower +
        greenPower +
        bluePower
      }
    >
      {!hideLaserPower ? (
        <span>
          <TextField
            size="small"
            style={{ margin: "2px" }}
            InputProps={{ inputProps: { min: 0, max: 255 } }}
            type="number"
            label="R all"
            value={redPower}
            onChange={(e) => {
              let updatedPoints = [];
              deepClone(item?.points)?.forEach((point) => {
                point.redLaserPowerPwm = Number(e.target.value);
                updatedPoints.push(point);
              });
              onChange(updatedPoints);
              setRedPower(Number(e.target.value));
            }}
          />
          <TextField
            size="small"
            style={{ margin: "2px" }}
            InputProps={{ inputProps: { min: 0, max: 255 } }}
            type="number"
            label="G all"
            value={greenPower}
            onChange={(e) => {
              let updatedPoints = [];
              deepClone(item?.points)?.forEach((point) => {
                point.greenLaserPowerPwm = Number(e.target.value);
                updatedPoints.push(point);
              });
              onChange(updatedPoints);
              setGreenPower(Number(e.target.value));
            }}
          />
          <TextField
            size="small"
            style={{ margin: "2px" }}
            InputProps={{ inputProps: { min: 0, max: 255 } }}
            type="number"
            label="B all"
            value={bluePower}
            onChange={(e) => {
              let updatedPoints = [];
              deepClone(item?.points)?.forEach((point) => {
                point.blueLaserPowerPwm = Number(e.target.value);
                updatedPoints.push(point);
              });
              onChange(updatedPoints);
              setBluePower(Number(e.target.value));
            }}
          />
        </span>
      ) : null}
      {item?.points?.map((point, index) => (
        <div key={point?.uuid}>
          <small>Point {index}</small>
          <br />
          <TextField
            name={`x${index}`}
            size="small"
            style={{ margin: "2px" }}
            InputProps={{ inputProps: { min: -4000, max: 4000 } }}
            type="number"
            label="X"
            defaultValue={point.x}
            onChange={(e) =>
              onPointUpdate(point.uuid, "x", Number(e.target.value))
            }
          />
          <TextField
            name={`y${index}`}
            size="small"
            style={{ margin: "2px" }}
            InputProps={{ inputProps: { min: -4000, max: 4000 } }}
            type="number"
            label="Y"
            defaultValue={point.y}
            onChange={(e) =>
              onPointUpdate(point.uuid, "y", Number(e.target.value))
            }
          />
          {!hideLaserPower ? (
            <span>
              <TextField
                name={`r${index}`}
                size="small"
                style={{ margin: "2px" }}
                InputProps={{ inputProps: { min: 0, max: 255 } }}
                type="number"
                label="R"
                defaultValue={point?.redLaserPowerPwm}
                onChange={(e) =>
                  onPointUpdate(
                    point.uuid,
                    "redLaserPowerPwm",
                    Number(e.target.value)
                  )
                }
              />
              <TextField
                size="small"
                style={{ margin: "2px" }}
                InputProps={{ inputProps: { min: 0, max: 255 } }}
                type="number"
                label="G"
                defaultValue={point?.greenLaserPowerPwm}
                onChange={(e) =>
                  onPointUpdate(
                    point.uuid,
                    "greenLaserPowerPwm",
                    Number(e.target.value)
                  )
                }
              />
              <TextField
                size="small"
                style={{ margin: "2px" }}
                InputProps={{ inputProps: { min: 0, max: 255 } }}
                type="number"
                label="B"
                defaultValue={point?.blueLaserPowerPwm}
                onChange={(e) =>
                  onPointUpdate(
                    point.uuid,
                    "blueLaserPowerPwm",
                    Number(e.target.value)
                  )
                }
              />
            </span>
          ) : null}
          <IconButton
            key={"delete" + item.uuid + index}
            onClick={() => deletePoint(point.uuid)}
            style={{ marginTop: "15px" }}
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
      <br />
      <Button
        variant="contained"
        disabled={item === undefined}
        onClick={addPoint}
        style={{ marginTop: "10px", width: "305px" }}
        size="small"
        startIcon={<AddIcon />}
      >
        Add point
      </Button>
    </div>
  );
}

// checks if props are the same. If true no rerender will occur. This is to improve performance
export default React.memo(PointsForm, (prevProps, nextProps) => {
  return (
    prevProps.namePlaceHolder === nextProps.namePlaceHolder &&
    objectsAreSame(prevProps?.item, nextProps?.item)
  );
});

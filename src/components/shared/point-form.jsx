import { valueIsWithinBoundaries } from "services/shared/math";
import { showError, toastSubject } from "services/shared/toast-messages";
import { getPointsPlaceHolder } from "services/shared/points";
import { Button, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { objectsAreSame } from "services/shared/general";

function PointsForm({ item, onChange }) {
  if (item === undefined) {
    return null;
  }

  item.points = item?.points?.sort((a, b) => (a.order > b.order ? 1 : -1));

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

    let points = structuredClone(item?.points);
    let pointToUpdate = points.find((p) => p?.uuid === pointUuid);

    pointToUpdate[property] = value;
    onChange(points);
  };

  const addPoint = () => {
    let points = structuredClone(item?.points);
    points.push(getPointsPlaceHolder(item.uuid, item.points.length));
    onChange(points);
  };

  const deletePoint = (uuid) => {
    let points = structuredClone(item?.points);
    const index = points.findIndex((p) => p.uuid === uuid);
    if (index === -1) {
      return;
    }

    points.splice(index, 1);
    onChange(points);
  };

  return (
    <div key={"form" + item?.uuid + item?.points[0]?.uuid}>
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
            name={`r${index}`}
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
            name={`r${index}`}
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
      <Button
        disabled={item === undefined}
        onClick={() => addPoint()}
        style={{ margin: "10px", width: "360px" }}
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
  // TODO alert("test me!");
  if (
    prevProps.namePlaceHolder === nextProps.namePlaceHolder &&
    objectsAreSame(prevProps?.item?.points, nextProps?.item?.points)
  ) {
    return true;
  }
  return false; // props are not equal -> update the component
});

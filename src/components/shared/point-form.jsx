import { valueIsWithinBoundaries } from "services/shared/math";
import { showError, toastSubject } from "services/shared/toast-messages";
import { Button, TextField } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { getPointsPlaceHolder } from "services/shared/points";

export default function PointsForm({ item, onChange }) {
  const onPointUpdate = (pointUuid, property, value) => {
    if (typeof property !== "string") {
      return;
    }

    const propertyIsXOrYAxle = property === "x" || property === "y";
    if (propertyIsXOrYAxle && !valueIsWithinBoundaries(value, -4000, 4000)) {
      showError(toastSubject.boundaryError);
      return;
    }

    let points = structuredClone(item?.points);
    let pointToUpdate = points.find((p) => p?.uuid === pointUuid);

    pointToUpdate[property] = value;
    onChange(points);
  };

  const addPoint = () => {
    let points = structuredClone(item?.points);
    points.push(getPointsPlaceHolder(item.uuid));
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
            onChange={(e) => onPointUpdate(point.uuid, "x", e.target.value)}
          />
          <TextField
            name={`y${index}`}
            size="small"
            style={{ margin: "2px" }}
            InputProps={{ inputProps: { min: -4000, max: 4000 } }}
            type="number"
            label="Y"
            defaultValue={point.y}
            onChange={(e) => onPointUpdate(point.uuid, "y", e.target.value)}
          />
          <TextField
            name={`r${index}`}
            size="small"
            style={{ margin: "2px" }}
            InputProps={{ inputProps: { min: 0, max: 511 } }}
            type="number"
            label="R"
            defaultValue={point?.redLaserPowerPwm}
            onChange={(e) =>
              onPointUpdate(point.uuid, "redLaserPowerPwm", e.target.value)
            }
          />
          <TextField
            name={`r${index}`}
            size="small"
            style={{ margin: "2px" }}
            InputProps={{ inputProps: { min: 0, max: 511 } }}
            type="number"
            label="G"
            defaultValue={point?.greenLaserPowerPwm}
            onChange={(e) =>
              onPointUpdate(point.uuid, "greenLaserPowerPwm", e.target.value)
            }
          />
          <TextField
            name={`r${index}`}
            size="small"
            style={{ margin: "2px" }}
            InputProps={{ inputProps: { min: 0, max: 511 } }}
            type="number"
            label="B"
            defaultValue={point?.blueLaserPowerPwm}
            onChange={(e) =>
              onPointUpdate(point.uuid, "blueLaserPowerPwm", e.target.value)
            }
          />
          <Button
            key={"delete" + item.uuid + index}
            onClick={() => deletePoint(point.uuid)}
            style={{ marginTop: "15px" }}
            size="small"
            color="secondary"
            startIcon={<DeleteIcon />}
          />
        </div>
      ))}
      <Button
        disabled={item === undefined}
        onClick={() => addPoint()}
        style={{ marginTop: "5px", width: "225px" }}
        size="small"
        color="primary"
        variant="contained"
        startIcon={<AddIcon />}
      >
        Add point
      </Button>
    </div>
  );
}

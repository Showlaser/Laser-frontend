import { valueIsWithinBoundaries } from "services/shared/math";
import { showError, toastSubject } from "services/shared/toast-messages";
import { Button, TextField } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

export default function PointsForm(props) {
  const { item } = props;

  const updatePatternPoint = (index, value, axle) => {
    if (!valueIsWithinBoundaries(value, -4000, 4000)) {
      showError(toastSubject.boundaryError);
      return;
    }

    props?.onPointUpdate(index, value, axle);
  };

  return (
    <div>
      {item?.points?.map((point, index) => (
        <div key={"form" + item.uuid + index}>
          <small>Point {index}</small>
          <br />
          <TextField
            key={"x" + item.uuid + index}
            name={`x${index}`}
            size="small"
            style={{ margin: "2px" }}
            InputProps={{ inputProps: { min: -4000, max: 4000 } }}
            type="number"
            label="X"
            defaultValue={point.x}
            onChange={(e) =>
              updatePatternPoint(index, Number(e.target.value), "x")
            }
          />
          <TextField
            key={"y" + item.uuid + index}
            name={`y${index}`}
            size="small"
            style={{ margin: "2px" }}
            InputProps={{ inputProps: { min: -4000, max: 4000 } }}
            type="number"
            label="Y"
            defaultValue={point.y}
            onChange={(e) =>
              updatePatternPoint(index, Number(e.target.value), "y")
            }
          />
          <Button
            key={"delete" + item.uuid + index}
            onClick={() => props?.onDelete(point)}
            style={{ marginTop: "15px" }}
            size="small"
            color="secondary"
            startIcon={<DeleteIcon />}
          />
        </div>
      ))}
      <Button
        onClick={() => props?.addPoint()}
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

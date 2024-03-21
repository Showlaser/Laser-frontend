import { Point } from "models/components/shared/point";
import {
  Alert,
  Autocomplete,
  Checkbox,
  Divider,
  Fade,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  TablePagination,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { PatternSectionProps } from "models/components/shared/pattern";
import { getHexColorStringFromPoint, setLaserPowerFromHexString } from "services/shared/converters";
import { showError, toastSubject } from "services/shared/toast-messages";
import { numberIsBetweenOrEqual } from "services/shared/math";
import AddIcon from "@mui/icons-material/Add";
import { getPointsPlaceHolder } from "services/shared/points";
import { OnTrue } from "components/shared/on-true";

export default function PointsSection({
  pattern,
  setPattern,
  updatePatternProperty,
  selectedPointsUuid,
  setSelectedPointsUuid,
}: PatternSectionProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);
  const [showColorWarning, setShowColorWarning] = React.useState<boolean>(false);

  const updatePointProperty = (pointToUpdate: Point, value: any, property: string) => {
    let updatedPoints: Point[] = [...pattern.points];
    const pointToUpdateIndex: number = updatedPoints.findIndex((p: Point) => p.uuid === pointToUpdate.uuid);

    if (pointToUpdateIndex === -1) {
      return;
    }

    switch (property) {
      case "connectedToPointOrderNr":
        if (value === "None") {
          updatedPoints[pointToUpdateIndex].connectedToPointOrderNr = null;
        } else {
          const substringIndex = value.indexOf("Point") + 5;
          updatedPoints[pointToUpdateIndex].connectedToPointOrderNr = Number(value.substring(substringIndex)) - 1;
        }

        break;
      case "x":
        const x = Number(value);
        if (x > 4000 || x < -4000) {
          showError(toastSubject.pointsBoundaryError);
          break;
        }
        updatedPoints[pointToUpdateIndex].x = x;
        break;
      case "y":
        const y = Number(value);
        if (y > 4000 || y < -4000) {
          showError(toastSubject.pointsBoundaryError);
          break;
        }
        updatedPoints[pointToUpdateIndex].y = y;
        break;
      case "colorRgb":
        updatedPoints[pointToUpdateIndex] = setLaserPowerFromHexString(value, {
          ...updatedPoints[pointToUpdateIndex],
        });
        break;
      case "order":
        const substringIndex = value.indexOf("Point") + 5;
        const actualValue = Number(value.substring(substringIndex)) - 1;
        const pointToSwapOrderWithIndex = updatedPoints.findIndex((p) => p.orderNr === actualValue);
        const pointToSwapOrderWithOrderNr = updatedPoints[pointToSwapOrderWithIndex].orderNr;

        updatedPoints[pointToSwapOrderWithIndex].orderNr = updatedPoints[pointToUpdateIndex].orderNr;
        updatedPoints[pointToUpdateIndex].orderNr = pointToSwapOrderWithOrderNr;
        break;
      default:
        break;
    }

    updatePatternProperty("points", updatedPoints);
  };

  const deleteSelectedPoints = () => {
    if (selectedPointsUuid.length < 1) {
      return;
    }

    const newPoints = pattern.points.filter((pp) => !selectedPointsUuid.some((spu) => spu === pp.uuid));
    newPoints.forEach((np, index) => (np.orderNr = index));

    const selectedPoints = selectedPointsUuid.filter((spu) => newPoints.some((np) => np.uuid === spu));
    const pageNumberToSet = Math.floor((newPoints.length - 1) / itemsPerPage);
    setCurrentPage(pageNumberToSet);
    updatePatternProperty("points", newPoints);
    setSelectedPointsUuid(selectedPoints);
  };

  const onToggle = (pointUuid: string, checked: boolean) => {
    let selectedPoints = [...selectedPointsUuid];

    if (!checked) {
      const pointIndex = selectedPoints.findIndex((sp) => sp === pointUuid);
      if (pointIndex === -1) {
        return;
      }

      selectedPoints.splice(pointIndex, 1);
      setSelectedPointsUuid(selectedPoints);
      return;
    }

    selectedPoints.push(pointUuid);
    setSelectedPointsUuid(selectedPoints);
  };

  const getItemsEndIndex = () =>
    currentPage * itemsPerPage + itemsPerPage > pattern?.points.length
      ? pattern?.points.length
      : currentPage * itemsPerPage + itemsPerPage - 1;

  const pointsToRender = [...pattern?.points]
    .sort((a, b) => a.orderNr - b.orderNr)
    .filter((p) => numberIsBetweenOrEqual(p.orderNr, currentPage * itemsPerPage, getItemsEndIndex()));

  const addPoint = () => {
    let updatedPattern = { ...pattern };
    const newPoint = getPointsPlaceHolder(updatedPattern.uuid, updatedPattern.points.length);
    updatedPattern.points.push(newPoint);

    const pageNumberToSet = Math.floor((updatedPattern.points.length - 1) / itemsPerPage);
    setCurrentPage(pageNumberToSet);
    setPattern(updatedPattern);
  };

  const toggleAllPoints = (checked: boolean) =>
    checked ? setSelectedPointsUuid(pattern.points.map((p) => p.uuid)) : setSelectedPointsUuid([]);

  const getConnectablePoints = () => {
    let points = [...pattern?.points]
      .sort((a, b) => a.orderNr - b.orderNr)
      .map((p) => ({ label: `Point ${p.orderNr + 1}` }));

    points.unshift({ label: "None" });
    return points;
  };

  const connectablePoints = getConnectablePoints();

  const onRowsPerPageChange = (itemsPerRow: number) => {
    setItemsPerPage(itemsPerRow);
    setCurrentPage(0);
  };

  return (
    <>
      <div style={{ marginLeft: "4px" }}>
        <Tooltip title="Select all">
          <Checkbox
            checked={selectedPointsUuid.length === pattern.points.length && pattern.points.length > 0}
            onClick={(e: any) => toggleAllPoints(e.target.checked)}
          />
        </Tooltip>
        <Tooltip title="Add point">
          <IconButton onClick={addPoint} style={{ color: "#4e61cf" }}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete selected points">
          <IconButton onClick={deleteSelectedPoints} style={{ color: "#d13126" }}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Divider />
      </div>
      <div style={{ height: 500, width: "100%", overflowY: "scroll" }}>
        <OnTrue onTrue={showColorWarning}>
          <Fade in={showColorWarning} timeout={1000}>
            <Alert severity="warning">
              Warning! Color changes are only applied when clicking next to the color picker!
            </Alert>
          </Fade>
        </OnTrue>
        <List dense>
          {pointsToRender.map((point, index) => (
            <ListItem key={`points-section-${point.uuid}`}>
              <ListItemIcon onClick={(e: any) => onToggle(point.uuid, e.target.checked)}>
                <Checkbox
                  edge="start"
                  checked={selectedPointsUuid.some((sp) => sp === point.uuid)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": `points-label-${index}` }}
                />
              </ListItemIcon>
              <FormControl style={{ width: "125px" }}>
                <Autocomplete
                  key={`${point.orderNr}-${point.uuid}`}
                  defaultValue={{
                    label: `Point ${point.orderNr + 1}`,
                  }}
                  disableClearable
                  onChange={(e, value) => updatePointProperty(point, value?.label, "order")}
                  disablePortal
                  options={connectablePoints.filter(
                    (cp) => cp.label !== `Point ${point.orderNr + 1}` && cp.label !== "None"
                  )}
                  renderInput={(params) => <TextField {...params} label="Point order" />}
                />
              </FormControl>
              <TextField
                style={{ marginLeft: "35px" }}
                defaultValue={point.x ?? undefined}
                onChange={(e) => updatePointProperty(point, e.target.value, "x")}
                placeholder="x"
                type="number"
                inputProps={{ min: -4000, max: 4000 }}
                label="X"
              />
              <TextField
                style={{ marginLeft: "35px" }}
                defaultValue={point.y ?? undefined}
                onChange={(e) => updatePointProperty(point, e.target.value, "y")}
                placeholder="y"
                type="number"
                inputProps={{ min: -4000, max: 4000 }}
                label="Y"
              />
              <FormControl style={{ marginLeft: "35px", width: "125px" }}>
                <Autocomplete
                  defaultValue={{
                    label: point.connectedToPointOrderNr === null ? "None" : `Point ${point.connectedToPointOrderNr}`,
                  }}
                  disableClearable
                  onChange={(e, value) => updatePointProperty(point, value?.label, "connectedToPointOrderNr")}
                  disablePortal
                  options={connectablePoints.filter((cp) => cp.label !== `Point ${point.orderNr + 1}`)}
                  renderInput={(params) => <TextField {...params} label="Connected to point" />}
                />
              </FormControl>
              <TextField
                onClick={() => setShowColorWarning(true)}
                style={{ marginLeft: "35px", width: "100px" }}
                defaultValue={getHexColorStringFromPoint(point) ?? "#ffffff"}
                onBlur={(e) => {
                  setShowColorWarning(false);
                  updatePointProperty(point, e.target.value, "colorRgb");
                }}
                placeholder="Color"
                type="color"
                label="Color"
              />
            </ListItem>
          ))}
        </List>
      </div>
      <TablePagination
        style={{ color: "whitesmoke" }}
        component="div"
        count={pattern?.points.length}
        page={currentPage}
        onPageChange={(e: any, page: number) => setCurrentPage(page)}
        onRowsPerPageChange={(e: any) => onRowsPerPageChange(Number(e.target.value))}
        rowsPerPage={itemsPerPage}
        rowsPerPageOptions={[25, 50]}
      />
    </>
  );
}

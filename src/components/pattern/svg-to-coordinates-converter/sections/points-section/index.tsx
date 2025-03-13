import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { OnTrue } from "components/shared/on-true";
import { PatternSectionProps } from "models/components/shared/pattern";
import { Point } from "models/components/shared/point";
import React, { useState } from "react";
import { getHexColorStringFromPoint, setLaserPowerFromHexString } from "services/shared/converters";
import { emptyGuid, numberIsBetweenOrEqual } from "services/shared/math";
import { getPointsPlaceHolder } from "services/shared/points";
import { showError, toastSubject } from "services/shared/toast-messages";

export default function PointsSection({
  pattern,
  setPattern,
  updatePatternProperty,
  selectedPointsUuid,
  setSelectedPointsUuid,
}: Readonly<PatternSectionProps>) {
  const notConnectedToPointValue = "None";

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);

  const [showColorWarning, setShowColorWarning] = React.useState<boolean>(false);

  const getDataToUpdate = (pointToUpdate: Point) => {
    let updatedPoints: Point[] = [...pattern.points];
    const pointToUpdateIndex: number = updatedPoints.findIndex(
      (p: Point) => p.uuid === pointToUpdate.uuid
    );

    return { updatedPoints, pointToUpdateIndex };
  };

  const onConnectedToPointUuidUpdate = (pointToUpdate: Point, selectedValue: string) => {
    const { updatedPoints, pointToUpdateIndex } = getDataToUpdate(pointToUpdate);
    if (pointToUpdateIndex === -1) {
      return;
    }

    if (selectedValue === notConnectedToPointValue) {
      updatedPoints[pointToUpdateIndex].connectedToPointUuid = emptyGuid;
    } else {
      const index = Number(selectedValue.substring(6)) - 1;
      const pointIndex = Number(index);
      updatedPoints[pointToUpdateIndex].connectedToPointUuid = pointsToRender[pointIndex].uuid;
    }
    updatePatternProperty("points", updatedPoints);
  };

  const onXUpdate = (pointToUpdate: Point, selectedValue: string) => {
    const { updatedPoints, pointToUpdateIndex } = getDataToUpdate(pointToUpdate);
    if (pointToUpdateIndex === -1) {
      return;
    }

    const x = Number(selectedValue);
    if (x > 4000 || x < -4000) {
      showError(toastSubject.pointsBoundaryError);
    }
    updatedPoints[pointToUpdateIndex].x = x;
    updatePatternProperty("points", updatedPoints);
  };

  const onYUpdate = (pointToUpdate: Point, selectedValue: string) => {
    const { updatedPoints, pointToUpdateIndex } = getDataToUpdate(pointToUpdate);
    if (pointToUpdateIndex === -1) {
      return;
    }

    const y = Number(selectedValue);
    if (y > 4000 || y < -4000) {
      showError(toastSubject.pointsBoundaryError);
    }
    updatedPoints[pointToUpdateIndex].y = y;
    updatePatternProperty("points", updatedPoints);
  };

  const onColorUpdate = (pointToUpdate: Point, selectedValue: string) => {
    const { updatedPoints, pointToUpdateIndex } = getDataToUpdate(pointToUpdate);
    if (pointToUpdateIndex === -1) {
      return;
    }

    updatedPoints[pointToUpdateIndex] = setLaserPowerFromHexString(selectedValue, {
      ...updatedPoints[pointToUpdateIndex],
    });
    updatePatternProperty("points", updatedPoints);
  };

  const onOrderUpdate = (pointToUpdate: Point, selectedValue: string) => {
    const { updatedPoints, pointToUpdateIndex } = getDataToUpdate(pointToUpdate);
    if (pointToUpdateIndex === -1) {
      return;
    }

    const substringIndex = selectedValue.indexOf("Point") + 5;
    const actualValue = Number(selectedValue.substring(substringIndex)) - 1;
    const pointToSwapOrderWithIndex = updatedPoints.findIndex((p) => p.orderNr === actualValue);
    const pointToSwapOrderWithOrderNr = updatedPoints[pointToSwapOrderWithIndex].orderNr;

    updatedPoints[pointToSwapOrderWithIndex].orderNr = updatedPoints[pointToUpdateIndex].orderNr;
    updatedPoints[pointToUpdateIndex].orderNr = pointToSwapOrderWithOrderNr;
    updatePatternProperty("points", updatedPoints);
  };

  const deleteSelectedPoints = () => {
    if (selectedPointsUuid.length < 1) {
      return;
    }

    const newPoints = pattern.points.filter(
      (pp) => !selectedPointsUuid.some((spu) => spu === pp.uuid)
    );
    newPoints.forEach((np, index) => (np.orderNr = index));

    const selectedPoints = selectedPointsUuid.filter((spu) =>
      newPoints.some((np) => np.uuid === spu)
    );
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
    .filter((p) =>
      numberIsBetweenOrEqual(p.orderNr, currentPage * itemsPerPage, getItemsEndIndex())
    );

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

    points.unshift({ label: notConnectedToPointValue });
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
            checked={
              selectedPointsUuid.length === pattern.points.length && pattern.points.length > 0
            }
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
                  onChange={(e, value) => onOrderUpdate(point, value.label)}
                  disablePortal
                  options={connectablePoints.filter(
                    (cp) =>
                      cp.label !== `Point ${point.orderNr + 1}` &&
                      cp.label !== notConnectedToPointValue
                  )}
                  renderInput={(params) => <TextField {...params} label="Point order" />}
                />
              </FormControl>
              <TextField
                style={{ marginLeft: "35px" }}
                defaultValue={point.x ?? undefined}
                onChange={(e) => onXUpdate(point, e.target.value)}
                placeholder="x"
                type="number"
                inputProps={{ min: -4000, max: 4000 }}
                label="X"
              />
              <TextField
                style={{ marginLeft: "35px" }}
                defaultValue={point.y ?? undefined}
                onChange={(e) => onYUpdate(point, e.target.value)}
                placeholder="y"
                type="number"
                inputProps={{ min: -4000, max: 4000 }}
                label="Y"
              />
              <FormControl style={{ marginLeft: "35px", width: "125px" }}>
                <Autocomplete
                  defaultValue={{
                    label:
                      point.connectedToPointUuid === emptyGuid
                        ? notConnectedToPointValue
                        : `Point ${
                            pointsToRender.find((p) => p.uuid === point.connectedToPointUuid)
                              ?.orderNr
                          }`,
                  }}
                  disableClearable
                  onChange={(e, value) => onConnectedToPointUuidUpdate(point, value.label)}
                  disablePortal
                  options={connectablePoints.filter(
                    (cp) => cp.label !== `Point ${point.orderNr + 1}`
                  )}
                  renderInput={(params) => <TextField {...params} label="Connected to point" />}
                />
              </FormControl>
              <TextField
                onClick={() => setShowColorWarning(true)}
                style={{ marginLeft: "35px", width: "100px" }}
                defaultValue={getHexColorStringFromPoint(point) ?? "#ffffff"}
                onBlur={(e) => {
                  setShowColorWarning(false);
                  onColorUpdate(point, e.target.value);
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

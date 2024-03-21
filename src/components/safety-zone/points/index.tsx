import {
  Tooltip,
  Checkbox,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  FormControl,
  Autocomplete,
  TextField,
  TablePagination,
} from "@mui/material";
import { SafetyZone, SafetyZonePoint, getSafetyZonePointsPlaceHolder } from "models/components/shared/safety-zone";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { numberIsBetweenOrEqual } from "services/shared/math";

export interface SafetyZonesPointSectionProps {
  safetyZone: SafetyZone;
  setSafetyZoneProperty: (value: any, property: string) => void;
}

export default function SafetyZonePoints({ safetyZone, setSafetyZoneProperty }: SafetyZonesPointSectionProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);
  const [selectedPointsUuid, setSelectedPointsUuid] = useState<string[]>([]);

  const toggleAllPoints = (checked: boolean) =>
    checked ? setSelectedPointsUuid(safetyZone.points.map((p) => p.uuid)) : setSelectedPointsUuid([]);

  const addPoint = () => {
    let updatedPoints = [...safetyZone.points];
    const newPoint = getSafetyZonePointsPlaceHolder(safetyZone.uuid, safetyZone.points.length);
    updatedPoints.push(newPoint);

    const pageNumberToSet = Math.floor((updatedPoints.length - 1) / itemsPerPage);
    setCurrentPage(pageNumberToSet);
    setSafetyZoneProperty(updatedPoints, "points");

    setTimeout(() => {
      // Delay, because the list does not contain the item yet
      const list = document.getElementById("safety-zone-points-list");
      if (list === null) {
        return;
      }

      list.scrollTop = list.scrollHeight;
    }, 50);
  };

  const deleteSelectedPoints = () => {
    if (selectedPointsUuid.length < 1) {
      return;
    }

    const newPoints = safetyZone.points.filter((pp) => !selectedPointsUuid.some((spu) => spu === pp.uuid));
    newPoints.forEach((np, index) => (np.orderNr = index));

    const selectedPoints = selectedPointsUuid.filter((spu) => newPoints.some((np) => np.uuid === spu));
    const pageNumberToSet = Math.floor((newPoints.length - 1) / itemsPerPage);
    setCurrentPage(pageNumberToSet);
    setSafetyZoneProperty(newPoints, "points");
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
    currentPage * itemsPerPage + itemsPerPage > safetyZone.points.length
      ? safetyZone.points.length
      : currentPage * itemsPerPage + itemsPerPage - 1;

  const pointsToRender = [...safetyZone.points]
    .sort((a, b) => a.orderNr - b.orderNr)
    .filter((p) => numberIsBetweenOrEqual(p.orderNr, currentPage * itemsPerPage, getItemsEndIndex()));

  const onRowsPerPageChange = (itemsPerRow: number) => {
    setItemsPerPage(itemsPerRow);
    setCurrentPage(0);
  };

  const getConnectablePoints = () => {
    let points = [...safetyZone.points]
      .sort((a, b) => a.orderNr - b.orderNr)
      .map((p) => ({ label: `Point ${p.orderNr + 1}` }));

    points.unshift({ label: "None" });
    return points;
  };

  const updatePointProperty = (point: SafetyZonePoint, value: any, property: string) => {
    const index = safetyZone.points.findIndex((p) => p.uuid === point.uuid);
    if (index === -1) {
      return;
    }

    let updatedPoint: any = { ...safetyZone.points[index] };
    let updatedPoints = [...safetyZone.points];

    if (property === "orderNr") {
      const substringIndex = value.indexOf("Point") + 5;
      const actualValue = Number(value.substring(substringIndex)) - 1;
      const pointToSwapOrderWithIndex = updatedPoints.findIndex((p) => p.orderNr === actualValue);
      const pointToSwapOrderWithOrderNr = updatedPoints[pointToSwapOrderWithIndex].orderNr;

      updatedPoints[pointToSwapOrderWithIndex].orderNr = updatedPoints[index].orderNr;
      updatedPoints[index].orderNr = pointToSwapOrderWithOrderNr;
    } else {
      updatedPoint[property] = value;
      updatedPoints[index] = updatedPoint;
    }

    setSafetyZoneProperty(updatedPoints, "points");
  };

  const connectablePoints = getConnectablePoints();

  return (
    <>
      <div style={{ marginLeft: "4px" }}>
        <Tooltip title="Select all">
          <Checkbox
            checked={selectedPointsUuid.length === safetyZone.points.length && safetyZone.points.length > 0}
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
      <div>
        <List dense style={{ overflowY: "auto", maxHeight: "180px" }} id="safety-zone-points-list">
          {pointsToRender.map((point: SafetyZonePoint, index) => (
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
                  onChange={(e, value) => updatePointProperty(point, value?.label, "orderNr")}
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
                onChange={(e) => updatePointProperty(point, Number(e.target.value), "x")}
                placeholder="x"
                type="number"
                inputProps={{ min: -4000, max: 4000 }}
                label="X"
              />
              <TextField
                style={{ marginLeft: "35px" }}
                defaultValue={point.y ?? undefined}
                onChange={(e) => updatePointProperty(point, Number(e.target.value), "y")}
                placeholder="y"
                type="number"
                inputProps={{ min: -4000, max: 4000 }}
                label="Y"
              />
            </ListItem>
          ))}
        </List>
      </div>
      <TablePagination
        style={{ color: "whitesmoke" }}
        component="div"
        count={safetyZone.points.length}
        page={currentPage}
        onPageChange={(e: any, page: number) => setCurrentPage(page)}
        onRowsPerPageChange={(e: any) => onRowsPerPageChange(Number(e.target.value))}
        rowsPerPage={itemsPerPage}
        rowsPerPageOptions={[25, 50]}
      />
    </>
  );
}

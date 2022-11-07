import { DataGrid, GridCellEditCommitParams, GridColDef } from "@mui/x-data-grid";
import { Point } from "models/components/shared/point";
import { IconButton, rgbToHex, TextField, Tooltip } from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { SectionProps } from "models/components/shared/pattern";
import { rgbColorStringFromPoint, setLaserPowerFromHexString } from "services/shared/converters";

export default function PointsSection({
  pattern,
  updatePatternProperty,
  selectedPointsUuid,
  setSelectedPointsUuid,
}: SectionProps) {
  const [currentUuid, setCurrentUuid] = useState<string>();

  const updatePointProperty = (points: Point[], params: GridCellEditCommitParams) => {
    let updatedPoints: Point[] = [...points];
    const pointToUpdateIndex: number = updatedPoints.findIndex((p: Point) => p.uuid === params.id);

    if (pointToUpdateIndex === -1) {
      return;
    }

    switch (params.field) {
      case "connectedToPointOrderNr":
        if (params.value === "None") {
          updatedPoints[pointToUpdateIndex].connectedToPointOrderNr = null;
        } else {
          const substringIndex = params.value.indexOf("Point") + 5;
          updatedPoints[pointToUpdateIndex].connectedToPointOrderNr = Number(params.value.substring(substringIndex));
        }

        break;
      case "colorRgb":
        updatedPoints[pointToUpdateIndex] = setLaserPowerFromHexString(params.value, {
          ...updatedPoints[pointToUpdateIndex],
        });
        break;
      case "order":
        const pointOrderToSwapIndex = updatedPoints.findIndex((p) => p.orderNr === Number(params.value));
        updatedPoints[pointOrderToSwapIndex].orderNr = updatedPoints[pointToUpdateIndex].orderNr;
        updatedPoints[pointToUpdateIndex].orderNr = Number(params.value);
        break;
      default:
        break;
    }

    updatePatternProperty("points", updatedPoints);
  };

  let inputRef = React.useRef<HTMLInputElement>(null);
  const onCellClick = (params: any, event: any, details: any) => {
    if (params.field === "colorRgb" && inputRef.current !== null) {
      const point = pattern.points.find((p) => p.uuid === params.id);
      if (point === undefined) {
        return;
      }

      inputRef.current.value = rgbToHex(rgbColorStringFromPoint(point));
      inputRef.current.click();
    }

    if (currentUuid !== params.id) {
      setCurrentUuid(params.id);
    }
  };

  const getAvailablePoints = () => {
    let options = pattern.points.map((point) => `Point ${point.orderNr}`);
    options.unshift("None");
    return options;
  };

  const getColumns = () => {
    let columns: GridColDef[] = [
      {
        field: "order",
        headerName: "Point",
        width: 70,
        editable: true,
        type: "singleSelect",
        valueOptions: pattern.points.map((point) => point.orderNr.toString()),
      },
      { field: "colorRgb", headerName: "Color Rgb", width: 130 },
      {
        field: "connectedToPointOrderNr",
        headerName: "Connected to point",
        width: 200,
        editable: true,
        type: "singleSelect",
        valueOptions: getAvailablePoints(),
      },
    ];

    if (selectedPointsUuid.length > 0) {
      columns.push({
        field: "delete",
        width: 75,
        sortable: false,
        disableColumnMenu: true,
        renderHeader: () => (
          <Tooltip title={`Delete selected point${selectedPointsUuid.length === 1 ? "s" : ""}`}>
            <IconButton onClick={deleteSelectedPoints}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ),
      });
    }

    return columns;
  };

  const deleteSelectedPoints = () => {
    const newPoints = pattern.points.filter((pp) => !selectedPointsUuid.some((spu) => spu === pp.uuid));
    newPoints.forEach((np, index) => (np.orderNr = index));
    updatePatternProperty("points", newPoints);
  };

  const rows = pattern.points
    .sort((a, b) => a.orderNr - b.orderNr)
    .map((point) => ({
      id: point.uuid,
      uuid: point.uuid,
      order: point.orderNr,
      colorRgb: rgbColorStringFromPoint(point),
      connectedToPointOrderNr: point.connectedToPointOrderNr === null ? null : `Point ${point.connectedToPointOrderNr}`,
    }));

  return (
    <div style={{ height: 400, width: "100%" }}>
      <TextField
        style={{ display: "none" }}
        type="color"
        inputRef={inputRef}
        onChange={(e) => {
          if (currentUuid === undefined) {
            return;
          }

          let updatedPoints = [...pattern.points];
          const index = updatedPoints.findIndex((p) => p.uuid === currentUuid);
          if (index !== -1) {
            updatedPoints[index] = setLaserPowerFromHexString(e.target.value, { ...updatedPoints[index] });
            updatePatternProperty("points", updatedPoints);
          }
        }}
      />
      <DataGrid
        onCellEditCommit={(params: GridCellEditCommitParams) => updatePointProperty(pattern.points, params)}
        checkboxSelection
        disableSelectionOnClick
        selectionModel={selectedPointsUuid}
        onCellClick={onCellClick}
        onSelectionModelChange={(ids) => setSelectedPointsUuid(ids.map((id) => id.toString()))}
        rows={rows}
        columns={getColumns()}
        pageSize={100}
        rowsPerPageOptions={[100]}
      />
    </div>
  );
}

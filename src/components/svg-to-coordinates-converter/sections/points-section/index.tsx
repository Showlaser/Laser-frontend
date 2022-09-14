import { SectionProps } from "components/svg-to-coordinates-converter";
import { DataGrid, GridCellEditCommitParams, GridColDef } from "@mui/x-data-grid";
import { Point } from "models/components/shared/point";
import { TextField } from "@mui/material";
import React, { useRef, useState } from "react";

export default function PointsSection({
  scale,
  setScale,
  numberOfPoints,
  setNumberOfPoints,
  xOffset,
  setXOffset,
  yOffset,
  setYOffset,
  rotation,
  setRotation,
  showPointNumber,
  setShowPointNumber,
  points,
  setPoints,
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
        updatedPoints[pointToUpdateIndex].colorRgb = params.value;
      default:
        break;
    }

    setPoints(updatedPoints);
  };

  let inputRef = React.useRef<HTMLInputElement>(null);
  const onCellClick = (params: any, event: any, details: any) => {
    if (params.field === "colorRgb" && inputRef.current !== null) {
      inputRef.current.click();
    }

    if (currentUuid !== params.id) {
      setCurrentUuid(params.id);
    }
  };

  const getAvailablePoints = () => {
    let options = points.map((point) => `Point ${point.orderNr}`);
    options.unshift("None");
    return options;
  };

  const columns: GridColDef[] = [
    { field: "order", headerName: "Point", width: 70 },
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

  const rows = points.map((point) => ({
    id: point.uuid,
    uuid: point.uuid,
    order: point.orderNr,
    colorRgb: point.colorRgb,
    connectedToPointOrderNr: point.connectedToPointOrderNr === null ? null : `Point ${point.connectedToPointOrderNr}`,
  }));

  return (
    <div style={{ height: 400, width: "100%" }}>
      <TextField
        style={{ display: "none" }}
        type="color"
        value="#ffffff"
        inputRef={inputRef}
        onChange={(e) => {
          if (currentUuid === undefined) {
            return;
          }

          let updatedPoints = [...points];
          const index = updatedPoints.findIndex((p) => p.uuid === currentUuid);
          if (index !== -1) {
            updatedPoints[index].colorRgb = e.target.value;
            setPoints(updatedPoints);
          }
        }}
      />
      <DataGrid
        onCellEditCommit={(params: GridCellEditCommitParams) => updatePointProperty(points, params)}
        checkboxSelection
        disableSelectionOnClick
        selectionModel={selectedPointsUuid}
        onCellClick={onCellClick}
        onSelectionModelChange={(ids) => setSelectedPointsUuid(ids.map((id) => id.toString()))}
        rows={rows}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[100]}
      />
    </div>
  );
}

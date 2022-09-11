import * as React from "react";
import { SectionProps } from "components/svg-to-coordinates-converter";
import {
  DataGrid,
  GridCellEditCommitParams,
  GridColDef,
} from "@mui/x-data-grid";
import { Point } from "models/components/shared/point";

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
  connectDots,
  setConnectDots,
  showPointNumber,
  setShowPointNumber,
  points,
  setPoints,
  selectedPointsUuid,
  setSelectedPointsUuid,
}: SectionProps) {
  const updatePointProperty = (
    points: Point[],
    params: GridCellEditCommitParams
  ) => {
    let updatedPoints: Point[] = [...points];
    const pointToUpdateIndex: number = updatedPoints.findIndex(
      (p: Point) => p.uuid === params.id
    );

    if (pointToUpdateIndex === -1) {
      return;
    }

    switch (params.field) {
      case "connectedToPointOrderNr":
        const substringIndex = params.value.indexOf("Point") + 5;
        updatedPoints[pointToUpdateIndex].connectedToPointOrderNr = Number(
          params.value.substring(substringIndex)
        );
        break;
      case "colorRgb":
        updatedPoints[pointToUpdateIndex].colorRgb = params.value;
      default:
        break;
    }

    setPoints(updatedPoints);
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
      valueOptions: points.map((point) => `Point ${point.orderNr}`),
    },
  ];

  const rows = points.map((point) => ({
    id: point.uuid,
    uuid: point.uuid,
    order: point.orderNr,
    color: point.colorRgb,
    connectedToPointOrderNr:
      point.connectedToPointOrderNr === null
        ? null
        : `Point ${point.connectedToPointOrderNr}`,
  }));

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        onCellEditCommit={(params: GridCellEditCommitParams) => {
          console.log(params);
          updatePointProperty(points, params);
        }}
        checkboxSelection
        disableSelectionOnClick
        selectionModel={selectedPointsUuid}
        onSelectionModelChange={(ids) => {
          console.log(ids);
          setSelectedPointsUuid(ids.map((id) => id.toString()));
        }}
        rows={rows}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[100]}
      />
    </div>
  );
}

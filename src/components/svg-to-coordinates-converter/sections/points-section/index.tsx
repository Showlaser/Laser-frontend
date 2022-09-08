import * as React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { SectionProps } from "components/svg-to-coordinates-converter";
import {
  DataGrid,
  GridCellEditStopParams,
  GridCellEditStopReasons,
  GridColDef,
  GridRowEditStopParams,
  GridRowEditStopReasons,
  MuiEvent,
} from "@mui/x-data-grid";

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
  selectedPointsUuid,
  setSelectedPointsUuid,
}: SectionProps) {
  const columns: GridColDef[] = [
    { field: "order", headerName: "Point", width: 70 },
    { field: "colorRgb", headerName: "Color Rgb", width: 130 },
    {
      field: "connectedTo",
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
    connectedTo:
      point.connectedToPointOrderNr === null
        ? null
        : `Point ${point.connectedToPointOrderNr}`,
  }));

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        onCellEditCommit={(params: any) => {
          console.log(params);
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

import * as React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from "@mui/material";
import SelectList from "components/select-list";
import { SectionProps } from "components/svg-to-coordinates-converter";

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
  const [checked, setChecked] = React.useState<string[]>(selectedPointsUuid);

  const handleToggle = (uuid: string) => () => {
    const currentIndex = checked.findIndex((c) => c === uuid);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(uuid);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    setSelectedPointsUuid(newChecked);
  };

  return (
    <div>
      <List style={{ overflowY: "scroll", maxHeight: "50vh" }}>
        {points.map((point) => (
          <ListItem key={point.uuid} disablePadding>
            <ListItemButton
              disabled={false}
              role={undefined}
              onClick={handleToggle(point.uuid)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.some((c) => c === point.uuid)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": `checkbox-list-label-${point.uuid}`,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={`checkbox-list-label-${point.uuid}`}
                primary={`Point ${point.orderNr}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

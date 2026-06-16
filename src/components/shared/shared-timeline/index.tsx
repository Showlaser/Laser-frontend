import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Box,
  Grid,
  IconButton,
  Input,
  InputLabel,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  numberOfTimeLines,
  selectableSteps,
  timelineItemWidthWhenDurationIsZero,
  timelineNumbersHeight,
} from "services/shared/config";
import { mapNumber, normalize, numberIsBetweenOrEqual } from "services/shared/math";
import { drawLine, drawRoundedRectangleWithText, writeText } from "../canvas-helper";

export type SharedTimelineItem = {
  uuid: string;
  name: string;
  startTime: number;
  duration: number;
  timelineId: number;
};

type DragState = {
  uuid: string;
  startMouseX: number;
  startMouseY: number;
  originalStartTime: number;
  previewStartTime: number;
  previewTimelineId: number;
  hasMoved: boolean;
};

const timelineShortcuts: [string, string][] = [
  ["Drag", "Move an item in time or to another row"],
  ["Click", "Select an item"],
  ["Right-click", "Open the item menu"],
  ["Middle-click", "Delete an item"],
  ["Scroll", "Pan the timeline"],
  ["← / →", "Nudge the selected item by 10ms"],
];

export type SharedTimelineProps = {
  selectedItemUuid: string;
  onTimelineItemClick: (clickedUuid: string) => void;
  play: boolean;
  setPlay: (play: boolean) => void;
  timelinePositionMs: number;
  setTimelinePositionMs: (ms: number) => void;
  totalDuration: number;
  selectableStepsIndex: number;
  setSelectableStepsIndex: (steps: number) => void;
  timelineItems: SharedTimelineItem[];
  onTimelineItemDelete?: (uuid: string) => void;
  onMoveTimelineItem?: (forward: boolean) => void;
  onTimelineItemMove?: (uuid: string, newStartTimeMs: number, newTimelineId: number) => void;
};

export function SharedTimeline({
  selectedItemUuid,
  onTimelineItemClick,
  play,
  setPlay,
  timelinePositionMs,
  setTimelinePositionMs,
  totalDuration,
  selectableStepsIndex,
  setSelectableStepsIndex,
  timelineItems,
  onTimelineItemDelete,
  onMoveTimelineItem,
  onTimelineItemMove,
}: SharedTimelineProps) {
  const canvasHeight = window.innerHeight / 6;
  const canvasWidth = window.innerWidth - 60;
  const timelineItemHeightOnCanvas = (canvasHeight - 40) / numberOfTimeLines;
  const stepsToDrawMaxRange = (timelinePositionMs + selectableSteps[selectableStepsIndex] * 10) | 0;

  const getTimelineData = () => {
    const generatedTimeline = [];
    for (let i = 0; i < numberOfTimeLines; i++) {
      generatedTimeline[i] = {
        id: i,
        hidden: false,
        timelineCenterY:
          Math.floor(canvasHeight / numberOfTimeLines / 2) +
          (i * canvasHeight) / numberOfTimeLines +
          5,
      };
    }

    return generatedTimeline;
  };

  const [screenWidthPx, setScreenWidthPx] = useState<number>(window.innerWidth);
  const [screenHeightPx, setScreenHeightPx] = useState<number>(window.innerHeight);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [helpAnchorEl, setHelpAnchorEl] = useState<null | HTMLElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    uuid: string;
  } | null>(null);
  const timelines = getTimelineData();

  const getMousePosition = (e: React.MouseEvent) => {
    const canvas = document.getElementById("timeline-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const pixelsToMs = (deltaPx: number) =>
    (deltaPx * selectableSteps[selectableStepsIndex]) / (canvasWidth / 10);

  useEffect(() => {
    const canvas = document.getElementById("timeline-canvas") as HTMLCanvasElement;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    draw(ctx);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- redraw on the listed view deps only
  }, [
    screenWidthPx,
    screenHeightPx,
    timelinePositionMs,
    selectedItemUuid,
    selectableStepsIndex,
    timelineItems,
    dragState,
  ]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, ctx.canvas.height);
    drawTimeLines(ctx);
    drawTimelineItems();
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidthPx(window.innerWidth);
      setScreenHeightPx(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const drawTimeLines = (ctx: CanvasRenderingContext2D) => {
    const numberOfTimeLines = timelines.length;
    for (let i = 0; i < numberOfTimeLines; i++) {
      const y =
        (canvasHeight - timelineNumbersHeight) / numberOfTimeLines +
        (i * (canvasHeight - timelineNumbersHeight)) / numberOfTimeLines;
      drawLine(0, y, screenWidthPx, y, ctx);
    }

    const selectedStep = selectableSteps[selectableStepsIndex];
    const distanceBetweenSteps = canvasWidth / timelineNumbersHeight - 2;

    for (let i = 0; i < selectedStep + 1; i++) {
      const x = i * distanceBetweenSteps;
      writeText(
        x,
        canvasHeight - 1,
        (timelinePositionMs + i * selectedStep).toString(),
        "whitesmoke",
        ctx,
        10,
      );
    }
  };

  const getTimelineItemFromMouseClick = (x: number, y: number): SharedTimelineItem | undefined => {
    const numberOfTimeLines = timelines.length;
    const timelineIdPressed = getTimelineIdPressed(
      numberOfTimeLines,
      canvasHeight,
      y,
      timelineItemHeightOnCanvas,
    );
    if (timelineIdPressed === undefined) {
      return undefined;
    }

    const xMappedToTimelinePosition = mapNumber(
      x,
      0,
      canvasWidth,
      timelinePositionMs,
      stepsToDrawMaxRange,
    );
    return timelineItems.find((ti) => {
      const endTime =
        ti.startTime +
        (ti.duration === 0 ? timelineItemWidthWhenDurationIsZero : ti.duration);
      return (
        numberIsBetweenOrEqual(xMappedToTimelinePosition, ti.startTime, endTime) &&
        ti.timelineId === timelineIdPressed
      );
    });
  };

  const getItemsToDrawInTimeline = (): SharedTimelineItem[] => {
    return timelineItems.filter((ti) => {
      const itemStartsBeforeTimeline = ti.startTime < timelinePositionMs;
      const itemEndsAfterStepsToDraw = ti.startTime + ti.duration > stepsToDrawMaxRange;
      const itemStartsInTimelineRange = numberIsBetweenOrEqual(
        ti.startTime,
        timelinePositionMs,
        stepsToDrawMaxRange,
      );

      const patternEndsInTimelineRange = numberIsBetweenOrEqual(
        ti.startTime + ti.duration,
        timelinePositionMs,
        stepsToDrawMaxRange,
      );

      return (
        (itemStartsBeforeTimeline && itemEndsAfterStepsToDraw) ||
        (itemStartsInTimelineRange && itemEndsAfterStepsToDraw) ||
        (itemStartsInTimelineRange && patternEndsInTimelineRange) ||
        (itemStartsBeforeTimeline && patternEndsInTimelineRange)
      );
    });
  };

  const drawTimelineItems = () => {
    const canvas = document.getElementById("timeline-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const timelineItemsInRange = getItemsToDrawInTimeline();
    // Keep the dragged item visible even when its preview leaves the range.
    const draggedItem =
      dragState !== null ? timelineItems.find((ti) => ti.uuid === dragState.uuid) : undefined;
    if (
      draggedItem !== undefined &&
      !timelineItemsInRange.some((ti) => ti.uuid === draggedItem.uuid)
    ) {
      timelineItemsInRange.push(draggedItem);
    }

    if (timelineItemsInRange.length === 0) {
      return;
    }

    const numberOfTimeLines = timelines.length;
    for (let i = 0; i < timelineItemsInRange.length; i++) {
      const timelineItem = timelineItemsInRange[i];
      const isDragged = dragState?.uuid === timelineItem.uuid;
      const itemStartTime = isDragged ? dragState.previewStartTime : timelineItem.startTime;
      const itemTimelineId = isDragged ? dragState.previewTimelineId : timelineItem.timelineId;

      const y =
        ((canvasHeight - timelineNumbersHeight) / numberOfTimeLines) * (itemTimelineId ?? 0);

      // Use a local minimum width so zero-duration items stay clickable
      // without mutating the shared timeline item data.
      const itemDuration =
        timelineItem.duration === 0
          ? timelineItemWidthWhenDurationIsZero
          : timelineItem.duration;

      const widthToDisplay =
        (canvasWidth / 10) * (itemDuration / selectableSteps[selectableStepsIndex]);
      const xPosition =
        (canvasWidth / 10) *
        ((itemStartTime - timelinePositionMs) / selectableSteps[selectableStepsIndex]);

      const rectangleColor =
        selectedItemUuid === timelineItem.uuid || isDragged ? "#6370c2" : "#485cdb";
      drawRoundedRectangleWithText(
        xPosition,
        y + 5,
        widthToDisplay,
        timelineItemHeightOnCanvas,
        `${timelineItem?.name}`,
        "white",
        rectangleColor,
        ctx,
      );
    }
  };

  const getTimelineIdPressed = (
    numberOfTimeLines: number,
    canvasHeight: number,
    y: number,
    animationPatternHeightOnCanvas: number,
  ) => {
    for (let i = 0; i < numberOfTimeLines; i++) {
      const timelineCanvasYPosition =
        (canvasHeight - timelineNumbersHeight) / numberOfTimeLines +
        (i * (canvasHeight - timelineNumbersHeight)) / numberOfTimeLines;

      const yPositionIsInTimeline = numberIsBetweenOrEqual(
        y,
        timelineCanvasYPosition - animationPatternHeightOnCanvas - 5,
        timelineCanvasYPosition,
      );
      if (yPositionIsInTimeline) {
        return i;
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onMoveTimelineItem?.(true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onMoveTimelineItem?.(false);
    }
  };

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getMousePosition(e);

    // Middle mouse button deletes the item under the cursor.
    if (e.button === 1) {
      e.preventDefault();
      const clickedTimelineItem = getTimelineItemFromMouseClick(x, y);
      if (clickedTimelineItem !== undefined) {
        onTimelineItemDelete?.(clickedTimelineItem.uuid);
      }
      return;
    }

    if (e.button !== 0) {
      return;
    }

    const clickedTimelineItem = getTimelineItemFromMouseClick(x, y);
    if (clickedTimelineItem === undefined) {
      return;
    }

    setDragState({
      uuid: clickedTimelineItem.uuid,
      startMouseX: x,
      startMouseY: y,
      originalStartTime: clickedTimelineItem.startTime,
      previewStartTime: clickedTimelineItem.startTime,
      previewTimelineId: clickedTimelineItem.timelineId,
      hasMoved: false,
    });
  };

  const onCanvasMouseMove = (e: React.MouseEvent) => {
    const canvas = document.getElementById("timeline-canvas") as HTMLCanvasElement;
    const { x, y } = getMousePosition(e);

    if (dragState === null) {
      canvas.style.cursor =
        getTimelineItemFromMouseClick(x, y) !== undefined ? "grab" : "default";
      return;
    }

    canvas.style.cursor = "grabbing";
    const newStartTimeMs = Math.max(
      0,
      Math.round((dragState.originalStartTime + pixelsToMs(x - dragState.startMouseX)) / 10) * 10,
    );
    const timelineIdUnderMouse = getTimelineIdPressed(
      timelines.length,
      canvasHeight,
      y,
      timelineItemHeightOnCanvas,
    );
    const hasMoved =
      dragState.hasMoved ||
      Math.abs(x - dragState.startMouseX) > 3 ||
      Math.abs(y - dragState.startMouseY) > 3;

    setDragState({
      ...dragState,
      previewStartTime: newStartTimeMs,
      previewTimelineId: timelineIdUnderMouse ?? dragState.previewTimelineId,
      hasMoved,
    });
  };

  const onCanvasMouseUp = () => {
    if (dragState === null) {
      return;
    }

    const { uuid, hasMoved, previewStartTime, previewTimelineId } = dragState;
    setDragState(null);

    // A press without movement is a plain selection click.
    if (!hasMoved) {
      onTimelineItemClick(uuid);
      return;
    }

    onTimelineItemMove?.(uuid, previewStartTime, previewTimelineId);
  };

  const onCanvasMouseLeave = () => {
    const canvas = document.getElementById("timeline-canvas") as HTMLCanvasElement;
    canvas.style.cursor = "default";
    if (dragState !== null) {
      setDragState(null);
    }
  };

  const onCanvasContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const { x, y } = getMousePosition(e);
    const clickedTimelineItem = getTimelineItemFromMouseClick(x, y);
    if (clickedTimelineItem === undefined) {
      setContextMenu(null);
      return;
    }

    onTimelineItemClick(clickedTimelineItem.uuid);
    setContextMenu({ mouseX: e.clientX, mouseY: e.clientY, uuid: clickedTimelineItem.uuid });
  };

  const onScroll = (e: React.WheelEvent) => {
    if (e === undefined) {
      return;
    }

    if (e.deltaY === 100 && timelinePositionMs - selectableSteps[selectableStepsIndex] >= 0) {
      // scroll down
      setTimelinePositionMs(timelinePositionMs - selectableSteps[selectableStepsIndex]);
    }
    if (e.deltaY === -100) {
      setTimelinePositionMs(timelinePositionMs + selectableSteps[selectableStepsIndex]);
    }
  };

  return (
    <Paper style={{ marginTop: "25px" }}>
      <Grid container direction="row" sx={{ padding: "10px" }}>
        <Grid item>
          <InputLabel id="timeline-position-ms">Timeline position (ms)</InputLabel>
          <Input
            id="timeline-position-ms"
            value={timelinePositionMs}
            onKeyDown={(e) => e.preventDefault()}
            onChange={(e) => setTimelinePositionMs(Number(e.target.value))}
            type="number"
            inputProps={{
              min: 0,
              step: selectableSteps[selectableStepsIndex],
              max: 1000000,
            }}
          />
        </Grid>
        <Grid item ml={1.5}>
          <InputLabel id="steps-select">Steps (ms)</InputLabel>
          <Select
            labelId="steps-select"
            value={selectableStepsIndex}
            onChange={(e) => setSelectableStepsIndex(Number(e.target.value))}
          >
            {selectableSteps.map((step, index) => (
              <MenuItem key={step} value={index} selected={index === selectableStepsIndex}>
                {step}
              </MenuItem>
            ))}
          </Select>
          <span style={{ marginLeft: "5px" }}>
            <Tooltip title="Reset timeline position to 0">
              <span>
                <IconButton onClick={() => setTimelinePositionMs(0)}>
                  <RestartAltIcon />
                </IconButton>
              </span>
            </Tooltip>
          </span>
          <span>
            {play ? (
              <Tooltip title="Pause animation">
                <span>
                  <IconButton onClick={() => setPlay(false)}>
                    <PauseIcon />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Start animation">
                <span>
                  <IconButton onClick={() => setPlay(true)}>
                    <PlayArrowIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </span>
          <Tooltip title="Timeline controls help">
            <IconButton onClick={(e) => setHelpAnchorEl(e.currentTarget)}>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(helpAnchorEl)}
            anchorEl={helpAnchorEl}
            onClose={() => setHelpAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Box sx={{ p: 2, maxWidth: 300 }}>
              <Typography variant="subtitle2" gutterBottom>
                Timeline controls
              </Typography>
              {timelineShortcuts.map(([key, description]) => (
                <Box key={key} sx={{ display: "flex", gap: 1, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "92px" }}>
                    {key}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Popover>
        </Grid>
      </Grid>
      <canvas
        onWheel={onScroll}
        id="timeline-canvas"
        onKeyDown={onKeyDown}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
        onMouseLeave={onCanvasMouseLeave}
        onContextMenu={onCanvasContextMenu}
        tabIndex={0}
      />
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
      >
        <MenuItem
          onClick={() => {
            if (contextMenu !== null) {
              onTimelineItemDelete?.(contextMenu.uuid);
            }
            setContextMenu(null);
          }}
        >
          <DeleteIcon fontSize="small" style={{ marginRight: "8px" }} />
          Delete
        </MenuItem>
      </Menu>
      <LinearProgress
        sx={{
          transition: "none",
        }}
        variant="determinate"
        value={
          timelinePositionMs > totalDuration ? 100 : normalize(timelinePositionMs, 0, totalDuration)
        }
      />
    </Paper>
  );
}

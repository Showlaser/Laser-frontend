import { Chip, List, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import { LasershowAnimation } from "models/components/shared/lasershow";
import { getAnimationDuration } from "services/logic/animation-logic";
import { canvasPxSize } from "services/shared/config";
import { numberIsBetweenOrEqual } from "services/shared/math";

type Props = {
  lasershowAnimations: LasershowAnimation[];
  timelinePositionMs: number;
  selectedUuid: string;
  onSelect: (uuid: string) => void;
};

/**
 * Overview of the animations that make up the lasershow. Fills the editor's
 * empty space with a sortable, jump-to list that highlights what is playing
 * at the current playhead.
 */
export default function LasershowOverview({
  lasershowAnimations,
  timelinePositionMs,
  selectedUuid,
  onSelect,
}: Props) {
  const sortedAnimations = [...lasershowAnimations].sort(
    (a, b) => a.startTimeMs - b.startTimeMs,
  );

  return (
    <Paper
      style={{
        maxHeight: canvasPxSize,
        overflowY: "auto",
        padding: "10px",
        minWidth: "220px",
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Lasershow timeline ({lasershowAnimations.length})
      </Typography>
      {sortedAnimations.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No animations added yet
        </Typography>
      ) : (
        <List dense>
          {sortedAnimations.map((lasershowAnimation) => {
            const endTimeMs =
              lasershowAnimation.startTimeMs + getAnimationDuration(lasershowAnimation.animation);
            const isPlaying = numberIsBetweenOrEqual(
              timelinePositionMs,
              lasershowAnimation.startTimeMs,
              endTimeMs,
            );

            return (
              <ListItemButton
                key={lasershowAnimation.uuid}
                selected={lasershowAnimation.uuid === selectedUuid}
                onClick={() => onSelect(lasershowAnimation.uuid)}
              >
                <ListItemText
                  primary={lasershowAnimation.name}
                  secondary={`#${lasershowAnimation.timelineId + 1} · ${
                    lasershowAnimation.startTimeMs
                  }–${endTimeMs} ms`}
                />
                {isPlaying ? <Chip label="Playing" color="primary" size="small" /> : null}
              </ListItemButton>
            );
          })}
        </List>
      )}
    </Paper>
  );
}

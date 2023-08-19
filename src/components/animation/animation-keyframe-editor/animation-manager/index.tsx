import {
  AvailablePatternsContext,
  AvailablePatternsContextType,
  SelectedAnimationContext,
  SelectedAnimationContextType,
} from "pages/animation";
import React, { useEffect } from "react";
import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { convertPatternToAnimationPattern } from "services/shared/converters";
import { Animation, AnimationPattern } from "models/components/shared/animation";
import { emptyGuid } from "services/shared/math";

export default function AnimationManager() {
  const { availablePatterns, setAvailablePatterns } = React.useContext(
    AvailablePatternsContext
  ) as AvailablePatternsContextType;

  const { selectedAnimation, setSelectedAnimation } = React.useContext(
    SelectedAnimationContext
  ) as SelectedAnimationContextType;

  useEffect(() => {}, [availablePatterns]);

  const getAvailableTimelinePositionSpot = () => {
    for (let i = 0; i < 3; i++) {
      const animationPatternWithSameTimelineId = selectedAnimation?.animationPatterns.filter(
        (ap) => ap.timelineId === i
      );
      if (animationPatternWithSameTimelineId?.length === 0) {
        return { timelineId: i, timeMs: 0 };
      }
    }

    let lastAnimationPatternsOnTimelines: AnimationPattern[] = [];
    for (let i = 0; i < 3; i++) {
      const lastAnimationPatternOnTimeline = selectedAnimation?.animationPatterns
        .filter((ap) => ap.timelineId === i)
        ?.at(-1);
      if (lastAnimationPatternOnTimeline !== undefined) {
        lastAnimationPatternsOnTimelines.push(lastAnimationPatternOnTimeline);
      }
    }

    lastAnimationPatternsOnTimelines.sort((a, b) => a.getDuration + a.startTimeMs - b.getDuration + b.startTimeMs);
    return {
      timelineId: lastAnimationPatternsOnTimelines[0].timelineId,
      timeMs: lastAnimationPatternsOnTimelines[0].startTimeMs,
    };
  };

  const addAnimationPatternToAnimation = (selectedUuid: string) => {
    if (selectedAnimation === null) {
      return;
    }

    let updatedAnimation: Animation = { ...selectedAnimation };
    const patternToAdd = availablePatterns?.find((ap) => ap.uuid === selectedUuid);
    if (patternToAdd === undefined) {
      return;
    }

    let convertedPattern = convertPatternToAnimationPattern(patternToAdd);
    const { timelineId, timeMs } = getAvailableTimelinePositionSpot();
    convertedPattern.timelineId = timelineId;
    convertedPattern.startTimeMs = timeMs;
    updatedAnimation.animationPatterns?.push(convertedPattern);
    setSelectedAnimation(updatedAnimation);
  };

  return (
    <div>
      <FormControl fullWidth>
        <FormLabel id="animation-patterns">Add animation pattern</FormLabel>
        <Select
          id="ap-selector"
          labelId="animation-patterns"
          label="Add animation pattern"
          onChange={(e) => addAnimationPatternToAnimation(e.target.value as string)}
        >
          {availablePatterns?.map((ap) => (
            <MenuItem key={`a-manager-ap-${ap.uuid}`} value={ap.uuid}>
              {ap.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

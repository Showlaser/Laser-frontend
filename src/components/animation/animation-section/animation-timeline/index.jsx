import { Slider, IconButton, Tooltip } from "@material-ui/core";
import { useEffect, useState } from "react";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { numberIsBetweenOrEqual } from "services/shared/math";

export default function AnimationTimeline(props) {
  const [sliderMaxValue, setSliderMaxValue] = useState(100);
  const [sliderMinValue, setSliderMinValue] = useState(0);

  const { patternAnimationSettings, setTimeLineCurrentMs, timeLineCurrentMs } =
    props;

  useEffect(() => [timeLineCurrentMs]);

  const settingsWithinRange = patternAnimationSettings?.filter((ast) =>
    numberIsBetweenOrEqual(ast?.startTime, sliderMinValue, sliderMaxValue)
  );

  const onTimelineSliderChange = (value) => {
    setTimeLineCurrentMs(value);
  };

  const onScaleSliderChange = (value) => {
    if (value === 0 && sliderMinValue !== 0) {
      const newSliderMinValue = sliderMinValue > 0 ? sliderMinValue - 100 : 0;
      const newSliderMaxValue =
        sliderMaxValue - sliderMinValue >= 100
          ? sliderMaxValue - 100
          : sliderMaxValue;

      setSliderMinValue(newSliderMinValue);
      setSliderMaxValue(newSliderMaxValue);
      setTimeLineCurrentMs(newSliderMinValue);
    } else if (value === 1) {
      const newSliderMaxValue = sliderMaxValue + 100;
      const newSliderMinValue =
        sliderMaxValue - sliderMinValue >= 100
          ? sliderMinValue + 100
          : sliderMinValue;

      setSliderMaxValue(newSliderMaxValue);
      setSliderMinValue(newSliderMinValue);
      setTimeLineCurrentMs(newSliderMinValue);
    }
  };

  const timelineSliderMarks = [
    {
      value: sliderMinValue,
      label: sliderMinValue,
    },
    {
      value: sliderMaxValue,
      label: sliderMaxValue,
    },
  ];

  return (
    <div id="animation-timeline">
      <small>Time ms</small>
      <Slider
        style={{ width: "100%" }}
        onChange={(e, value) => onTimelineSliderChange(value)}
        aria-label="Time ms"
        value={timeLineCurrentMs}
        valueLabelDisplay="auto"
        step={1}
        marks={timelineSliderMarks}
        min={sliderMinValue}
        max={sliderMaxValue}
      />
      <IconButton onClick={() => onScaleSliderChange(0)}>
        <RemoveIcon />
      </IconButton>
      <IconButton onClick={() => onScaleSliderChange(1)}>
        <AddIcon />
      </IconButton>
      <div id="animation-timeline-markers">
        {settingsWithinRange?.map((s, index) => (
          <Tooltip key={s?.uuid} className="marker" title={s?.startTime}>
            <span
              onClick={() => setTimeLineCurrentMs(s?.startTime)}
              key={`${s?.uuid}${index}`}
              style={{
                marginLeft: `${(s?.startTime - sliderMinValue) * 5.5}px`,
              }}
            >
              &#11044;
            </span>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

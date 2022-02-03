import { ButtonGroup, Slider, IconButton } from "@material-ui/core";
import { useState } from "react";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";

export default function AnimationTimeline(props) {
  const [sliderMaxValue, setSliderMaxValue] = useState(100);
  const [sliderMinValue, setSliderMinValue] = useState(0);

  const { patternAnimations, setTimeLineCurrentMs } = props;

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
    } else if (value === 1) {
      const newSliderMaxValue = sliderMaxValue + 100;
      const newSliderMinValue =
        sliderMaxValue - sliderMinValue >= 100
          ? sliderMinValue + 100
          : sliderMinValue;

      setSliderMaxValue(newSliderMaxValue);
      setSliderMinValue(newSliderMinValue);
    }
    setTimeLineCurrentMs(value);
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
      <ButtonGroup>
        <small>Time ms</small>
        <Slider
          onChange={(e, value) => onTimelineSliderChange(value)}
          aria-label="Time ms"
          defaultValue={0}
          valueLabelDisplay="auto"
          step={1}
          marks={timelineSliderMarks}
          min={sliderMinValue}
          max={sliderMaxValue}
        />
        <ButtonGroup
          size="small"
          style={{ width: "120px", marginLeft: "25px" }}
        >
          <IconButton onClick={() => onScaleSliderChange(0)}>
            <RemoveIcon />
          </IconButton>
          <IconButton onClick={() => onScaleSliderChange(1)}>
            <AddIcon />
          </IconButton>
        </ButtonGroup>
      </ButtonGroup>
      <div id="animation-timeline-markers">
        {patternAnimations?.map((ap) => (
          <p>{ap?.startTime}</p>
        ))}
      </div>
    </div>
  );
}

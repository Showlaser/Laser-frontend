import { Button, FormControl, FormLabel, Input, Slider, Tooltip } from "@mui/material";
import * as React from "react";

export type PropertyControlMark = {
  value: number;
  label: string;
};

export type PropertyControlProps = {
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  id?: string;
  disabled?: boolean;
  /** Render the numeric input field (default true) */
  showInput?: boolean;
  /** Render the slider (default false) */
  showSlider?: boolean;
  sliderMarks?: PropertyControlMark[];
  /** When provided a "Reset" button is shown that calls this handler */
  onReset?: () => void;
  /** When provided the user is asked to confirm before the reset runs */
  resetConfirmMessage?: string;
  /** Wraps the control in a tooltip (handy for explaining disabled state) */
  tooltip?: string;
  /** Extra controls rendered in the label row, e.g. a lock toggle */
  labelAdornment?: React.ReactNode;
  /** Extra controls rendered next to the input, e.g. keyframe navigation */
  endAdornment?: React.ReactNode;
  /** Tighter spacing for use in dense side panels */
  dense?: boolean;
};

/**
 * Shared control for a single numeric property (scale, offset, rotation, ...).
 * Combines an optional label/reset, a numeric input and an optional slider so
 * the pattern, animation and lasershow editors render these the same way.
 */
export default function PropertyControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  id,
  disabled = false,
  showInput = true,
  showSlider = false,
  sliderMarks,
  onReset,
  resetConfirmMessage,
  tooltip,
  labelAdornment,
  endAdornment,
  dense = false,
}: PropertyControlProps) {
  const handleReset = () => {
    if (onReset === undefined) {
      return;
    }

    if (resetConfirmMessage !== undefined && !window.confirm(resetConfirmMessage)) {
      return;
    }

    onReset();
  };

  const labelStyle = dense
    ? { fontSize: "0.75rem", marginTop: "4px", marginBottom: "-2px" }
    : undefined;

  const control = (
    <FormControl style={{ width: "100%" }} disabled={disabled}>
      <FormLabel htmlFor={id} disabled={disabled} style={labelStyle}>
        {label}
        {onReset !== undefined ? (
          <Button
            size="small"
            disabled={disabled}
            style={{ marginLeft: "10px" }}
            onClick={handleReset}
          >
            Reset
          </Button>
        ) : null}
        {labelAdornment}
      </FormLabel>
      {showInput ? (
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <Input
            id={id}
            size="small"
            type="number"
            value={value ?? ""}
            disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value))}
            inputProps={{ min, max, step: step ?? 1 }}
          />
          {endAdornment}
        </div>
      ) : (
        endAdornment
      )}
      {showSlider ? (
        <Slider
          size="small"
          aria-label={label}
          value={typeof value === "number" ? value : min}
          disabled={disabled}
          onChange={(_, newValue) => onChange(Number(newValue))}
          min={min}
          max={max}
          step={step}
          marks={sliderMarks}
          valueLabelDisplay="auto"
        />
      ) : null}
    </FormControl>
  );

  return tooltip !== undefined ? (
    <Tooltip placement="right" title={tooltip}>
      <span>{control}</span>
    </Tooltip>
  ) : (
    control
  );
}

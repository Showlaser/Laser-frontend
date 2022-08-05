import * as React from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Input,
  Slider,
} from "@mui/material";
import SelectList from "components/select-list";

type GeneralSectionProps = {
  scale: number;
  setScale: (value: number) => void;
  numberOfPoints: number;
  setNumberOfPoints: (value: number) => void;
  xOffset: number;
  setXOffset: (value: number) => void;
  yOffset: number;
  setYOffset: (value: number) => void;
  rotation: number;
  setRotation: (value: number) => void;
  connectDots: boolean;
  setConnectDots: (value: boolean) => void;
  showPointNumber: boolean;
  setShowPointNumber: (value: boolean) => void;
};

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
}: GeneralSectionProps) {
  return <div></div>;
}

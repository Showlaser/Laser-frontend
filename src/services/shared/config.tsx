export const canvasPxSize = window.innerHeight / 1.9;
export const timelineItemWidthWhenDurationIsZero = 10; // Used to prevent the pattern from rendering 0px width, so you can still click it

// timelines
export const numberOfTimeLines = 3;
export const selectableSteps = [10, 100, 1000, 10000];
export const canvasHeight = window.innerHeight / 6;
export const canvasWidth = window.innerWidth - 60;
export const timelineNumbersHeight = 10;
export const xCorrection = [20, 350, 3000, 8000];
export const timelineItemHeightOnCanvas = (canvasHeight - 40) / numberOfTimeLines;

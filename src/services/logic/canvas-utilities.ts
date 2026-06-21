/**
 * Canvas utilities for drawing operations
 * Pure functions for canvas setup and calculations
 */

/**
 * Prepares a canvas for drawing by setting dimensions and clearing
 *
 * @param canvas - HTML Canvas element
 * @param width - Canvas width in pixels
 * @param height - Canvas height in pixels
 * @returns Canvas context for drawing
 */
export const setupCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D => {
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width.toString();
  canvas.style.height = height.toString();

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return ctx;
};

/**
 * Draws a line on the canvas between two points
 *
 * @param x1 - Start X coordinate
 * @param y1 - Start Y coordinate
 * @param x2 - End X coordinate
 * @param y2 - End Y coordinate
 * @param ctx - Canvas rendering context
 * @param color - Line color (default: 'white')
 * @param width - Line width in pixels (default: 1)
 */
export const drawLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  ctx: CanvasRenderingContext2D,
  color: string = "white",
  width: number = 1,
): void => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

/**
 * Draws a circle on the canvas
 *
 * @param x - Center X coordinate
 * @param y - Center Y coordinate
 * @param radius - Circle radius in pixels
 * @param ctx - Canvas rendering context
 * @param fillColor - Fill color
 * @param strokeColor - Stroke color (default: undefined, no stroke)
 */
export const drawCircle = (
  x: number,
  y: number,
  radius: number,
  ctx: CanvasRenderingContext2D,
  fillColor: string,
  strokeColor?: string,
): void => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = fillColor;
  ctx.fill();

  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }
};

/**
 * Draws text on the canvas
 *
 * @param x - Text X coordinate
 * @param y - Text Y coordinate
 * @param text - Text to draw
 * @param ctx - Canvas rendering context
 * @param color - Text color (default: 'white')
 * @param font - Font string (default: '12px sans-serif')
 * @param align - Text alignment (default: 'left')
 */
export const drawText = (
  x: number,
  y: number,
  text: string,
  ctx: CanvasRenderingContext2D,
  color: string = "white",
  font: string = "12px sans-serif",
  align: CanvasTextAlign = "left",
): void => {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
};

/**
 * Draws a rectangle on the canvas
 *
 * @param x - Top-left X coordinate
 * @param y - Top-left Y coordinate
 * @param width - Rectangle width
 * @param height - Rectangle height
 * @param ctx - Canvas rendering context
 * @param fillColor - Fill color
 * @param strokeColor - Stroke color (optional)
 */
export const drawRectangle = (
  x: number,
  y: number,
  width: number,
  height: number,
  ctx: CanvasRenderingContext2D,
  fillColor: string,
  strokeColor?: string,
): void => {
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, width, height);

  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.strokeRect(x, y, width, height);
  }
};

/**
 * Calculates the width of text when rendered with specified font
 *
 * @param text - Text to measure
 * @param ctx - Canvas rendering context
 * @param font - Font string (default: '12px sans-serif')
 * @returns Width in pixels
 */
export const measureTextWidth = (
  text: string,
  ctx: CanvasRenderingContext2D,
  font: string = "12px sans-serif",
): number => {
  ctx.font = font;
  return ctx.measureText(text).width;
};

/**
 * Clears a specific region of the canvas
 *
 * @param x - Top-left X coordinate
 * @param y - Top-left Y coordinate
 * @param width - Region width
 * @param height - Region height
 * @param ctx - Canvas rendering context
 */
export const clearCanvasRegion = (
  x: number,
  y: number,
  width: number,
  height: number,
  ctx: CanvasRenderingContext2D,
): void => {
  ctx.clearRect(x, y, width, height);
};

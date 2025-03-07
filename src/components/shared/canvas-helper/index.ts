export const drawLine = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  ctx: CanvasRenderingContext2D,
  color: string = "rgb(90, 90, 90, 0.7)"
) => {
  ctx.lineWidth = 1;
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = color;
  ctx.stroke();
};

export const writeText = (
  x: number,
  y: number,
  text: string,
  textColor: string,
  ctx: CanvasRenderingContext2D,
  fontSize: number = 12
) => {
  ctx.beginPath();
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = textColor;
  ctx.fillText(text, x, y);
};

export const drawRoundedRectangleWithText = (
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
  textColor: string,
  rectangleColor: string,
  ctx: CanvasRenderingContext2D
) => {
  ctx.beginPath();
  ctx.lineWidth = 6;
  ctx.fillStyle = rectangleColor;
  ctx.roundRect(x, y, width, height, 2);
  ctx.fill();

  const textLength = text.length;
  writeText(5 + x + textLength / 3, y + height / 1.75, text, textColor, ctx);
};

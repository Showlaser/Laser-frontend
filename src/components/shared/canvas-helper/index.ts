export const drawLine = (fromX: number, fromY: number, toX: number, toY: number, ctx: CanvasRenderingContext2D) => {
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = "rgb(90, 90, 90, 0.7)";
  ctx.stroke();
};

export const writeText = (x: number, y: number, text: string, ctx: CanvasRenderingContext2D, fontSize: number = 12) => {
  ctx.beginPath();
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = "whitesmoke";
  ctx.fillText(text, x, y);
};

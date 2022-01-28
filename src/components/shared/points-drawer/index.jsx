import { Box } from "@material-ui/core";
import { useEffect } from "react";
import { getMappedRgbStringFromPoint } from "services/shared/general";
import { mapNumber } from "services/shared/math";
import "./index.css";

export default function PointsDrawer(props) {
  const { points } = props;

  useEffect(() => {
    drawPattern();
  }, [points]);

  const drawPattern = () => {
    const length = points?.length;
    if (points === undefined || length === 0) {
      return;
    }

    let c = document.getElementById("pattern-canvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();

    for (let i = 0; i < length; i++) {
      const point = points[i];
      drawDot(ctx, point);
    }
    ctx.stroke();
  };

  const drawDot = (ctx, point) => {
    const { x, y } = point;

    ctx.fillStyle = getMappedRgbStringFromPoint(point);
    ctx.fillRect(
      mapNumber(x, 4000, -4000, 395, 0),
      mapNumber(y, 4000, -4000, 0, 395),
      4,
      4
    );
  };

  return (
    <Box id="points-drawer" component="div" display="inline-block">
      <canvas height="400px" width="400px" id="pattern-canvas" />
    </Box>
  );
}

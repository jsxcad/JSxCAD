import { concatenatePath, rotateZPath } from '@jsxcad/geometry';

import { Shape } from './Shape.js';
import { seq } from './seq.js';

export const Spiral = (
  toPathFromTurn = (turn) => [[turn]],
  { from, by, to, upto, downto, close = false } = {}
) => {
  let path = [];
  for (const turn of seq(
    {
      from,
      by,
      to,
      upto,
      downto,
    },
    (turn) => turn,
    (...numbers) => numbers
  )()) {
    const radians = -turn * Math.PI * 2;
    const subpath = toPathFromTurn(turn);
    path = concatenatePath(path, rotateZPath(radians, subpath));
  }
  const segments = [];
  let last;
  if (!path[0]) {
    path.shift();
  }
  for (const point of path) {
    if (last) {
      segments.push([last, point]);
    }
    last = point;
  }
  if (last && close) {
    segments.push([last, path[0]]);
  }
  return Shape.fromSegments(segments);
};

export default Spiral;

Shape.prototype.Spiral = Shape.shapeMethod(Spiral);

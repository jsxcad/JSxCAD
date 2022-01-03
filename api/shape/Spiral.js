import { concatenatePath, rotateZPath } from '@jsxcad/geometry';

import { Shape } from './Shape.js';
import { seq } from './seq.js';

export const Spiral = (
  toPathFromTurn = (turn) => [[turn]],
  { from, by, to, upto, downto } = {}
) => {
  let path = [null];
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
  return Shape.fromPath(path);
};

export default Spiral;

Shape.prototype.Spiral = Shape.shapeMethod(Spiral);

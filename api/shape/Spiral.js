import { concatenatePath, rotateZPath } from '@jsxcad/geometry';

import { Shape } from './Shape.js';
import { seq } from '@jsxcad/api-v1-math';

export const Spiral = (
  toPathFromTurn = (turn) => [[turn]],
  { from, by, to, upto, downto } = {}
) => {
  let path = [null];
  for (const turn of seq((turn) => turn, {
    from,
    by,
    to,
    upto,
    downto,
  })) {
    const radians = -turn * Math.PI * 2;
    const subpath = toPathFromTurn(turn);
    path = concatenatePath(path, rotateZPath(radians, subpath));
  }
  return Shape.fromPath(path);
};

export default Spiral;

Shape.prototype.Spiral = Shape.shapeMethod(Spiral);

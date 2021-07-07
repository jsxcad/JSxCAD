import {
  getAngle,
  getAt,
  getCorner1,
  getCorner2,
  getFrom,
  getMatrix,
  getScale,
  getSides,
  getTo,
} from './Plan.js';
import { registerReifier, taggedPlan } from '@jsxcad/geometry';

import Shape from './Shape.js';
import Spiral from './Spiral.js';
import { negate } from '@jsxcad/math-vec3';

const Z = 2;

registerReifier('Arc', (geometry) => {
  let { start = 0, end = 1 } = getAngle(geometry);

  while (start > end) {
    start -= 1;
  }

  const [scale, middle] = getScale(geometry);
  const corner1 = getCorner1(geometry);
  const corner2 = getCorner2(geometry);
  const top = corner2[Z];
  const bottom = corner1[Z];
  const step = 1 / getSides(geometry, 32);
  const steps = Math.ceil((end - start) / step);
  const effectiveStep = (end - start) / steps;

  // FIX: corner1 is not really right.
  if (end - start === 1) {
    return Spiral((a) => [[1]], {
      from: start - 1 / 4,
      upto: end - 1 / 4,
      by: effectiveStep,
    })
      .scale(...scale)
      .move(...middle)
      .close()
      .fill()
      .ex(top, bottom)
      .orient({
        center: negate(getAt(geometry)),
        from: getFrom(geometry),
        at: getTo(geometry),
      })
      .transform(getMatrix(geometry))
      .setTags(geometry.tags)
      .toGeometry();
  } else {
    return Spiral((a) => [[1]], {
      from: start - 1 / 4,
      to: end - 1 / 4,
      by: effectiveStep,
    })
      .scale(...scale)
      .move(...middle)
      .move(...getAt(geometry))
      .transform(getMatrix(geometry))
      .setTags(geometry.tags)
      .toGeometry();
  }
});

export const Arc = (x = 1, y = x, z = 0) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Arc' })).hasDiameter(x, y, z);

Shape.prototype.Arc = Shape.shapeMethod(Arc);

export default Arc;

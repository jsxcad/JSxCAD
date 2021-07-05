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
  let { start = 0, end = 360 } = getAngle(geometry);

  while (start > end) {
    start -= 360;
  }

  const [scale, middle] = getScale(geometry);
  const corner1 = getCorner1(geometry);
  const corner2 = getCorner2(geometry);
  const top = corner2[Z];
  const bottom = corner1[Z];
  const step = 360 / getSides(geometry, 32);
  const steps = Math.ceil((end - start) / step);
  const effectiveStep = (end - start) / steps;

  // FIX: corner1 is not really right.
  if (end - start === 360) {
    return Spiral((a) => [[1]], {
      from: start - 90,
      upto: end - 90,
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
      from: start - 90,
      to: end - 90,
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

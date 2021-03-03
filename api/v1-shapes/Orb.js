import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import {
  getAt,
  getFrom,
  getMatrix,
  getScale,
  getSides,
  getTo,
} from './plan.js';

import { registerReifier, taggedPlan } from '@jsxcad/geometry-tagged';

import { buildRingSphere } from '@jsxcad/algorithm-shape';
import { negate } from '@jsxcad/math-vec3';

registerReifier('Orb', ({ tags, plan }) => {
  const [scale, middle] = getScale(plan);
  return Shape.fromPolygons(buildRingSphere(getSides(plan, 16)))
    .scale(...scale)
    .move(...middle)
    .orient({
      center: negate(getAt(plan)),
      from: getFrom(plan),
      at: getTo(plan),
    })
    .transform(getMatrix(plan))
    .setTags(tags)
    .toGeometry();
});

export const Orb = (x = 1, y = x, z = x) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Orb' })).diameter(x, y, z);

Shape.prototype.Orb = shapeMethod(Orb);

export default Orb;

import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  getBase,
  getCenter,
  getFrom,
  getRadius,
  getSides,
  getTo,
} from '@jsxcad/geometry-plan';
import { registerReifier, taggedPlan, taggedSolid } from '@jsxcad/geometry-tagged';

import { buildRingSphere } from '@jsxcad/algorithm-shape';

const Z = 2;

registerReifier('Orb', ({ tags, plan }) =>
  Shape.fromGeometry(taggedSolid({}, buildRingSphere(getSides(plan, 16))))
    .toGraph()
    .scale(...getRadius(plan))
    .z(getRadius(plan)[Z] + getBase(plan))
    .orient({ center: getCenter(plan), from: getFrom(plan), at: getTo(plan) })
    .setTags(tags)
    .toGeometry());

export const Orb = (x = 1, y = x, z = x) =>
  Shape.fromGeometry(taggedPlan({}, { diameter: [x, y, z], type: 'Orb' }));

Shape.prototype.Orb = shapeMethod(Orb);

export default Orb;

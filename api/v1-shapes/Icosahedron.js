import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  getBase,
  getCenter,
  getFrom,
  getRadius,
  getTo,
} from '@jsxcad/geometry-plan';
import { registerReifier, taggedPlan } from '@jsxcad/geometry-tagged';

import { buildRegularIcosahedron } from '@jsxcad/algorithm-shape';

const Z = 2;

registerReifier('Icosahedron', ({ tags, plan }) =>
  Shape.fromPolygonsToSolid(buildRegularIcosahedron({}))
    .toGraph()
    .scale(...getRadius(plan))
    .z(getRadius(plan)[Z] + getBase(plan))
    .orient({ center: getCenter(plan), from: getFrom(plan), at: getTo(plan) })
    .setTags(tags)
    .toGeometry()
);

export const Icosahedron = (x = 1, y = x, z = x) =>
  Shape.fromGeometry(
    taggedPlan({}, { diameter: [x, y, z], type: 'Icosahedron' })
  );

export default Icosahedron;

Shape.prototype.Icosahedron = shapeMethod(Icosahedron);

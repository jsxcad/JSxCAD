import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import { getAt, getFrom, getScale, getTo } from './plan.js';
import { registerReifier, taggedPlan } from '@jsxcad/geometry-tagged';

import { buildRegularIcosahedron } from '@jsxcad/algorithm-shape';
import { negate } from '@jsxcad/math-vec3';

registerReifier('Icosahedron', ({ tags, plan }) => {
  const [scale, middle] = getScale(plan);
  return Shape.fromPolygonsToSolid(buildRegularIcosahedron({}))
    .scale(...scale)
    .move(...middle)
    .orient({
      center: negate(getAt(plan)),
      from: getFrom(plan),
      at: getTo(plan),
    })
    .setTags(tags)
    .toGeometry();
});

export const Icosahedron = (x = 1, y = x, z = x) =>
  Shape.fromGeometry(
    taggedPlan({}, { diameter: [x, y, z], type: 'Icosahedron' })
  );

export default Icosahedron;

Shape.prototype.Icosahedron = shapeMethod(Icosahedron);

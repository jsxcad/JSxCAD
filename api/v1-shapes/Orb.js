import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import {
  getAt,
  getFrom,
  getMatrix,
  getScale,
  getSides,
  getTo,
} from './Plan.js';

import { registerReifier, taggedPlan } from '@jsxcad/geometry';

import Arc from './Arc.js';
import { negate } from '@jsxcad/math-vec3';

// Approximates a UV sphere.
const extrudeSphere = (shape, height = 1, { sides = 20 } = {}) => {
  const lofts = [];

  const getEffectiveSlice = (slice) => {
    if (slice === 0) {
      return 0.5;
    } else if (slice === latitudinalResolution) {
      return latitudinalResolution - 0.5;
    } else {
      return slice;
    }
  };

  const latitudinalResolution = sides;

  for (let slice = 0; slice <= latitudinalResolution; slice++) {
    const angle =
      (Math.PI * 1.0 * getEffectiveSlice(slice)) / latitudinalResolution;
    const z = Math.cos(angle);
    const radius = Math.sin(angle);
    lofts.push((s) => s.scale(radius, radius, 1).z(z * height * 0.5));
  }
  return shape.loft(...lofts.reverse());
};

Shape.registerMethod('extrudeSphere', extrudeSphere);
Shape.registerMethod('sx', extrudeSphere);

registerReifier('Orb', (geometry) => {
  const [scale, middle] = getScale(geometry);
  const sides = getSides(geometry, 16);
  return extrudeSphere(Arc().sides(sides * 2), 1, { sides: 2 + sides })
    .scale(...scale)
    .move(...middle)
    .orient({
      center: negate(getAt(geometry)),
      from: getFrom(geometry),
      at: getTo(geometry),
    })
    .transform(getMatrix(geometry))
    .setTags(geometry.tags)
    .toGeometry();
});

export const Orb = (x = 1, y = x, z = x) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Orb' })).diameter(x, y, z);

Shape.prototype.Orb = shapeMethod(Orb);

export default Orb;

import { getScale, getSides } from './Plan.js';

import Arc from './Arc.js';
import Shape from './Shape.js';
import { taggedPlan } from '@jsxcad/geometry';

// Approximates a UV sphere.
const extrudeSphere =
  (height = 1, { sides = 20 } = {}) =>
  (shape) => {
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
      lofts.push((s) => s.scale(radius, radius, 1).z(z * height));
    }
    return shape.loft(...lofts.reverse());
  };

Shape.registerMethod('extrudeSphere', extrudeSphere);
Shape.registerMethod('sx', extrudeSphere);

Shape.registerReifier('Orb', (geometry) => {
  const [scale, middle] = getScale(geometry);
  const sides = getSides(geometry, 16);
  return extrudeSphere(1, { sides: 2 + sides })(Arc(2).hasSides(sides * 2))
    .scale(scale)
    .move(middle);
});

export const Orb = (x = 1, y = x, z = x) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Orb' })).hasDiameter(x, y, z);

Shape.prototype.Orb = Shape.shapeMethod(Orb);

export default Orb;

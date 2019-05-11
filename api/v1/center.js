import { add, negate, scale } from '@jsxcad/math-vec3';

import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { translate } from './translate';

export const center = (shape) => {
  const [minPoint, maxPoint] = measureBoundingBox(shape);
  let center = scale(0.5, add(minPoint, maxPoint));
  return translate(negate(center), shape);
};

const method = function () { return center(this); };

Shape.prototype.center = method;

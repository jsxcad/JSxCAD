import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { negate } from '@jsxcad/math-vec3';
import { translate } from './translate';

const Y = 1;

export const front = (shape) => {
  const [minPoint] = measureBoundingBox(shape);
  return translate(negate([0, minPoint[Y], 0]), shape);
};

const method = function () { return front(this); };

Shape.prototype.front = method;

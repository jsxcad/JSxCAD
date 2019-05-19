import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { negate } from '@jsxcad/math-vec3';
import { translate } from './translate';

const Z = 2;

export const above = (shape) => {
  const [minPoint] = measureBoundingBox(shape);
  return translate(negate([0, 0, minPoint[Z]]), shape);
};

const method = function () { return above(this); };

Shape.prototype.above = method;

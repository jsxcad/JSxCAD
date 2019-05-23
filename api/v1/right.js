import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { negate } from '@jsxcad/math-vec3';
import { translate } from './translate';

const X = 0;

export const right = (shape) => {
  const [minPoint] = measureBoundingBox(shape);
  return translate(negate([minPoint[X], 0, 0]), shape);
};

const method = function () { return right(this); };

Shape.prototype.right = method;

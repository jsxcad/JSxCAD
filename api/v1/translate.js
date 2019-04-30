import { Shape } from './Shape';

import { fromTranslation } from '@jsxcad/math-mat4';

export const translate = ([x = 0, y = 0, z = 0], shape) => {
  return shape.transform(fromTranslation([x, y, z]));
};

const method = function (vector) {
  return translate(vector, this);
};

Shape.prototype.translate = method;

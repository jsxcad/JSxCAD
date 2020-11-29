import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import Empty from './Empty.js';

export const Union = (first, ...rest) => {
  if (first === undefined) {
    return Empty();
  } else {
    return first.add(...rest);
  }
};

export default Union;

Shape.prototype.Union = shapeMethod(Union);

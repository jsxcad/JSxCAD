import Empty from './Empty.js';
import Shape from '@jsxcad/api-v1-shape';

export const Union = (first, ...rest) => {
  if (first === undefined) {
    return Empty();
  } else {
    return first.add(...rest);
  }
};

const UnionMethod = function (...args) {
  return Union(this, ...args);
};
Shape.prototype.Union = UnionMethod;

export default Union;

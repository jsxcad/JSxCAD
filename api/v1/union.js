import { Shape, unionLazily } from './Shape';

export const union = (...params) => {
  switch (params.length) {
    case 0: {
      return Shape.fromGeometry({ assembly: [] });
    }
    case 1: {
      return params[0];
    }
    default: {
      return unionLazily(...params);
    }
  }
};

const method = function (...shapes) { return union(this, ...shapes); };

Shape.prototype.union = method;

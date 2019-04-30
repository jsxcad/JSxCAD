import { Shape, assembleLazily } from './Shape';

export const assemble = (...params) => {
  switch (params.length) {
    case 0: {
      return Shape.fromGeometry({ assembly: [] });
    }
    case 1: {
      return params[0];
    }
    default: {
      return assembleLazily(...params);
    }
  }
};

const method = function (...shapes) { return assemble(this, ...shapes); };

Shape.prototype.assemble = method;

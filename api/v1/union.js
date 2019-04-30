import { Assembly, unionLazily } from './Assembly';
import { Paths } from './Paths';
import { Solid } from './Solid';
import { Z0Surface } from './Z0Surface';

export const union = (...params) => {
  switch (params.length) {
    case 0: {
      return Assembly.fromGeometry({ assembly: [] });
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

Assembly.prototype.union = method;
Paths.prototype.union = method;
Solid.prototype.union = method;
Z0Surface.prototype.union = method;

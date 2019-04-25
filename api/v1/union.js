import { Assembly, unionLazily } from './Assembly';
import { Paths } from './Paths';
import { Solid } from './Solid';
import { Surface } from './Surface';

export const union = (...params) => {
  switch (params.length) {
    case 0: {
      return Assembly.fromGeometry({ assembly: [] });
    }
    case 1: {
      return params[0];
    }
    default: {
console.log(`QQ/api/union: ${JSON.stringify(params)}`);
      return unionLazily(...params);
    }
  }
};

const method = function (...shapes) { return union(this, ...shapes); };

Assembly.prototype.union = method;
Paths.prototype.union = method;
Solid.prototype.union = method;
Surface.prototype.union = method;

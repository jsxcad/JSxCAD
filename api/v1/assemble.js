import { Assembly, assembleLazily } from './Assembly';
import { Paths } from './Paths';
import { Solid } from './Solid';
import { Z0Surface } from './Z0Surface';

export const assemble = (...params) => {
  switch (params.length) {
    case 0: {
      return Assembly.fromGeometry({ assembly: [] });
    }
    case 1: {
      return params[0];
    }
    default: {
console.log(`QQ/api/assemble: ${JSON.stringify(params)}`);
      return assembleLazily(...params);
    }
  }
};

const method = function (...shapes) { return assemble(this, ...shapes); };

Assembly.prototype.assemble = method;
Paths.prototype.assemble = method;
Solid.prototype.assemble = method;
Z0Surface.prototype.assemble = method;

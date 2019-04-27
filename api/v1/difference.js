import { Assembly, differenceLazily } from './Assembly';

import { Paths } from './Paths';
import { Solid } from './Solid';
import { Z0Surface } from './Z0Surface';

export const difference = (...params) => differenceLazily(...params);

const method = function (...shapes) { return difference(this, ...shapes); };

Assembly.prototype.difference = method;
Paths.prototype.difference = method;
Solid.prototype.difference = method;
Z0Surface.prototype.difference = method;

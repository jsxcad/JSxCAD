import { Assembly, intersectionLazily } from './Assembly';
import { Paths } from './Paths';
import { Solid } from './Solid';
import { Z0Surface } from './Z0Surface';

export const intersection = (...params) => intersectionLazily(...params);

const method = function (...shapes) { return intersection(this, ...shapes); };

Assembly.prototype.intersection = method;
Paths.prototype.intersection = method;
Solid.prototype.intersection = method;
Z0Surface.prototype.intersection = method;

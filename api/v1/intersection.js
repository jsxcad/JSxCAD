import { Assembly, intersectionLazily } from './Assembly';
import { Paths } from './Paths';
import { Solid } from './Solid';
import { Surface } from './Surface';

export const intersection = (...params) => intersectionLazily(...params);

const method = function (...shapes) { return intersection(this, ...shapes); };

Assembly.prototype.intersection = method;
Paths.prototype.intersection = method;
Solid.prototype.intersection = method;
Surface.prototype.intersection = method;

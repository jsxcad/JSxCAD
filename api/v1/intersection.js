import { Assembly, intersectionLazily } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { Path2D } from './Path2D';
import { flatten } from './flatten';

export const intersection = (...params) => intersectionLazily(...flatten(params));

const method = function (...shapes) { return intersection(this, ...shapes); };

Assembly.prototype.intersection = method;
CAG.prototype.intersection = method;
CSG.prototype.intersection = method;
Path2D.prototype.intersection = method;

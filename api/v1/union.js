import { Assembly, unionLazily } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { Path2D } from './Path2D';
import { flatten } from './flatten';

export const union = (...params) => unionLazily(...flatten(params));

const method = function (...shapes) { return union(this, ...shapes); };

Assembly.prototype.union = method;
CAG.prototype.union = method;
CSG.prototype.union = method;
Path2D.prototype.union = method;

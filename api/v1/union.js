import { Assembly, unionLazily } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { flatten } from './flatten';

export const union = (...params) => unionLazily(...flatten(params));

const method = function (...shapes) { return union(this, ...shapes); }

Assembly.prototype.union = union;
CAG.prototype.union = union;
CSG.prototype.union = union;

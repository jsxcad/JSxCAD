import { Assembly, differenceLazily } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { Path2D } from './Path2D';
import { flatten } from './flatten';

export const difference = (...params) => differenceLazily(...flatten(params));

const method = function (...shapes) { return difference(this, ...shapes); };

Assembly.prototype.difference = method;
CAG.prototype.difference = method;
CSG.prototype.difference = method;
Path2D.prototype.difference = method;

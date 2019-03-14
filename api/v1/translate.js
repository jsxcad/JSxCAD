import { Assembly } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { fromTranslation } from '@jsxcad/math-mat4';

export const translate = ([x = 0, y = 0, z = 0], shape) => shape.transform(fromTranslation([x, y, z]));

const method = function (vector) { return translate(vector, this); }

Assembly.prototype.translate = method;
CAG.prototype.translate = method;
CSG.prototype.translate = method;

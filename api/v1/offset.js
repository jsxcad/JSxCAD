import { Shape } from './Shape';
import { expand } from './expand';
import { outline } from './outline';

export const offset = (shape, radius = 1, resolution = 16) => outline(expand(shape, radius, resolution));

const method = function (radius, resolution) { return offset(this, radius, resolution); };
Shape.prototype.offset = method;

export default offset;

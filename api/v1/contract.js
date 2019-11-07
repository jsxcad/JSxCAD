import { Shape } from './Shape';
import { expand } from './expand';

export const contract = (shape, radius = 1, resolution = 16) => expand(shape, -radius, resolution);

const method = function (radius, resolution) { return contract(this, radius, resolution); };
Shape.prototype.contract = method;

export default contract;

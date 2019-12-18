import { Shape } from './Shape';
import { expand } from './expand';
import { outline } from './outline';

export const offset = (shape, radius = 1, resolution = 16) => outline(expand(shape, radius, resolution));

const offsetMethod = function (radius, resolution) { return offset(this, radius, resolution); };
Shape.prototype.offset = offsetMethod;

export default offset;

offset.signature = 'offset(shape:Shape, radius:number = 1, resolution:number = 16) -> Shape';
offsetMethod.signature = 'Shape -> offset(radius:number = 1, resolution:number = 16) -> Shape';

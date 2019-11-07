import { Shape } from './Shape';
import { shell } from './shell';

export const expand = (shape, radius = 1, resolution = 16) =>
  (radius >= 0) ? shape.union(shell(shape, radius, resolution))
    : shape.difference(shell(shape, -radius, resolution));

const method = function (radius, resolution) { return expand(this, radius, resolution); };
Shape.prototype.expand = method;

export default expand;

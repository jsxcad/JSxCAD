import Shape from './Shape.js';
import { taggedLayers } from '@jsxcad/geometry-tagged';

export const group = (...shapes) =>
  Shape.fromGeometry(
    taggedLayers({}, ...shapes.map((shape) => shape.toGeometry()))
  );

export const layer = group;

const groupMethod = function (...shapes) {
  return group(this, ...shapes);
};
Shape.prototype.group = groupMethod;
Shape.prototype.layer = Shape.prototype.group;
Shape.prototype.and = groupMethod;

export default group;

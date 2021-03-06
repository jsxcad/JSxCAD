import Shape from './Shape.js';
import { taggedLayers } from '@jsxcad/geometry-tagged';

export const and = (...shapes) =>
  Shape.fromGeometry(
    taggedLayers({}, ...shapes.map((shape) => shape.toGeometry()))
  );

const andMethod = function (...shapes) {
  return and(this, ...shapes);
};
Shape.prototype.and = andMethod;

export default and;

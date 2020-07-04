import Shape from './Shape.js';
import { taggedLayers } from '@jsxcad/geometry-tagged';

export const layer = (...shapes) =>
  Shape.fromGeometry(taggedLayers({}, ...shapes.map((shape) => shape.toGeometry())));

const layerMethod = function (...shapes) {
  return layer(this, ...shapes);
};
Shape.prototype.layer = layerMethod;
Shape.prototype.and = layerMethod;

export default layer;

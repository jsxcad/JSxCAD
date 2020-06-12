import Shape from "./Shape";

export const layer = (...shapes) =>
  Shape.fromGeometry({ layers: shapes.map((shape) => shape.toGeometry()) });

const layerMethod = function (...shapes) {
  return layer(this, ...shapes);
};
Shape.prototype.layer = layerMethod;
Shape.prototype.and = layerMethod;

export default layer;

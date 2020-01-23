import Shape from './Shape';

export const layer = (...shapes) => Shape.fromGeometry({ layers: shapes.map(shape => shape.toGeometry()) });

const layerMethod = function (...shapes) { return this.with(...shapes); };
Shape.prototype.layer = layerMethod;

export default layer;

import Shape from '@jsxcad/api-v1-shape';

export const Layers = (...shapes) =>
  Shape.fromGeometry({ layers: shapes.map((shape) => shape.toGeometry()) });

export default Layers;

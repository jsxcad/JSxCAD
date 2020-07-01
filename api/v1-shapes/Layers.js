import Shape from '@jsxcad/api-v1-shape';

export const Layers = (...shapes) =>
  Shape.fromGeometry({
    type: 'layers',
    content: shapes.map((shape) => shape.toGeometry()),
  });

export default Layers;

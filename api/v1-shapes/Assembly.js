import Shape from '@jsxcad/api-v1-shape';

export const Assembly = (...shapes) =>
  Shape.fromGeometry({
    type: 'assembly',
    content: shapes.map((shape) => shape.toGeometry()),
  });

export default Assembly;

import Shape from '@jsxcad/api-v1-shape';

export const Empty = (...shapes) =>
  Shape.fromGeometry({
    type: 'disjointAssembly', content: [{ type: 'solid', solid: [] }, { type: 'surface', surface: [] }, { type: 'paths', paths: [] }],
  });

export default Empty;

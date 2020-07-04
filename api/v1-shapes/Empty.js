import Shape from '@jsxcad/api-v1-shape';
import { taggedDisjointAssembly } from '@jsxcad/geometry-tagged';

export const Empty = (...shapes) =>
  Shape.fromGeometry(
    taggedDisjointAssembly(
      {},
      { type: 'solid', solid: [] },
      { type: 'surface', surface: [] },
      { type: 'paths', paths: [] }
    )
  );

export default Empty;

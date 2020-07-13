import Shape from '@jsxcad/api-v1-shape';
import { taggedDisjointAssembly } from '@jsxcad/geometry-tagged';

export const Empty = (...shapes) =>
  Shape.fromGeometry(taggedDisjointAssembly({}));

export default Empty;

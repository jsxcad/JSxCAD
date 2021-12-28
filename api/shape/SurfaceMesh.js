import Shape from './Shape.js';
import { taggedGraph } from '@jsxcad/geometry';

export const SurfaceMesh = (serializedSurfaceMesh, { isClosed = true, matrix } = {}) =>
  Shape.fromGeometry(taggedGraph({ tags: [], matrix }, { serializedSurfaceMesh, isClosed }));

export default SurfaceMesh;

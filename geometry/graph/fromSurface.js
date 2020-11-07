import { deduplicate as deduplicatePath } from '@jsxcad/geometry-path';
import { fromPolygonsToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';

const deduplicate = (surface) => surface.map(deduplicatePath);

export const fromSurface = (surface) =>
  fromSurfaceMeshLazy(fromPolygonsToSurfaceMesh(deduplicate(surface)));

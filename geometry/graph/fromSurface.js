import { deduplicate as deduplicatePath } from '@jsxcad/geometry-path';
import { fromPolygonsToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';

const deduplicate = (surface) => surface.map(deduplicatePath);

export const fromSurface = (surface) =>
  fromSurfaceMesh(fromPolygonsToSurfaceMesh(deduplicate(surface)));

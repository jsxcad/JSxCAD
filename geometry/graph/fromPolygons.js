import {
  fromPolygonsToSurfaceMesh,
  fromSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromPolygons = ({ tags }, polygons) =>
  taggedGraph({ tags }, fromSurfaceMesh(fromPolygonsToSurfaceMesh(polygons)));

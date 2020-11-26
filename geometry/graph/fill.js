import { fromPolygons } from './fromPolygons.js';
import { toTriangles } from './toTriangles.js';

// Convert an outline graph to a possibly closed surface.
export const fill = (graph) => fromPolygons(toTriangles(graph));

import { fromPolygons } from './fromPolygons.js';
import { toTriangles } from './toTriangles.js';

// Convert an outline graph to a possibly closed surface.
export const interior = (graph) => fromPolygons(toTriangles(graph));

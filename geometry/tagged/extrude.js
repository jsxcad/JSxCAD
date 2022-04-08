import { extrude as extrudeGraph } from '../graph/extrude.js';
import { fill } from './fill.js';
import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { op } from './op.js';
import { reify } from './reify.js';

const graph = (geometry, height, depth, direction) =>
  extrudeGraph(geometry, height, depth, reify(direction(geometry)));
const paths = (geometry, height, depth, direction) =>
  extrude(fill(geometry), height, depth, direction);
const polygonsWithHoles = (geometry, height, depth, direction) =>
  extrude(fromPolygonsWithHolesToGraph(geometry), height, depth, direction);
// const segments = (geometry, height, depth, direction) => extrude(fill(geometry), height, depth, direction);

export const extrude = op({ graph, polygonsWithHoles, paths });

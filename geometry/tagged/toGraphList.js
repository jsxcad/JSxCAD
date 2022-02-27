import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { op } from './op.js';
import { visit } from './visit.js';

const graph = (geometry, graphs) => graphs.push(geometry);
const polygonsWithHoles = (geometry, graphs) =>
  graphs.push(fromPolygonsWithHolesToGraph(geometry));

export const toGraphList = op({ graph, polygonsWithHoles }, visit);

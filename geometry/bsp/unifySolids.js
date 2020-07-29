import clipPolygonsToFaces from './clipPolygonsToFaces.js';
import { fromPolygons as fromPolygonsToSolid } from '@jsxcad/geometry-solid';
import { fromSolids as fromSolidsToBsp } from './bsp.js';
import toPlanarPolygonsFromSolids from './toPlanarPolygonsFromSolids.js';

export const unifySolids = (normalize, ...solids) => {
  const bsp = fromSolidsToBsp(solids, normalize);
  const unclippedPolygons = toPlanarPolygonsFromSolids(solids);
  const clippedPolygons = [];
  clipPolygonsToFaces(bsp, unclippedPolygons, normalize, (polygons) =>
    clippedPolygons.push(...polygons)
  );
  return fromPolygonsToSolid(clippedPolygons, normalize);
};

export default unifySolids;

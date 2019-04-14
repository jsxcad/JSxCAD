import { toTriangles } from '@jsxcad/algorithm-polygons';
import { makeSurfacesConvex, toPolygons } from '@jsxcad/algorithm-solid';
import { trianglesToThreejsDatasets } from './trianglesToThreejsDatasets';

export const solidToThreejsDatasets = (options = {}, ...solids) =>
  trianglesToThreejsDatasets(options, ...solids.map(solid => toTriangles({}, toPolygons({}, makeSurfacesConvex({}, solid)))));

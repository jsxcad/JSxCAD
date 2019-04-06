import { toTriangles } from '@jsxcad/algorithm-polygons';
import { trianglesToThreejsDatasets } from './trianglesToThreejsDatasets';

export const solidToThreejsDatasets = (options = {}, ...solids) =>
    trianglesToThreejsDatasets(options, ...solids.map(solid => toTriangles({}, solid)));

import { Shape } from './Shape';
import { getPaths as getPathsetsFromGeometry } from '@jsxcad/geometry-tagged';

/**
 *
 * # Get Pathsets
 *
 * Extracts the paths of a geometry grouped by surface.
 *
 **/

// CHECK: Do we need this?
export const getPathsets = (shape) => getPathsetsFromGeometry(shape.toKeptGeometry()).map(({ paths }) => paths);

const getPathsetsMethod = function () { return getPathsets(this); };
Shape.prototype.getPathsets = getPathsetsMethod;

getPathsets.signature = 'getPathsets(shape:Shape) -> pathsets';
getPathsetsMethod.signature = 'Shape -> getPathsets(shape:Shape) -> pathsets';

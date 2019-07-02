import { Shape } from './Shape';
import { getPaths as getPathsetsFromGeometry } from '@jsxcad/geometry-tagged';

/**
 *
 * # Get Pathsets
 *
 * Extracts the paths of a geometry grouped by surface.
 *
 **/

export const getPathsets = (shape) => getPathsetsFromGeometry(shape.toKeptGeometry()).map(({ paths }) => paths);

const method = function () { return getPathsets(this); };

Shape.prototype.getPathsets = method;

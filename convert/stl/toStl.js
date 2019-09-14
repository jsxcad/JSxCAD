import { canonicalize, toTriangles } from '@jsxcad/geometry-polygons';
import { getSolids, toKeptGeometry } from '@jsxcad/geometry-tagged';

import { assertUnique } from '@jsxcad/geometry-path';
import { fixTJunctions } from './fixTJunctions';
import { makeSurfacesConvex } from '@jsxcad/geometry-solid';
import { toPlane } from '@jsxcad/math-poly3';

/**
 * Translates a polygon array [[[x, y, z], [x, y, z], ...]] to ascii STL.
 * The exterior side of a polygon is determined by a CCW point ordering.
 *
 * @param {Object} options.
 * @param {Polygon Array} polygons - An array of arrays of points.
 * @returns {String} - the ascii STL output.
 */

const geometryToTriangles = (solids) => {
  const triangles = [];
  for (const { solid } of solids) {
    let convex = makeSurfacesConvex({}, solid);
    for (const surface of convex) {
      for (const triangle of toTriangles({}, surface)) {
        assertUnique(triangle);
        triangles.push(triangle);
      }
    }
  }
  return triangles;
};

export const toStl = async (options = {}, geometry) => {
  const { doFixTJunctions = true } = options;
  const keptGeometry = toKeptGeometry(geometry);
  let solids = getSolids(keptGeometry);
  if (doFixTJunctions) {
    solids = fixTJunctions(solids);
  }
  const triangles = geometryToTriangles(solids);
  return `solid JSxCAD\n${convertToFacets(options, canonicalize(triangles))}\nendsolid JSxCAD\n`;
};

const convertToFacets = (options, polygons) =>
  polygons.map(convertToFacet).filter(facet => facet !== undefined).join('\n');

const toStlVector = vector =>
  `${vector[0]} ${vector[1]} ${vector[2]}`;

const toStlVertex = vertex =>
  `vertex ${toStlVector(vertex)}`;

const convertToFacet = (polygon) => {
  const plane = toPlane(polygon);
  if (plane !== undefined) {
    return `facet normal ${toStlVector(toPlane(polygon))}\n` +
           `outer loop\n` +
           `${toStlVertex(polygon[0])}\n` +
           `${toStlVertex(polygon[1])}\n` +
           `${toStlVertex(polygon[2])}\n` +
           `endloop\n` +
           `endfacet`;
  }
};

import { canonicalize, toTriangles } from '@jsxcad/geometry-polygons';
import { getSolids, toKeptGeometry } from '@jsxcad/geometry-tagged';

import { makeWatertight } from '@jsxcad/geometry-solid';
import { toPlane } from '@jsxcad/math-poly3';
import { union } from '@jsxcad/geometry-solid-boolean';

/**
 * Translates a polygon array [[[x, y, z], [x, y, z], ...]] to ascii STL.
 * The exterior side of a polygon is determined by a CCW point ordering.
 *
 * @param {Object} options.
 * @param {Polygon Array} polygons - An array of arrays of points.
 * @returns {String} - the ascii STL output.
 */

const fromSolidToTriangles = (solid) => {
  const triangles = [];
  for (const surface of makeWatertight(solid)) {
    for (const triangle of toTriangles({}, surface)) {
      triangles.push(triangle);
    }
  }
  return triangles;
};

export const toStl = async (geometry, options = {}) => {
  const keptGeometry = toKeptGeometry(geometry);
  let solids = getSolids(keptGeometry).map(({ solid }) => solid);
  const triangles = fromSolidToTriangles(union(...solids));
  const output = `solid JSxCAD\n${convertToFacets(options, canonicalize(triangles))}\nendsolid JSxCAD\n`;
  return new TextEncoder('utf8').encode(output);
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

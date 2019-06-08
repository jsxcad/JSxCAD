import { canonicalize, toTriangles } from '@jsxcad/geometry-polygons';
import { getSolids, toKeptGeometry } from '@jsxcad/geometry-tagged';
import { isWatertightPolygons, makeWatertight } from '@jsxcad/algorithm-watertight';

import { fixTJunctions } from './fixTJunctions';
import { toPlane } from '@jsxcad/math-poly3';
import { toPolygons } from '@jsxcad/geometry-solid';

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
    triangles.push(...toTriangles({}, toPolygons({}, solid)));
  }
  return triangles;
};

export const toStl = async (options = {}, geometry) => {
  let keptGeometry = toKeptGeometry(geometry);
  let solids = getSolids(keptGeometry);
  let polygons = geometryToTriangles(fixTJunctions(solids));
  if (!isWatertightPolygons(polygons)) {
    console.log(`polygonsToStla: Polygon is not watertight`);
    if (options.doMakeWatertight) {
      polygons = makeWatertight(polygons);
    }
  }
  return `solid JSxCAD\n${convertToFacets(options, canonicalize(toTriangles({}, polygons)))}\nendsolid JSxCAD\n`;
};

const convertToFacets = (options, polygons) =>
  polygons.map(convertToFacet).filter(facet => facet !== undefined).join('\n');

const toStlVector = vector =>
  `${vector[0]} ${vector[1]} ${vector[2]}`;

const toStlVertex = vertex =>
  `vertex ${toStlVector(vertex)}`;

const convertToFacet = (polygon) => {
  const plane = toPlane(polygon);
  if (!isNaN(plane[0])) {
    return `facet normal ${toStlVector(toPlane(polygon))}\n` +
           `outer loop\n` +
           `${toStlVertex(polygon[0])}\n` +
           `${toStlVertex(polygon[1])}\n` +
           `${toStlVertex(polygon[2])}\n` +
           `endloop\n` +
           `endfacet`;
  }
};

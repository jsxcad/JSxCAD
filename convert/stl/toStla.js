import { canonicalize, toTriangles } from '@jsxcad/geometry-polygons';
import { isWatertightPolygons, makeWatertight } from '@jsxcad/algorithm-watertight';

import { eachItem } from '@jsxcad/geometry-eager';
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

const geometryToTriangles = (geometry) => {
  const triangleSets = [];
  eachItem(geometry,
           item => {
             if (item.solid) {
               triangleSets.push(toTriangles({}, toPolygons({}, item.solid)));
             }
           });
  return [].concat(...triangleSets);
};

export const toStla = async (options = {}, geometry) => {
  let polygons = geometryToTriangles(geometry);
  if (!isWatertightPolygons(polygons)) {
    console.log(`polygonsToStla: Polygon is not watertight`);
    if (options.doMakeWatertight) {
      polygons = makeWatertight(polygons);
    }
  }
  return `solid JSxCAD\n${convertToFacets(options, canonicalize(toTriangles({}, polygons)))}\nendsolid JSxCAD\n`;
};

const convertToFacets = (options, polygons) =>
  polygons.map(convertToFacet).join('\n');

const toStlVector = vector =>
  `${vector[0]} ${vector[1]} ${vector[2]}`;

const toStlVertex = vertex =>
  `vertex ${toStlVector(vertex)}`;

const convertToFacet = polygon =>
  `facet normal ${toStlVector(toPlane(polygon))}\n` +
  `outer loop\n` +
  `${toStlVertex(polygon[0])}\n` +
  `${toStlVertex(polygon[1])}\n` +
  `${toStlVertex(polygon[2])}\n` +
  `endloop\n` +
  `endfacet`;

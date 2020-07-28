import { canonicalize, toTriangles } from '@jsxcad/geometry-polygons';
import { getNonVoidSolids, toDisjointGeometry } from '@jsxcad/geometry-tagged';

import { makeWatertight } from '@jsxcad/geometry-solid';
import { toPlane } from '@jsxcad/math-poly3';

const fromSolidToTriangles = (solid, triangles) => {
  for (const surface of makeWatertight(solid)) {
    for (const triangle of toTriangles({}, surface)) {
      triangles.push(triangle);
    }
  }
};

const convertToFacets = (options, polygons) =>
  polygons
    .map(convertToFacet)
    .filter((facet) => facet !== undefined)
    .join('\n');

const toStlVector = (vector) => `${vector[0]} ${vector[1]} ${vector[2]}`;

const toStlVertex = (vertex) => `vertex ${toStlVector(vertex)}`;

const convertToFacet = (polygon) => {
  const plane = toPlane(polygon);
  if (plane !== undefined) {
    return (
      `facet normal ${toStlVector(toPlane(polygon))}\n` +
      `outer loop\n` +
      `${toStlVertex(polygon[0])}\n` +
      `${toStlVertex(polygon[1])}\n` +
      `${toStlVertex(polygon[2])}\n` +
      `endloop\n` +
      `endfacet`
    );
  }
};

export const toStl = async (geometry, options = {}) => {
  const keptGeometry = toDisjointGeometry(await geometry);
  const triangles = [];
  for (const { solid } of getNonVoidSolids(keptGeometry)) {
    fromSolidToTriangles(solid, triangles);
  }
  const output = `solid JSxCAD\n${convertToFacets(
    options,
    canonicalize(triangles)
  )}\nendsolid JSxCAD\n`;
  return new TextEncoder('utf8').encode(output);
};

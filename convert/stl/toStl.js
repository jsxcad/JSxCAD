import {
  getNonVoidGraphs,
  toDisjointGeometry,
  toTrianglesFromGraph,
} from '@jsxcad/geometry';

import { toPlane } from '@jsxcad/math-poly3';

const equals = ([aX, aY, aZ], [bX, bY, bZ]) =>
  aX === bX && aY === bY && aZ === bZ;
const round = (value, tolerance) => Math.round(value / tolerance) * tolerance;
const roundVertex = ([x, y, z], tolerance = 0.001) => [
  round(x, tolerance),
  round(y, tolerance),
  round(z, tolerance),
];

const convertToFacets = (polygons) =>
  polygons
    .map(convertToFacet)
    .filter((facet) => facet !== undefined)
    .join('\n');

const toStlVector = (vector) => `${vector[0]} ${vector[1]} ${vector[2]}`;

const toStlVertex = (vertex) => `vertex ${toStlVector(vertex)}`;

const convertToFacet = (polygon) => {
  if (polygon.length !== 3) {
    throw Error(`die`);
  }
  if (
    equals(polygon[0], polygon[1]) ||
    equals(polygon[1], polygon[2]) ||
    equals(polygon[2], polygon[0])
  ) {
    // Filter degenerate facets.
    return;
  }
  const plane = toPlane(polygon);
  if (plane !== undefined) {
    return (
      `facet normal ${toStlVector(toPlane(polygon))}\n` +
      `  outer loop\n` +
      `    ${toStlVertex(polygon[0])}\n` +
      `    ${toStlVertex(polygon[1])}\n` +
      `    ${toStlVertex(polygon[2])}\n` +
      `  endloop\n` +
      `endfacet`
    );
  }
};

export const toStl = async (geometry, { tolerance = 0.001 } = {}) => {
  const keptGeometry = toDisjointGeometry(await geometry);
  const triangles = [];
  for (const graphGeometry of getNonVoidGraphs(keptGeometry)) {
    for (const [a, b, c] of toTrianglesFromGraph(graphGeometry)) {
      triangles.push([
        roundVertex(a, tolerance),
        roundVertex(b, tolerance),
        roundVertex(c, tolerance),
      ]);
    }
  }
  const output = `solid JSxCAD\n${convertToFacets(
    triangles
  )}\nendsolid JSxCAD\n`;
  return new TextEncoder('utf8').encode(output);
};

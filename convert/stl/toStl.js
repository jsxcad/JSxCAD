import {
  getNonVoidGraphs,
  toDisjointGeometry,
  toTrianglesFromGraph,
} from '@jsxcad/geometry';

import { toPlane } from '@jsxcad/math-poly3';

const X = 0;
const Y = 1;
const Z = 2;

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

// We sort the triangles to produce stable output.
const orderVertices = (v, d = X) => {
  if (v[0][d] <= v[1][d] && v[0][d] <= v[2][d]) {
    // Cannot order by current dimension.
    if (d === Z) {
      // Exhausted dimensions.
      // All vertices are identical, all orders are correct.
      // This should be an impossible degenerate case.
      throw Error('Degenerate triangle');
    }
    // Try ordering by the next dimension.
    return orderVertices(v, d + 1);
  }
  for (;;) {
    if (v[0][d] <= v[1][d] && v[0][d] <= v[2][d]) {
      // Correctly ordered.
      return v;
    }
    // Rotate the vertices and try again.
    v.push(v.shift());
  }
  // Unreachable.
};

const compareTriangles = ([a], [b]) => {
  // The triangle vertices have been ordered such that the top is the minimal vertex.
  const dX = a[X] - b[X];
  if (dX !== 0) {
    return dX;
  }
  const dY = a[Y] - b[Y];
  if (dY !== 0) {
    return dY;
  }
  const dZ = a[Z] - b[Z];
  if (dZ !== 0) {
    return dZ;
  }
};

export const toStl = async (geometry, { tolerance = 0.001 } = {}) => {
  const keptGeometry = toDisjointGeometry(await geometry);
  const triangles = [];
  for (const graphGeometry of getNonVoidGraphs(keptGeometry)) {
    for (const [a, b, c] of toTrianglesFromGraph({}, graphGeometry).triangles) {
      triangles.push(
        orderVertices([
          roundVertex(a, tolerance),
          roundVertex(b, tolerance),
          roundVertex(c, tolerance),
        ])
      );
    }
  }
  triangles.sort(compareTriangles);
  const output = `solid JSxCAD\n${convertToFacets(
    triangles
  )}\nendsolid JSxCAD\n`;
  return new TextEncoder('utf8').encode(output);
};

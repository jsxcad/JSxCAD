import { getNonVoidGraphs, toDisjointGeometry } from '@jsxcad/geometry-tagged';

import { toPlane } from '@jsxcad/math-poly3';
import { toTriangles as toTrianglesFromGraph } from '@jsxcad/geometry-graph';

const convertToFacets = (polygons) =>
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
  for (const { graph } of getNonVoidGraphs(keptGeometry)) {
    triangles.push(...toTrianglesFromGraph(graph));
  }
  const output = `solid JSxCAD\n${convertToFacets(
    triangles
  )}\nendsolid JSxCAD\n`;
  return new TextEncoder('utf8').encode(output);
};

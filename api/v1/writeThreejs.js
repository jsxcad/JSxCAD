import { toTriangles } from '@jsxcad/algorithm-triangles';
import { trianglesToThreejsPage } from '@jsxcad/algorithm-threejs';
import { writeFileSync } from '@jsxcad/sys';

const toPolygons = (shape) => (shape instanceof Array) ? shape : shape.toPolygons({});

export const writeThreejsPage = (options, ...shapes) => {
  const solids = shapes.map(toPolygons).map(polygons => toTriangles({}, polygons));
  // FIX: Should we generalize on sets of paths, like solids, rather than paths?
  writeFileSync(options.path, solids, { translator: trianglesToThreejsPage(options, ...solids) });
};

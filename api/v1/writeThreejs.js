import { toTriangles } from '@jsxcad/algorithm-triangles';
import { trianglesToThreejsPage } from '@jsxcad/algorithm-threejs';

export const writeThreejsPage = (options, shape) => {
  let polygons;
  if (shape instanceof Array) {
    polygons = shape;
  } else {
    polygons = shape.toPolygons({});
  }
  // TODO: Need to abstract filesystem access so that it can work in a browser.
  require('fs').writeFileSync(options.path, trianglesToThreejsPage(options, toTriangles({}, polygons)));
};

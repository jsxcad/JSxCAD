import { toTriangles } from '@jsxcad/algorithm-triangles';
import { trianglesToThreejsPage } from '@jsxcad/algorithm-threejs';
import { writeFileSync } from 'fs';

const toPolygons = (shape) => (shape instanceof Array) ? shape : shape.toPolygons({});

export const writeThreejsPage = (options, ...shapes) => {
  // TODO: Need to abstract filesystem access so that it can work in a browser.
  writeFileSync(options.path,
                trianglesToThreejsPage(options,
                                       ...shapes.map(toPolygons).map(polygons => toTriangles({}, polygons))));
};

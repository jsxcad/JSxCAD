import { polygonsToStla } from '@jsxcad/algorithm-stl';

export const writeStl = ({ path }, shape) => {
  const polygons = shape.toPolygons({});
  // TODO: Need to abstract filesystem access so that it can work in a browser.
  require('fs').writeFileSync(path, polygonsToStla({}, polygons));
};

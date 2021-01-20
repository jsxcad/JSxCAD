import { outline, taggedPaths } from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';

export const weld = (...shapes) => {
  const weld = [];
  for (const shape of shapes) {
    for (const { paths } of outline(shape.toTransformedGeometry())) {
      weld.push(...paths);
    }
  }
  return Shape.fromGeometry(taggedPaths({}, weld));
};

const weldMethod = function (...shapes) {
  return weld(this, ...shapes);
};

Shape.prototype.weld = weldMethod;

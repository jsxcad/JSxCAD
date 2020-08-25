import Shape from './Shape.js';
import { getNonVoidPaths } from '@jsxcad/geometry-tagged';

export const paths = (shape, op = (_) => _) => {
  const paths = [];
  for (const geometry of getNonVoidPaths(shape.toDisjointGeometry())) {
    paths.push(op(Shape.fromGeometry(geometry)));
  }
  return paths;
};

const pathsMethod = function (op) {
  return paths(this, op);
};
Shape.prototype.paths = pathsMethod;

export default paths;

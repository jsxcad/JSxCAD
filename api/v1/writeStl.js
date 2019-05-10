import { Shape } from './Shape';
import { toStl } from '@jsxcad/convert-stl';
import { writeFile } from '@jsxcad/sys';

const toGeometry = ({ disjoint = true }, shape) => {
  if (disjoint) {
    return shape.toDisjointGeometry();
  } else {
    return shape.toGeometry();
  }
}

export const writeStl = async (options, shape) => {
  const { path, disjoint = true } = options;
  const geometry = toGeometry(options, shape);
  return writeFile({ geometry }, path, toStl(options, geometry));
};

const method = function (options = {}) { writeStl(options, this); return this; };

Shape.prototype.writeStl = method;

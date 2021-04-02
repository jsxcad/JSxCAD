import { Shape, getPegCoords } from '@jsxcad/api-v1-shape';

import { section as sectionGeometry } from '@jsxcad/geometry-tagged';

export const section = (shape, ...pegs) => {
  const planes = [];
  if (pegs.length === 0) {
    planes.push({ plane: [0, 0, 1, 0] });
  } else {
    for (const peg of pegs) {
      const { plane } = getPegCoords(peg);
      planes.push({ plane });
    }
  }
  return Shape.fromGeometry(sectionGeometry(shape.toGeometry(), planes));
};

const sectionMethod = function (...args) {
  return section(this, ...args);
};
Shape.prototype.section = sectionMethod;

export default section;

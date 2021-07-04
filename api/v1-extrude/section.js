import { Shape, getPegCoords } from '@jsxcad/api-v2';

import { section as sectionGeometry } from '@jsxcad/geometry';

export const section = (shape, { profile = false }, ...pegs) => {
  const planes = [];
  if (pegs.length === 0) {
    planes.push({ plane: [0, 0, 1, 0] });
  } else {
    for (const peg of pegs) {
      const { plane } = getPegCoords(peg);
      planes.push({ plane });
    }
  }
  return Shape.fromGeometry(
    sectionGeometry(shape.toGeometry(), planes, { profile })
  );
};

const sectionMethod = function (...args) {
  return section(this, { profile: false }, ...args);
};
Shape.prototype.section = sectionMethod;

const sectionProfileMethod = function (...args) {
  return section(this, { profile: true }, ...args);
};
Shape.prototype.sectionProfile = sectionProfileMethod;

export default section;

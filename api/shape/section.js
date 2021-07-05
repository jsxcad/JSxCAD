import { Shape } from './Shape.js';
import { getPegCoords } from './Peg.js';
import { section as sectionGeometry } from '@jsxcad/geometry';

const baseSection =
  ({ profile = false } = {}, ...pegs) =>
  (shape) => {
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

export const section = (...pegs) => (shape) =>
  baseSection({ profile: false }, ...pegs)(shape);

Shape.registerMethod('section', section);

export const sectionProfile = (...pegs) => (shape) =>
  baseSection({ profile: true }, ...pegs)(shape);

Shape.registerMethod('sectionProfile', sectionProfile);

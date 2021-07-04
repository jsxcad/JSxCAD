import { Shape } from './Shape.js';
import { getPegCoords } from './Peg.js';
import { section as sectionGeometry } from '@jsxcad/geometry';

export const section =
  ({ profile = false }, ...pegs) =>
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

Shape.registerMethod('section', section);

export const sectionProfile = () => (shape) =>
  section({ profile: true })(shape);

Shape.registerMethod('sectionProfile', sectionProfile);

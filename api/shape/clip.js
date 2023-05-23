import { Shape } from './Shape.js';
import { clip as clipGeometry } from '@jsxcad/geometry';

// It's not entirely clear that Clip makes sense, but we set it up to clip the first argument for now.
export const Clip = Shape.registerMethod2(
  'Clip',
  ['modes', 'geometry', 'geometries'],
  async (modes, first, rest) =>
    Shape.fromGeometry(
      clipGeometry(
        first,
        rest,
        modes.includes('open'),
        modes.includes('exact'),
        modes.includes('noVoid'),
        modes.includes('noGhost')
      )
    )
);

export const clip = Shape.registerMethod2(
  'clip',
  ['inputGeometry', 'modes', 'geometries'],
  (inputGeometry, modes, geometries) =>
    Shape.fromGeometry(
      clipGeometry(
        inputGeometry,
        geometries,
        modes.includes('open'),
        modes.includes('exact'),
        modes.includes('noVoid'),
        modes.includes('noGhost')
      )
    )
);

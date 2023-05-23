import Shape from './Shape.js';
import { cut as cutGeometry } from '@jsxcad/geometry';

export const Cut = Shape.registerMethod2(
  'Cut',
  ['geometry', 'geometries', 'modes'],
  (first, rest, modes) =>
    Shape.fromGeometry(
      cutGeometry(
        first,
        rest,
        modes.includes('open'),
        modes.includes('exact'),
        modes.includes('noVoid'),
        modes.includes('noGhost')
      )
    )
);

export const cut = Shape.registerMethod2(
  'cut',
  ['inputGeometry', 'geometries', 'modes'],
  async (inputGeometry, geometries, modes) =>
    Shape.fromGeometry(
      cutGeometry(
        inputGeometry,
        geometries,
        modes.includes('open'),
        modes.includes('exact'),
        modes.includes('noVoid'),
        modes.includes('noGhost')
      )
    )
);

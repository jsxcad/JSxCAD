import { Shape, fromGeometry } from './Shape.js';
import { clip, linearize } from '@jsxcad/geometry';

import Group from './Group.js';

// The semantics here are not very clear -- this computes a volume that all volumes in the shape have in common.
export const commonVolume = Shape.registerMethod2(
  'commonVolume',
  ['input', 'shapes', 'modes:open,exact,noVoid,noGhost'],
  async (input, shapes, modes) => {
    const collectedGeometry = await Group(input, ...shapes).toGeometry();
    const [first, ...rest] = linearize(
      collectedGeometry,
      ({ type }) => type === 'graph'
    );
    return fromGeometry(
      clip(
        first,
        rest,
        modes.includes('open'),
        modes.includes('exact'),
        modes.includes('noVoid'),
        modes.includes('noGhost')
      )
    );
  }
);

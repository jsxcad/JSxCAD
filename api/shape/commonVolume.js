import { Shape, fromGeometry } from './Shape.js';
import { clip, linearize } from '@jsxcad/geometry';

import Group from './Group.js';
import { destructure2 } from './destructure.js';

// The semantics here are not very clear -- this computes a volume that all volumes in the shape have in common.
export const commonVolume = Shape.registerMethod(
  'commonVolume',
  (...args) =>
    async (shape) => {
      const [modes, shapes] = await destructure2(
        shape,
        args,
        'modes',
        'shapes'
      );
      const collectedGeometry = await Group(shape, ...shapes).toGeometry();
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

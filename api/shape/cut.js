import Shape from './Shape.js';
import { cut as cutGeometry } from '@jsxcad/geometry';
import { destructure2 } from './destructure.js';

export const Cut = Shape.registerMethod('Cut', (...args) => async (shape) => {
  const [first, rest, modes] = await destructure2(
    shape,
    args,
    'geometry',
    'geometries',
    'modes'
  );
  return Shape.fromGeometry(
    cutGeometry(
      first,
      rest,
      modes.includes('open'),
      modes.includes('exact'),
      modes.includes('noVoid'),
      modes.includes('noGhost')
    )
  );
});

export const cut = Shape.registerMethod('cut', (...args) => async (shape) => {
  const [geometries, modes] = await destructure2(
    shape,
    args,
    'geometries',
    'modes'
  );
  return Shape.fromGeometry(
    cutGeometry(
      await shape.toGeometry(),
      geometries,
      modes.includes('open'),
      modes.includes('exact'),
      modes.includes('noVoid'),
      modes.includes('noGhost')
    )
  );
});

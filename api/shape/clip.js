import { Shape } from './Shape.js';
import { clip as clipGeometry } from '@jsxcad/geometry';
import { destructure2 } from './destructure.js';

// It's not entirely clear that Clip makes sense, but we set it up to clip the first argument for now.
export const Clip = Shape.registerMethod('Clip', (...args) => async (shape) => {
  const [modes, shapes] = await destructure2(shape, args, 'modes', 'shapes');
  const [first, ...rest] = shapes;
  return Shape.fromGeometry(
    clipGeometry(
      await first.toGeometry(),
      await shape.toShapesGeometries(rest),
      modes.includes('open'),
      modes.includes('exact'),
      modes.includes('noVoid'),
      modes.includes('noGhost')
    )
  );
});

export const clip = Shape.registerMethod('clip', (...args) => async (shape) => {
  const [modes, shapes] = await destructure2(shape, args, 'modes', 'shapes');
  return Shape.fromGeometry(
    clipGeometry(
      await shape.toGeometry(),
      await shape.toShapesGeometries(shapes),
      modes.includes('open'),
      modes.includes('exact'),
      modes.includes('noVoid'),
      modes.includes('noGhost')
    )
  );
});

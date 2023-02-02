import Group from './Group.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { extrude as extrudeGeometry } from '@jsxcad/geometry';
import { normal } from './normal.js';

// This interface is a bit awkward.
export const extrudeAlong = Shape.registerMethod(
  'extrudeAlong',
  (...args) =>
    async (shape) => {
      const [vector, modes, intervals] = await destructure2(
        shape,
        args,
        'coordinate',
        'modes',
        'intervals'
      );
      const extrusions = [];
      for (const [depth, height] of intervals) {
        if (height === depth) {
          // Return unextruded geometry at this height, instead.
          extrusions.push(await shape.moveAlong(vector, height));
          continue;
        }
        extrusions.push(
          Shape.fromGeometry(
            extrudeGeometry(
              await shape.toGeometry(),
              await Point().moveAlong(vector, height).toGeometry(),
              await Point().moveAlong(vector, depth).toGeometry(),
              modes.includes('noVoid')
            )
          )
        );
      }
      return Group(...extrusions);
    }
);

// Note that the operator is applied to each leaf geometry by default.
export const e = Shape.registerMethod(
  'e',
  (...extents) =>
    async (shape) =>
      extrudeAlong(normal(), ...extents)(shape)
);

export default extrudeAlong;

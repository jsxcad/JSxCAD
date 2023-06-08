import Group from './Group.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { extrude as extrudeGeometry } from '@jsxcad/geometry';
import { normal } from './normal.js';

// This interface is a bit awkward.
export const extrudeAlong = Shape.registerMethod2(
  'extrudeAlong',
  ['input', 'coordinate', 'modes', 'intervals'],
  async (input, vector, modes, intervals) => {
    console.log(`QQQ/extrudeAlong/vector: ${JSON.stringify(vector)}`);
    console.log(`QQQ/extrudeAlong/intervals: ${JSON.stringify(intervals)}`);
    const extrusions = [];
    for (const [depth, height] of intervals) {
      if (height === depth) {
        // Return unextruded geometry at this height, instead.
        extrusions.push(await input.moveAlong(vector, height));
        continue;
      }
      extrusions.push(
        Shape.fromGeometry(
          extrudeGeometry(
            await input.toGeometry(),
            await Point().moveAlong(vector, height).toGeometry(),
            await Point().moveAlong(vector, depth).toGeometry(),
            modes.includes('noVoid')
          )
        )
      );
    }
    console.log(`QQQ/extrudeAlong/extrusions: ${extrusions}`);
    return Group(...extrusions)();
  }
);

// Note that the operator is applied to each leaf geometry by default.
export const e = Shape.registerMethod2(
  'e',
  ['input', 'intervals'],
  (input, extents) => extrudeAlong(normal(), ...extents)(input)
);

export default extrudeAlong;

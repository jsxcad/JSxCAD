import './toCoordinate.js';

import Point from './Point.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { extrude as extrudeGeometry } from '@jsxcad/geometry';
import { normal } from './normal.js';

const isNotString = (value) => typeof value !== 'string';

const toCoordinateOp = Shape.ops.get('toCoordinate');

// This interface is a bit awkward.
export const extrudeAlong = Shape.registerMethod(
  ['extrudeAlong'],
  (direction, ...args) =>
    async (shape) => {
      console.log(`QQ/extrudeAlong/shape: ${JSON.stringify(shape)}`);
      const { strings: modes, values: extents } = destructure(args);
      let vector;
      try {
        // This will fail on ghost geometry.
        vector = await toCoordinateOp(direction)(shape);
      } catch (e) {
        console.log(`QQ/extrudeAlong/error: ${e.stack}`);
        throw e;
        // TODO: Be more selective.
        // return Shape.Group();
      }
      const heights = extents
        .filter(isNotString)
        .map((extent) => Shape.toValue(extent, shape));
      if (heights.length % 2 === 1) {
        heights.push(0);
      }
      heights.sort((a, b) => a - b);
      console.log(`QQ/extrudeAlong/heights: ${JSON.stringify(heights)}`);
      const extrusions = [];
      while (heights.length > 0) {
        const height = heights.pop();
        const depth = heights.pop();
        if (height === depth) {
          // Return unextruded geometry at this height, instead.
          extrusions.push(await shape.moveAlong(vector, height));
          continue;
        }
        extrusions.push(
          Shape.fromGeometry(
            extrudeGeometry(
              shape.toGeometry(),
              (await Point().moveAlong(vector, height)).toGeometry(),
              (await Point().moveAlong(vector, depth)).toGeometry(),
              modes.includes('noVoid')
            )
          )
        );
      }
      return Shape.Group(...extrusions);
    }
);

// Note that the operator is applied to each leaf geometry by default.
export const e = (...extents) =>
  Shape.registerMethod('e', extrudeAlong(normal(), ...extents));

export default extrudeAlong;

import './toCoordinate.js';

import Shape from './Shape.js';

const toCoordinateOp = Shape.ops.get('toCoordinate');
let toCoordinatesOp;

export const toCoordinates = Shape.registerMethod(
  'toCoordinates',
  (...args) =>
    async (shape) => {
      const coordinates = [];
      while (args.length > 0) {
        let x = args.shift();
        if (Shape.isFunction(x)) {
          x = await x(shape);
        }
        if (Shape.isShape(x)) {
          if (x.toGeometry().type === 'group') {
            coordinates.push(
              ...(await toCoordinatesOp(
                ...x
                  .toGeometry()
                  .content.map((geometry) => Shape.fromGeometry(geometry))
              )(shape))
            );
          } else {
            coordinates.push(await toCoordinateOp(x)(shape));
          }
        } else if (Shape.isArray(x)) {
          if (isNaN(x[0]) || isNaN(x[1]) || isNaN(x[2])) {
            for (const element of x) {
              coordinates.push(...(await toCoordinatesOp(element)(shape)));
            }
          } else {
            coordinates.push(x);
          }
        } else if (typeof x === 'number') {
          let y = args.shift();
          let z = args.shift();
          if (y === undefined) {
            y = 0;
          }
          if (z === undefined) {
            z = 0;
          }
          if (typeof y !== 'number') {
            throw Error(`Unexpected coordinate value: ${y}`);
          }
          if (typeof z !== 'number') {
            throw Error(`Unexpected coordinate value: ${z}`);
          }
          coordinates.push([x, y, z]);
        } else {
          throw Error(`Unexpected coordinate value: ${JSON.stringify(x)}`);
        }
      }
      return coordinates;
    }
);

toCoordinatesOp = Shape.ops.get('toCoordinates');

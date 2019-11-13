import { distance, negate } from '@jsxcad/math-vec3';
import { drop, rotateY, rotateZ, toTransformedGeometry, translate } from '@jsxcad/geometry-tagged';

import { Plan } from './Plan';
import { Shape } from './Shape';
import { assemble } from './assemble';

const X = 0;
const Y = 1;
const Z = 2;

// Find the angle between the passed vector and the x-axis (in the given reference frame)
const angleX = (cord1, cord2) => {
  // Compute the angle from the given cordinates to 100, 0 (the x axis) (in the passed reference plane)

  // Distance from origin to point B in the xy plane
  const l1 = distance([0, 0, 0], [cord1, cord2, 0]);

  // Distance from origin to X vector in xy plane
  const l2 = distance([0, 0, 0], [100, 0, 0]);

  const l3 = distance([cord1, cord2, 0], [100, 0, 0]);

  return Math.acos((l1 * l1 + l2 * l2 - l3 * l3) / (2 * l1 * l2)) * (180 / Math.PI) * Math.sign(cord2);
};

// Move the target shape to the origin and align with axis
const moveToOrigin = (shape, connectorName) => {
  const connectors = shape.connectors();
  let connector = connectors[connectorName];
  const [origin] = connector.marks;

  // Move both shapes so point A is a the origin,
  // then correct each angle.

  connector = toTransformedGeometry(translate(negate(origin), connector));
  const z = (([, B]) => angleX(B[X], B[Y]))(connector.marks);

  connector = toTransformedGeometry(rotateZ(-z, connector));
  const y = (([, B]) => angleX(B[X], B[Z]))(connector.marks);

  connector = toTransformedGeometry(rotateY(y, connector));
  const x = (([, , C]) => angleX(C[Y], C[Z]))(connector.marks);

  return [origin, x, y, z];
};

export const dropConnector = (shape, connector) => Shape.fromGeometry(drop([`connector/${connector}`], shape.toGeometry()));

// Connect two shapes at the specified connector.
export const connect = (aShape, aConnector, bShape, bConnector, doAssemble = true) => {
  const [aOrigin, aX, aY, aZ] = moveToOrigin(aShape, aConnector);
  const [bOrigin, bX, bY, bZ] = moveToOrigin(bShape, bConnector);
  const bMoved = bShape.move(negate(bOrigin))
      .rotateZ(-bZ)
      .rotateY(bY)
      .rotateX(-bX)
      .rotateX(aX)
      .rotateY(-aY)
      .rotateZ(aZ)
      .move(aOrigin);
  if (doAssemble) {
    return assemble(
      dropConnector(aShape,
                    aConnector),
      dropConnector(bMoved,
                    bConnector))
        .with(Plan.Label(`${aConnector} + ${bConnector}`)
            .move(aOrigin));
  } else {
    return bMoved;
  }
};

const method = function (...args) { return connect(this, ...args); };
Shape.prototype.connect = method;

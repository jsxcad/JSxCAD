import { distance, negate } from '@jsxcad/math-vec3';

import { Plan } from './Plan';
import { Shape } from './Shape';
import { assemble } from './assemble';
import { drop } from '@jsxcad/geometry-tagged';

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
  const rotation = Math.acos((l1 * l1 + l2 * l2 - l3 * l3) / (2 * l1 * l2)) * (180 / Math.PI) * Math.sign(cord2);
  return rotation;
};

// Move the target shape to the origin and align with axis
const moveToOrigin = (shape, connectorName) => {
  const connectors = shape.connectors();
  const connector = connectors[connectorName];
  const [A, B, C] = connector.marks;

  // Move both shapes so point A is a the origin,
  // then correct each angle.

  const z = angleX(B[X], B[Y]);
  const y = angleX(B[X], B[Z]);
  const x = angleX(C[Y], C[Z]);

  const result = [shape.move(negate(A)).rotateZ(-z).rotateY(y).rotateX(-x), A, [x, y, z]];
  return result;
};

export const dropConnector = (shape, connector) => Shape.fromGeometry(drop([`connector/${connector}`], shape.toGeometry()));

// Connect two shapes at the specified connector.
export const connect = (aShape, aConnector, bShape, bConnector) => {
  const [, aOrigin, [aX, aY, aZ]] = moveToOrigin(aShape, aConnector);
  const [bMoved] = moveToOrigin(bShape, bConnector);
  const bConnected = bMoved.rotateX(aX).rotateY(-aY).rotateZ(aZ).move(aOrigin);
  return assemble(
             dropConnector(aShape, aConnector),
             dropConnector(bConnected, bConnector))
           .with(Plan.Label(`${aConnector} + ${bConnector}`)
                     .move(aOrigin));
};

const method = function (...args) { return connect(this, ...args); };
Shape.prototype.connect = method;

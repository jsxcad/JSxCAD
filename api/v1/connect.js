import { drop, toTransformedGeometry } from '@jsxcad/geometry-tagged';
import { negate, subtract } from '@jsxcad/math-vec3';

import Shape from './Shape';
import { shapeToConnect } from './Connector';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';

/**
 *
 * # Connect
 *
 * Connects two connectors.
 *
 * ::: illustration { "view": { "position": [60, -60, 0], "target": [0, 0, 0] } }
 * ```
 * Cube(10).Connector('top').moveZ(5)
 *         .connect(Sphere(10).Connector('bottom').flip().moveZ(-9))
 * ```
 * :::
 **/

export const dropConnector = (shape, connector) =>
  Shape.fromGeometry(drop([`connector/${connector}`], shape.toGeometry()));

const CENTER = 0;
const RIGHT = 1;

const measureAngle = ([aX, aY], [bX, bY]) => {
  const a2 = Math.atan2(aX, aY);
  const a1 = Math.atan2(bX, bY);
  const sign = a1 > a2 ? 1 : -1;
  const angle = a1 - a2;
  const K = -sign * Math.PI * 2;
  const absoluteAngle = (Math.abs(K + angle) < Math.abs(angle)) ? K + angle : angle;
  return absoluteAngle * 180 / Math.PI;
};

// Connect two shapes at the specified connector.
export const connect = (aConnectorShape, bConnectorShape, { doConnect = true } = {}) => {
  const aConnector = toTransformedGeometry(aConnectorShape.toGeometry());
  const aShape = aConnectorShape.getContext(shapeToConnect);
  const [aTo] = toXYPlaneTransforms(aConnector.planes[0], subtract(aConnector.marks[RIGHT], aConnector.marks[CENTER]));

  const bConnector = toTransformedGeometry(bConnectorShape.flip().toGeometry());
  const bShape = bConnectorShape.getContext(shapeToConnect);
  const [bTo, bFrom] = toXYPlaneTransforms(bConnector.planes[0], subtract(bConnector.marks[RIGHT], bConnector.marks[CENTER]));

  // Flatten a.
  const aFlatShape = aShape.transform(aTo);
  const aFlatConnector = toTransformedGeometry(aConnectorShape.transform(aTo).toGeometry());
  const aMarks = aFlatConnector.marks;
  const aFlatOriginShape = aFlatShape.move(...negate(aMarks[CENTER]));

  // Flatten b's connector.
  const bFlatConnector = toTransformedGeometry(bConnectorShape.transform(bTo).toGeometry());
  const bMarks = bFlatConnector.marks;

  // Rotate into alignment.
  const aOrientation = subtract(aMarks[RIGHT], aMarks[CENTER]);
  const bOrientation = subtract(bMarks[RIGHT], bMarks[CENTER]);
  const angle = measureAngle(aOrientation, bOrientation);
  const aFlatOriginRotatedShape = aFlatOriginShape.rotateZ(-angle);

  // Move a to the flat position of b.
  const aFlatBShape = aFlatOriginRotatedShape.move(...bMarks[CENTER]);
  // Move a to the oriented position of b.
  const aMoved = aFlatBShape.transform(bFrom);

  if (doConnect) {
    return Shape.fromGeometry(
      {
        connection: `${aConnector.plan.connector}-${bConnector.plan.connector}`,
        connectors: [aConnector, bConnector],
        geometries: [dropConnector(aMoved, aConnector.plan.connector).toGeometry(),
                     dropConnector(bShape, bConnector.plan.connector).toGeometry()]
      });
  } else {
    return aMoved;
  }
};

export const join = (a, aJoin, bJoin, b) => {
  const aConnection = connect(a, aJoin).toGeometry();
  const bConnection = connect(b, bJoin).toGeometry();
  return Shape.fromGeometry(
    {
      connection: `${aConnection.connection}:${bConnection.connection}`,
      connectors: [...aConnection.connectors, ...bConnection.connectors],
      geometries: [...aConnection.geometries, ...bConnection.geometries],
      tags: ['join']
    });
};

export default connect;

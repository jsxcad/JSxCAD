import { drop, splice, toTransformedGeometry } from '@jsxcad/geometry-tagged';
import { negate, subtract } from '@jsxcad/math-vec3';

import Shape from '@jsxcad/api-v1-shape';
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

const toShape = (connector) => connector.getContext(shapeToConnect);

export const dropConnector = (shape, ...connectors) =>
  Shape.fromGeometry(drop(connectors.map(connector => `connector/${connector}`), shape.toGeometry()));

const dropConnectorMethod = function (...connectors) { return dropConnector(this, ...connectors); };
Shape.prototype.dropConnector = dropConnectorMethod;

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

// FIX: Separate the doConnect dispatched interfaces.
// Connect two shapes at the specified connector.
export const connect = (aConnectorShape, bConnectorShape, { doConnect = true } = {}) => {
  const aConnector = toTransformedGeometry(aConnectorShape.toGeometry());
  const aShape = toShape(aConnectorShape);
  const [aTo] = toXYPlaneTransforms(aConnector.planes[0], subtract(aConnector.marks[RIGHT], aConnector.marks[CENTER]));

  const bConnector = toTransformedGeometry(bConnectorShape.flip().toGeometry());
  const bShape = toShape(bConnectorShape);
  const [bTo, bFrom] = toXYPlaneTransforms(bConnector.planes[0], subtract(bConnector.marks[RIGHT], bConnector.marks[CENTER]));

  // Flatten a.
  const aFlatShape = aShape.transform(aTo);
  const aFlatConnector = aConnectorShape.transform(aTo);
  const aMarks = aFlatConnector.toKeptGeometry().marks;
  const aFlatOriginShape = aFlatShape.move(...negate(aMarks[CENTER]));
  // const aFlatOriginConnector = aFlatConnector.move(...negate(aMarks[CENTER]));

  // Flatten b's connector.
  const bFlatConnector = toTransformedGeometry(bConnectorShape.transform(bTo).toGeometry());
  const bMarks = bFlatConnector.marks;

  // Rotate into alignment.
  const aOrientation = subtract(aMarks[RIGHT], aMarks[CENTER]);
  const bOrientation = subtract(bMarks[RIGHT], bMarks[CENTER]);
  const angle = measureAngle(aOrientation, bOrientation);
  const aFlatOriginRotatedShape = aFlatOriginShape.rotateZ(-angle);
  // const aFlatOriginRotatedConnector = aFlatOriginConnector.rotateZ(-angle);

  // Move a to the flat position of b.
  const aFlatBShape = aFlatOriginRotatedShape.move(...bMarks[CENTER]);
  // const aFlatBConnector = aFlatOriginRotatedConnector.move(...bMarks[CENTER]);
  // Move a to the oriented position of b.
  const aMovedShape = aFlatBShape.transform(bFrom);
  // const aMovedConnector = aFlatBConnector.transform(bFrom);

  if (doConnect) {
    return aMovedShape.Item().with(bShape).Item();
    /*
    return Shape.fromGeometry(
      {
        connection: `${aConnector.plan.connector}-${bConnector.plan.connector}`,
        connectors: [aMovedConnector.toKeptGeometry(), bConnector],
        geometries: [dropConnector(aMovedShape, aConnector.plan.connector).toGeometry()]
            .concat(bShape === undefined
              ? []
              : [dropConnector(bShape, bConnector.plan.connector).toGeometry()])
      });
    */
  } else {
    return aMovedShape;
  }
};

const toMethod = function (connector) { return connect(this, connector); };
Shape.prototype.to = toMethod;
toMethod.signature = 'Connector -> to(from:Connector) -> Shape';

const fromMethod = function (connector) { return connect(connector, this); };
Shape.prototype.from = fromMethod;
fromMethod.signature = 'Connector -> from(from:Connector) -> Shape';

const atMethod = function (connector) { return connect(this, connector, { doConnect: false }); };
Shape.prototype.at = atMethod;
atMethod.signature = 'Connector -> at(target:Connector) -> Shape';

export default connect;

connect.signature = 'connect(to:Connector, from:Connector) -> Shape';

export const join = (a, aJoin, bJoin, b) => {
  const aConnection = connect(a, aJoin).toGeometry();
  const bConnection = connect(b, bJoin).toGeometry();
  const result = Shape.fromGeometry(
    {
      connection: `${aConnection.connection}:${bConnection.connection}`,
      connectors: [...aConnection.connectors, ...bConnection.connectors],
      geometries: [...aConnection.geometries, ...bConnection.geometries],
      tags: ['join']
    });
  return result;
};

export const rejoin = (shape, connectionShape, aJoin, bJoin) => {
  const connection = connectionShape.toKeptGeometry();
  const { connectors, geometries } = connection;
  const rejoined = join(Shape.fromGeometry(geometries[0]).toConnector(Shape.fromGeometry(connectors[0])),
                        aJoin,
                        bJoin,
                        Shape.fromGeometry(geometries[2]).toConnector(Shape.fromGeometry(connectors[2])));
  return Shape.fromGeometry(splice(shape.toKeptGeometry(), connection, rejoined.toGeometry()));
};

// FIX: The toKeptGeometry is almost certainly wrong.
export const joinLeft = (leftArm, joinId, leftArmConnectorId, rightJointConnectorId, joint, leftJointConnectorId, rightArmConnectorId, rightArm) => {
  // leftArm will remain stationary.
  const leftArmConnector = leftArm.connector(leftArmConnectorId);
  const rightJointConnector = joint.connector(rightJointConnectorId);
  const [joinedJointShape, joinedJointConnector] = rightJointConnector.connectTo(leftArmConnector, { doConnect: false });
  const rightArmConnector = rightArm.connector(rightArmConnectorId, { doConnect: false });
  const [joinedRightShape, joinedRightConnector] = rightArmConnector.connectTo(joinedJointShape.connector(leftJointConnectorId), { doConnect: false });
  const result = Shape.fromGeometry(
    {
      connection: joinId,
      connectors: [leftArmConnector.toKeptGeometry(),
                   joinedJointConnector.toKeptGeometry(),
                   joinedRightConnector.toKeptGeometry()],
      geometries: [leftArm.dropConnector(leftArmConnectorId).toKeptGeometry(),
                   joinedJointShape.dropConnector(rightJointConnectorId, leftJointConnectorId).toKeptGeometry(),
                   joinedRightShape.dropConnector(rightArmConnectorId).toKeptGeometry()],
      tags: [`joinLeft/${joinId}`]
    });
  return result;
};

const joinLeftMethod = function (a, ...rest) { return joinLeft(this, a, ...rest); };
Shape.prototype.joinLeft = joinLeftMethod;

export const rejoinLeft = (...joints) => undefined;

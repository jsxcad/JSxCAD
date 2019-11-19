import { dot, length, negate, subtract } from '@jsxcad/math-vec3';
import { drop, toTransformedGeometry } from '@jsxcad/geometry-tagged';
import { fromPoints, toXYPlaneTransforms } from '@jsxcad/math-plane';

import Shape from './Shape';
import assemble from './assemble';
import { shapeToConnect } from './Connector';

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

const ORIGIN = 0;
const ANGLE = 1;

// Connect two shapes at the specified connector.
export const connect = (aConnectorShape, bConnectorShape, { doAssemble = true } = {}) => {
  const aConnector = toTransformedGeometry(aConnectorShape.toGeometry());
  const aShape = aConnectorShape.getContext(shapeToConnect);
  const [aTo] = toXYPlaneTransforms(fromPoints(...aConnector.marks));

  const bConnector = toTransformedGeometry(bConnectorShape.flip().toGeometry());
  const bShape = bConnectorShape.getContext(shapeToConnect);
  const [bTo, bFrom] = toXYPlaneTransforms(fromPoints(...bConnector.marks));

  // Flatten a.
  const aFlatShape = aShape.transform(aTo);
  const aFlatConnector = toTransformedGeometry(aConnectorShape.transform(aTo).toGeometry());
  const aMarks = aFlatConnector.marks;
  const aFlatOriginShape = aFlatShape.move(...negate(aMarks[ORIGIN]));

  // Flatten b's connector.
  const bFlatConnector = toTransformedGeometry(bConnectorShape.transform(bTo).toGeometry());
  const bMarks = bFlatConnector.marks;

  // Rotate into alignment
  const aOrientation = subtract(aMarks[ANGLE], aMarks[ORIGIN]);
  const bOrientation = subtract(bMarks[ANGLE], bMarks[ORIGIN]);
  const radians = Math.acos(dot(aOrientation, bOrientation) / (length(aOrientation) * length(bOrientation)));
  const angle = radians * 180 / Math.PI;
  const aFlatOriginRotatedShape = aFlatOriginShape.rotateZ(angle);

  // Move a to the flat position of b.
  const aFlatBShape = aFlatOriginRotatedShape.move(...bMarks[ORIGIN]);
  // Move a to the oriented position of b.
  const aMoved = aFlatBShape.transform(bFrom);

  if (doAssemble) {
    return assemble(dropConnector(aMoved, aConnector.plan.connector),
                    dropConnector(bShape, bConnector.plan.connector));
  } else {
    return aMoved;
  }
};

export default connect;

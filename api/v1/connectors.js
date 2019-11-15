import Shape from './Shape';
import { getPlans } from '@jsxcad/geometry-tagged';
import { shapeToConnect } from './Connector';

/**
 *
 * # connectors
 *
 * Returns the set of connectors in an assembly by tag.
 * See connect().
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Connector('top').moveZ(5))
 *         .connectors()['top']
 *         .connect(Prism(10, 10).with(Connector('bottom').flip().moveZ(-5))
 *                               .connectors()['bottom']);
 * ```
 * :::
 **/

export const connectors = (shape) => {
  const connectors = {};
  for (const entry of getPlans(shape.toKeptGeometry())) {
    if (entry.plan.connector && (entry.tags === undefined || !entry.tags.includes('compose/non-positive'))) {
      connectors[entry.plan.connector] = Shape.fromGeometry(entry, { [shapeToConnect]: shape });
    }
  }
  return connectors;
};

const connectorsMethod = function () { return connectors(this); };
Shape.prototype.connectors = connectorsMethod;

export default connectors;

import { getConnections, getPlans } from '@jsxcad/geometry-tagged';

import Plan from './Plan';
import Shape from './Shape';

/**
 *
 * # Connector
 *
 * Returns a connector plan.
 * See connect().
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Connector('top').move(5))
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).Connector('top').moveZ(5).connect(Sphere(5).Connector('bottom').flip().moveZ(-5))
 * ```
 * :::
 **/

export const shapeToConnect = Symbol('shapeToConnect');

// A connector expresses a joint-of-connection extending from origin along axis to end.
// The orientation expresses the direction of facing orthogonal to that axis.
// The joint may have a zero length (origin and end are equal), but axis must not equal origin.
// Note: axis must be further than end from origin.

export const Connector = (connector, { plane = [0, 0, 1, 0], center = [0, 0, 0], right = [1, 0, 0], start = [0, 0, 0], end = [0, 0, 0], shape, visualization } = {}) => {
  const plan = Plan(// Geometry
    {
      plan: { connector },
      marks: [center, right, start, end],
      planes: [plane],
      tags: [`connector/${connector}`],
      visualization
    },
    // Context
    {
      [shapeToConnect]: shape
    });
  return plan;
};

Plan.Connector = Connector;

const ConnectorMethod = function (connector, options) { return Connector(connector, { ...options, [shapeToConnect]: this }); };
Shape.prototype.Connector = ConnectorMethod;

export default Connector;

Connector.signature = 'Connector(id:string, { plane:Plane, center:Point, right:Point, start:Point, end:Point, shape:Shape, visualization:Shape }) -> Shape';

// Associates an existing connector with a shape.
const toConnectorMethod = function (connector, options) { return Shape.fromGeometry(connector.toKeptGeometry(), { ...options, [shapeToConnect]: this }); };
Shape.prototype.toConnector = toConnectorMethod;

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
  const connectors = [];
  for (const entry of getPlans(shape.toKeptGeometry())) {
    if (entry.plan.connector && (entry.tags === undefined || !entry.tags.includes('compose/non-positive'))) {
      connectors.push(Shape.fromGeometry(entry, { [shapeToConnect]: shape }));
    }
  }
  return connectors;
};

const connectorsMethod = function () { return connectors(this); };
Shape.prototype.connectors = connectorsMethod;

/**
 *
 * # connector
 *
 * Returns a connector from an assembly.
 * See connect().
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Prism(10, 10).with(Connector('top').moveZ(5))
 *              .connector('top')
 *              .connect(Cube(10).with(Connector('bottom').flip().moveZ(-5))
 *                               .connector('bottom'));
 * ```
 * :::
 **/

export const connector = (shape, id) => {
  for (const connector of connectors(shape)) {
    if (connector.toGeometry().plan.connector === id) {
      return connector;
    }
  }
};

const connectorMethod = function (id) { return connector(this, id); };
Shape.prototype.connector = connectorMethod;

export const connection = (shape, id) => {
  const shapeGeometry = shape.toKeptGeometry();
  const connections = getConnections(shapeGeometry);
  for (const geometry of connections) {
    if (geometry.connection === id) {
      return Shape.fromGeometry(geometry);
    }
  }
};

const connectionMethod = function (id) { return connection(this, id); };
Shape.prototype.connection = connectionMethod;

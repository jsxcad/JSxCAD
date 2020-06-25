import Plan from '@jsxcad/api-v1-plan';
import Shape from '@jsxcad/api-v1-shape';
import { visit } from '@jsxcad/geometry-tagged';

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

// A connector is an oriented reference point.
//
// The orientation expresses the direction of facing orthogonal to that axis.
// The joint may have a zero length (origin and end are equal), but axis must not equal origin.
// Note: axis must be further than end from origin.

export const Connector = (
  connector,
  {
    plane = [0, 0, 1, 0],
    center = [0, 0, 0],
    right = [1, 0, 0],
    start = [0, 0, 0],
    end = [0, 0, 0],
    shape,
    visualization,
  } = {}
) => {
  const plan = Plan(
    // Geometry
    {
      plan: { connector },
      marks: [center, right, start, end],
      planes: [plane],
      tags: [`connector/${connector}`],
      visualization,
    },
    // Context
    {
      [shapeToConnect]: shape,
    }
  );
  return plan;
};

Plan.Connector = Connector;

const ConnectorMethod = function (connector, options) {
  return Connector(connector, { ...options, [shapeToConnect]: this });
};
Shape.prototype.Connector = ConnectorMethod;

export default Connector;

Connector.signature =
  'Connector(id:string, { plane:Plane, center:Point, right:Point, start:Point, end:Point, shape:Shape, visualization:Shape }) -> Shape';

// Associates an existing connector with a shape.
const toConnectorMethod = function (connector, options) {
  return Shape.fromGeometry(connector.toKeptGeometry(), {
    ...options,
    [shapeToConnect]: this,
  });
};
Shape.prototype.toConnector = toConnectorMethod;

/**
 *
 * # connectors
 *
 * Returns the set of connectors in an assembly by tag.
 * Note that connectors inside Items are not visible.
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
  const walk = (geometry, descend) => {
    if (geometry.item) {
    } else if (geometry.plan && geometry.plan.connector) {
      connectors.push(
        Shape.fromGeometry(geometry, { [shapeToConnect]: shape })
      );
    } else {
      descend();
    }
  };
  visit(shape.toKeptGeometry(), walk);
  return connectors;
};

const connectorsMethod = function () {
  return connectors(this);
};
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

const connectorMethod = function (id) {
  return connector(this, id);
};
Shape.prototype.connector = connectorMethod;

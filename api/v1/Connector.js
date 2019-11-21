import Plan from './Plan';
import Shape from './Shape';
import connectors from './connectors';

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

const isNan = (v) => typeof v === 'number' && isNaN(v);

export const Connector = (connector, { origin = [0, 0, 0], end = [1, 0, 0], angle = [0, 1, 0], shape } = {}) => {
  if (isNan(origin) || isNan(angle) || isNan(end)) {
    throw Error('die');
  }
  return Plan({ plan: { connector }, marks: [origin, angle, end], tags: [`connector/${connector}`] },
              { [shapeToConnect]: shape });
};

Plan.Connector = Connector;

const ConnectorMethod = function (connector, options) { return Connector(connector, { ...options, shape: this }); };
Shape.prototype.Connector = ConnectorMethod;

export default Connector;

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

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

const isNan = (v) => typeof v === 'number' && isNaN(v);

export const Connector = (connector, { a = [0, 0, 0], b = [1, 0, 0], c = [0, 1, 0], shape } = {}) => {
  if (isNan(a) || isNan(b) || isNan(c)) {
    throw Error('die');
  }
  return Plan({ plan: { connector }, marks: [a, b, c], tags: [`connector/${connector}`] },
              { [shapeToConnect]: shape });
};

Plan.Connector = Connector;

const ConnectorMethod = function (connector, options) { return Connector(connector, { ...options, shape: this }); };
Shape.prototype.Connector = ConnectorMethod;

export default Connector;

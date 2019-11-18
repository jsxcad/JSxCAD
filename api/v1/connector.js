import Shape from './Shape';
import connectors from './connectors';

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

const connector = (geometry, id) => {
  for (const connector of connectors(geometry)) {
    if (connector.toGeometry().plan.conector === id) {
      return connector;
    }
  }
};

const connectorMethod = function (id) { return connector(this, id); };
Shape.prototype.connector = connectorMethod;

export default connector;

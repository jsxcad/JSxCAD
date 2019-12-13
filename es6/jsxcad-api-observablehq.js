import * as api from './jsxcad-api-v1.js';
import { Shape } from './jsxcad-api-v1.js';
import { staticDisplay } from './jsxcad-ui-threejs.js';
import { toThreejsGeometry } from './jsxcad-convert-threejs.js';

const display = (shape, { view, page = {} } = {}) => {
  const { width = 1024, height = 512 } = page;
  const threejsGeometry = toThreejsGeometry(shape.toKeptGeometry);
  const { canvas } = staticDisplay({ view, threejsGeometry },
                                   { offsetWidth: width, offsetHeight: height });
  return canvas;
};

const displayMethod = function (...args) { return display(this, ...args); };

Shape.prototype.display = displayMethod;

/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

export default api;

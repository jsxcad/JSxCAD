import { Shape } from './jsxcad-api-v1.js';
export * from './jsxcad-api-v1.js';
import { staticDisplay } from './jsxcad-ui-threejs.js';
import { toThreejsGeometry } from './jsxcad-convert-threejs.js';

const display = (shape, { view, width = 1024, height = 512 } = {}) => {
  const threejsGeometry = toThreejsGeometry(shape.toKeptGeometry());
  const { canvas } = staticDisplay({ view, threejsGeometry },
                                   { offsetWidth: width, offsetHeight: height });
  canvas.style = `width: ${width}px; height: ${height}px`;
  return canvas;
};

const displayMethod = function (...args) { return display(this, ...args); };

Shape.prototype.display = displayMethod;

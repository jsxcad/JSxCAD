import { Shape } from '@jsxcad/api-v1';
import { staticDisplay } from '@jsxcad/ui-threejs';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

export const display = (shape, { view, width = 1024, height = 512 } = {}) => {
  const threejsGeometry = toThreejsGeometry(shape.toKeptGeometry());
  const { canvas } = staticDisplay({ view, threejsGeometry },
                                   { offsetWidth: width, offsetHeight: height });
  canvas.style = `width: ${width}px; height: ${height}px`;
  return canvas;
};

const displayMethod = function (...args) { return display(this, ...args); };

Shape.prototype.display = displayMethod;

export default display;
